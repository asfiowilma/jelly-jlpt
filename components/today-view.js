"use strict";

// Today tab: the day's loop as a checklist (read a stage → pass its quiz → review due cards → done).
// The plan itself is lib.js dayPlan(); this file turns it into screen copy. English only for now
// (copy pass: .scratch/today-home/copy.md); Japanese joins per level like the rest of the UI.

var tdPlural = dayPlural;
// ~15 s a card, at least a minute
function tdReviewMins(n) { return Math.max(1, Math.round(n * 0.25)); }
function tdUnitMins(u) {
  if (u.kind === 'mock' && CATALOG.items[u.mock]) {
    return mockSections(CATALOG.items[u.mock]).reduce(function (n, s) { return n + Math.round(s.seconds / 60); }, 0);
  }
  return u.kind === 'lesson' ? 12 : 10;
}
var TD_KIND = { lesson: 'Lesson', kana: 'Kana', review: 'Review quiz', prep: 'Test prep', mock: 'Mock exam' };
function tdUnitChips(u) {
  var parts = [];
  if (u.kana.length) parts.push(u.kana.length + ' kana');
  if (u.vocab.length) parts.push(tdPlural(u.vocab.length, '{n} word', '{n} words'));
  if (u.kanji.length) parts.push(u.kanji.length + ' kanji');
  if (u.grammar.length) parts.push(u.grammar.length + ' grammar');
  return [TD_KIND[u.kind] || 'Stage', '~' + tdUnitMins(u) + ' min'].concat(u.kind === 'lesson' || u.kind === 'kana' ? [parts.join(' · ')] : []).filter(Boolean);
}
function tdStageTodo(u) {
  if (u.kind === 'mock') return 'Take the mock to finish';
  return (u.kind === 'lesson' || u.kind === 'kana' ? 'Read the lesson, then pass' : 'Pass') + ' the quiz (' + passMarkText(u) + ')';
}
function tdPaceChip(pace) {
  var m = paceMode(pace), k = m.key.replace('pace_', '');
  var name = k === 'super' ? 'Super' : t('pace_' + k + '_n', 'N5');
  return name + ' · ' + t('pace_' + k + '_h', 'N5').replace(/\.$/, '');
}

// currentDayPlan: reads the store for today's passes, last pass date and reviews, then calls dayPlan.
function currentDayPlan(units, completed, pace, cards) {
  var now = Date.now(), today = localDate(new Date(now));
  var byId = {};
  units.forEach(function (u) { byId[u.id] = u; });
  var comps = realCompletions(Store.docs());
  var agg = aggregateLogs(Store.logs()), day = agg[today];
  return {
    plan: dayPlan({
      pace: pace, now: now, cards: cards,
      doneToday: comps.filter(function (c) { return localDate(new Date(c.at)) === today && byId[c.id]; }).map(function (c) { return byId[c.id]; }),
      lastStageDate: comps.length ? localDate(new Date(comps[comps.length - 1].at)) : null,
      ahead: units.filter(function (u) { return !completed.has(u.id); }).slice(0, 3),
      reviewedToday: day ? day.reviews.count : 0
    }),
    reviewedToday: day ? day.reviews.count : 0,
    studiedToday: studyDates(Store.logs()).indexOf(today) >= 0,
    quizzes: day ? day.quizzes : []
  };
}

function TodayView(props) {
  var h = React.createElement, plan = props.plan, units = props.units, cards = props.cards, streak = props.streak;
  var counted = plan.steps.filter(function (s) { return s.status !== 'rest'; });
  var nowStep = plan.steps.filter(function (s) { return s.status === 'now'; })[0];
  var nowIdx = counted.indexOf(nowStep) + 1, total = counted.length;
  var now = Date.now();
  var nextStage = units.filter(function (u) { return !props.completed.has(u.id); })[0];
  var newToday = Object.keys(cards).filter(function (id) {
    return cards[id].due <= now && cards[id].addedAt && localDate(new Date(cards[id].addedAt)) === localDate(new Date(now));
  }).length;
  var passPct = function (u) {
    var q = props.quizzes.filter(function (x) { return x.unit === u.id && x.total; }).pop();
    return q ? Math.round(q.right / q.total * 100) : null;
  };
  var reviewMeta = function (s) {
    var m = tdReviewMins(s.due), after = 0;
    plan.steps.forEach(function (x) {
      if (x.kind === 'stage' && x.status !== 'done' && x.status !== 'rest') after += unitItems([x.unit]).length;
    });
    if (s.status === 'done') return tdPlural(props.reviewedToday, '{n} card · done', '{n} cards · done');
    if (!s.due) return Object.keys(cards).length ? 'No cards due' : 'Cards unlock after ' + (nextStage ? 'Stage ' + (nextStage.index + 1) : 'your first stage');
    return s.due + ' due now' + (after ? ', +' + after + ' after the stage' + (plan.steps.filter(function (x) { return x.kind === 'stage' && x.status !== 'done' && x.status !== 'rest'; }).length > 1 ? 's' : '') : '') + ' · ~' + m + ' min';
  };
  var completeMeta = function () {
    if (plan.done || props.studiedToday) return 'Streak ' + streak + ' 🔥';
    return streak > 0 ? 'Streak ' + streak + ' → ' + (streak + 1) : 'Streak starts at 1';
  };

  // ── Hero ──
  var hero;
  if (plan.done) {
    var doneStages = plan.steps.filter(function (s) { return s.kind === 'stage' && s.status === 'done'; });
    hero = { cls: ' td-done', done: true, eyebrow: 'Day complete', title: "That's today done.",
      chips: doneStages.map(function (s) { return 'Stage ' + (s.unit.index + 1) + ' done'; })
        .concat(props.reviewedToday ? [tdPlural(props.reviewedToday, '{n} card reviewed', '{n} cards reviewed')] : [])
        .concat(streak ? ['🔥 ' + tdPlural(streak, '{n} day', '{n} days')] : []) };
  } else if (plan.levelEnd) {
    hero = { eyebrow: props.level + ' complete', title: "You've finished every " + props.level + ' stage.', lead: 'Take a mock exam or keep your reviews going. N4 is on its way.',
      cta: 'Take a mock exam', onCta: props.onMock };
  } else if (nowStep.kind === 'review') {
    var n = nowStep.due;
    hero = plan.backlog
      ? { eyebrow: 'Catch up first · step ' + nowIdx + ' of ' + total, title: 'Catch-up review · ' + tdPlural(n, '{n} card', '{n} cards'), chips: ['~' + tdReviewMins(n) + ' min', 'Split it over a few sessions'], cta: 'Start catch-up', onCta: props.onReview }
      : { eyebrow: plan.rest ? 'Rest day · review only' : 'Up next · step ' + nowIdx + ' of ' + total, title: 'Review · ' + tdPlural(n, '{n} card', '{n} cards'),
          chips: ['~' + tdReviewMins(n) + ' min']
            .concat(newToday ? [newToday + ' new' + (n > newToday ? ' · ' + (n - newToday) + ' from before' : '')] : [])
            .concat(plan.rest ? ['Next stage: ' + (plan.nextStageIn === 1 ? 'tomorrow' : 'in ' + plan.nextStageIn + ' days')] : []),
          cta: 'Start review', onCta: props.onReview };
  } else {
    var u = nowStep.unit;
    hero = { eyebrow: 'Up next · step ' + nowIdx + ' of ' + total, title: 'Stage ' + (u.index + 1) + ' · ' + u.title,
      chips: tdUnitChips(u).concat(plan.stageTarget > 1 ? [plan.stagesDone + 1 + ' of ' + plan.stageTarget + ' stages today'] : []),
      cta: 'Start stage ' + (u.index + 1), onCta: function () { props.onOpenStage(u.index); } };
  }

  // ── Tomorrow (day complete) ──
  var tomorrow = null;
  if (plan.done) {
    var c = dueForecast(cards, now, 2).perDay[1];
    var casualRest = todayTarget(props.pace).everyDays > 1 && nextStage;
    tomorrow = (casualRest ? 'Tomorrow: review only' : nextStage ? 'Tomorrow: Stage ' + (nextStage.index + 1) + ' · ' + nextStage.title : 'Tomorrow: review')
      + (c ? ' · ~' + tdPlural(c, '{n} card due', '{n} cards due') : '');
  }

  var stepRow = function (s, i) {
    var title, meta, link = null;
    if (s.kind === 'stage') {
      title = 'Stage ' + (s.unit.index + 1);
      if (s.status === 'done') meta = passPct(s.unit) ? 'Passed · ' + passPct(s.unit) + '%' : 'Passed';
      else if (s.status === 'rest') {
        meta = plan.nextStageIn === 1 ? 'Next stage day is tomorrow' : 'Next stage day is in ' + plan.nextStageIn + ' days';
        link = { label: 'Learn a stage anyway', onClick: function () { props.onOpenStage(s.unit.index); } };
      } else if (plan.backlog && s.status === 'next') meta = s.unit.title;
      else if (plan.stageTarget > 1) meta = plan.stagesDone + ' of ' + plan.stageTarget + ' stages done today';
      else meta = tdStageTodo(s.unit);
      if (s.status === 'now') link = { label: 'Open →', aria: 'Open stage ' + (s.unit.index + 1), onClick: function () { props.onOpenStage(s.unit.index); } };
    } else if (s.kind === 'review') {
      title = 'Review';
      meta = reviewMeta(s);
      if (s.status === 'now') link = { label: 'Open →', aria: 'Open review', onClick: props.onReview };
    } else { title = 'Day complete'; meta = completeMeta(); }
    var num = counted.indexOf(s) + 1;
    return h('div', { key: i, className: 'td-step ' + s.status },
      h('span', { className: 'td-ic', 'aria-hidden': 'true' }, s.status === 'done' ? '✓' : (num > 0 ? num : '')),
      h('div', null, h('div', { className: 'td-t' }, title), h('div', { className: 'td-m' }, meta)),
      link && h('button', { className: 'td-link', 'aria-label': link.aria, onClick: link.onClick }, link.label));
  };
  var doneCount = counted.filter(function (s) { return s.status === 'done'; }).length;

  return h('div', { className: 'today' },
    h('div', { className: 'td-hd' },
      h('h1', null, t('view_today', props.level)),
      h('button', { className: 'td-chip', onClick: props.onSettings, 'aria-label': 'Pace: ' + tdPaceChip(props.pace) + '. Change in Settings' }, tdPaceChip(props.pace)),
      h('span', { className: 'td-date' }, new Date(now).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }))),
    h('div', { className: 'td-bar', role: 'img', 'aria-label': 'Plan progress: ' + doneCount + ' of ' + total + ' steps done' },
      counted.map(function (s, i) { return h('i', { key: i, className: s.status === 'done' ? 'on' : s.status === 'now' ? 'cur' : '' }); })),
    plan.backlog && h('div', { className: 'td-banner' }, h('b', null, tdPlural(plan.due, '{n} card is waiting.', '{n} cards are waiting.')), " Review first so new material doesn't pile up. Stages stay open."),
    h('section', { className: 'qz-entry' + (hero.cls || ''), 'aria-label': 'Up next: ' + hero.title },
      hero.done ? h(JellyExcited, { size: 72 }) : jelly('idle', 64, true, true),
      h('div', { className: 'txt' },
        h('div', { className: 'eyebrow' }, hero.eyebrow),
        h('h3', null, hero.title),
        hero.lead && h('p', { className: 'note' }, hero.lead),
        hero.chips && hero.chips.length > 0 && h('div', { className: 'chips' }, hero.chips.map(function (x, i) { return h('span', { key: i, className: 'chip' }, x); }))),
      hero.cta && h('button', { className: 'quiz-start-btn', onClick: hero.onCta }, hero.cta)),
    h('section', { className: 'td-plan', 'aria-label': "Today's plan" },
      h('h2', null, "Today's plan", h('span', { 'aria-label': doneCount + ' of ' + total + ' steps done' }, doneCount + ' / ' + total)),
      plan.steps.map(stepRow)),
    tomorrow && h('p', { className: 'td-note' }, tomorrow),
    plan.done && nextStage && h('p', { className: 'td-note' }, 'Want more? Any stage is open.'),
    plan.done && nextStage && h('div', null, h('button', { className: 'btn-outline', onClick: function () { props.onOpenStage(nextStage.index); } }, 'Learn a stage anyway')),
    plan.rest && !plan.done && h('p', { className: 'td-note' }, 'Casual pace means one stage every 2 days. Review still counts toward your streak.'));
}
