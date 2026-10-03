"use strict";

// StatsView (ticket 28, sketch .scratch/roadmap/assets/overview-stats.html v2):
// KPI row · Upcoming reviews | Card maturity · Study activity heatmap.
// Reads cards from props and the activity log from Store on every render;
// App re-renders on 'store-changed' / 'activity-logged'.
var STAGE_LABELS = ['New', 'Learning', 'Young', 'Mature'];
var STAGE_COLORS = ['var(--m-new)', 'var(--m-learn)', 'var(--m-young)', 'var(--m-mature)'];
var TYPE_LABELS = { kana: 'Kana', vocab: 'Vocab', kanji: 'Kanji', grammar: 'Grammar' };

function statsFmt(n) { return n.toLocaleString('en-US'); }
function statsPct(x) { return Math.round(x * 100) + '%'; }
function statsDay(s) { var p = s.split('-'); return new Date(+p[0], p[1] - 1, +p[2]); }
function statsDateLabel(d, opts) { return d.toLocaleDateString('en-US', opts); }

// Sparkline of weekly retention (nulls skipped); nothing with < 2 points.
function RetentionSpark(props) {
  var pts = [], n = props.values.length;
  props.values.forEach(function (x, i) { if (x != null) pts.push([i, x]); });
  if (pts.length < 2) return null;
  var ys = pts.map(function (p) { return p[1]; });
  var lo = Math.min.apply(null, ys) - 0.02, hi = Math.max.apply(null, ys) + 0.02;
  var xy = pts.map(function (p) { return [p[0] / (n - 1) * 100, 28 - (p[1] - lo) / (hi - lo) * 28]; });
  var last = xy[xy.length - 1];
  return React.createElement("svg", { className: "spark", viewBox: "0 0 100 28", preserveAspectRatio: "none", 'aria-hidden': "true" },
    React.createElement("polyline", { points: xy.map(function (p) { return p.join(','); }).join(' '), fill: "none", stroke: "var(--accent-fg)",
      strokeWidth: 2, vectorEffect: "non-scaling-stroke", strokeLinejoin: "round", strokeLinecap: "round" }),
    // End dot: a zero-length round-capped line stays round under preserveAspectRatio=none.
    [["var(--surface)", 10], ["var(--accent-fg)", 6]].map(function (d) {
      return React.createElement("line", { key: d[1], x1: last[0], y1: last[1], x2: last[0], y2: last[1], stroke: d[0], strokeWidth: d[1],
        strokeLinecap: "round", vectorEffect: "non-scaling-stroke" });
    }));
}

function StatsView(props) {
  var cards = props.cards || {};
  var tipRef = React.useRef(null);
  var hmRef = React.useRef(null);
  // Phone width: the heatmap scrolls; start at the most recent weeks.
  React.useEffect(function () {
    if (hmRef.current) hmRef.current.scrollLeft = hmRef.current.scrollWidth;
  }, []);
  var _fc = React.useState(false), fcTable = _fc[0], setFcTable = _fc[1];
  var _mt = React.useState(false), matTable = _mt[0], setMatTable = _mt[1];
  var now = Date.now(), today = localDate(new Date(now));
  var logs = Store.logs();
  var deck = srsStats(cards);
  var fc = dueForecast(cards, now, 14);
  var dueNow = srsDueCards(cards).length;
  var ret = retention(logs, today, 30);
  var weekly = weeklyRetention(logs, today, 12);
  var streak = computeStreak(studyDates(logs), today);
  var cells = studyHeatmap(logs, today, 52);
  var ce = React.createElement;
  var dayOf = function (i) { var d = new Date(now); return new Date(d.getFullYear(), d.getMonth(), d.getDate() + i); };

  // Shared tooltip: follows the pointer over any [data-tip]; on keyboard focus
  // it sits above the focused mark.
  function showTip(text, x, y) {
    var el = tipRef.current;
    if (!el) return;
    if (!text) { el.classList.remove('on'); return; }
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.classList.add('on');
  }
  function onMove(e) {
    var t = e.target.closest && e.target.closest('[data-tip]');
    showTip(t && t.getAttribute('data-tip'), e.clientX, e.clientY);
  }
  function onFocus(e) {
    var t = e.target.closest && e.target.closest('[data-tip]');
    if (!t) return showTip(null);
    var r = t.getBoundingClientRect();
    showTip(t.getAttribute('data-tip'), r.left + r.width / 2, r.top);
  }
  function hideTip() { showTip(null); }

  var card = function (label, right, body) {
    return ce("section", { className: "panel", 'aria-label': label },
      ce("h2", { className: "panel-h" }, label, right && ce("span", { className: "r" }, right)), body);
  };
  var tableBtn = function (on, set) {
    return ce("button", { key: "tb", type: "button", className: "linkish", 'aria-expanded': on, onClick: function () { set(!on); } }, on ? "Hide table" : "Table");
  };
  var empty = function (title, text) { return ce("div", { className: "stats-empty" }, ce("b", null, title), text); };

  // ── KPIs ──
  var overdue = fc.overdue;
  var kpis = ce("section", { className: "kpis", 'aria-label': "Key numbers" },
    ce("div", { className: "panel kpi" },
      ce("span", { className: "lbl" }, "Due now"),
      ce("span", { className: "val" }, statsFmt(dueNow), ce("small", null, "cards")),
      dueNow > 0 && ce("span", { className: "ctx" }, overdue > 0 && ce("b", null, overdue), overdue > 0 && " overdue · ", dueNow - overdue, " due today"),
      dueNow > 0 ? ce("button", { type: "button", className: "cta", onClick: props.onReview }, "Start review")
        : ce("span", { className: "ctx" }, deck.total ? "All caught up" : "Finish a stage to add cards")),
    ce("div", { className: "panel kpi" },
      ce("span", { className: "lbl" }, "Retention · 30 days"),
      ce("span", { className: "val" }, ret.rate == null ? "—" : statsPct(ret.rate)),
      ce("span", { className: "ctx" }, ret.rate == null ? "Shows after your first reviews" : "of " + statsFmt(ret.reviews) + " reviews right first time"),
      ce(RetentionSpark, { values: weekly })),
    ce("div", { className: "panel kpi" },
      ce("span", { className: "lbl" }, "Streak"),
      ce("span", { className: "val" }, streak.current, ce("small", null, streak.current === 1 ? "day" : "days")),
      ce("span", { className: "ctx" }, streak.longest ? ["Longest ", ce("b", { key: "b" }, streak.longest), " days"] : "Study today to start one")),
    ce("div", { className: "panel kpi" },
      ce("span", { className: "lbl" }, "Deck"),
      ce("span", { className: "val" }, statsFmt(deck.total), ce("small", null, "cards")),
      ce("span", { className: "ctx" }, deck.total ? [ce("b", { key: "b" }, statsFmt(deck.mature)), " mature · " + statsPct(deck.mature / deck.total) + " of deck"] : "Cards come from finished stages")));

  // ── Upcoming reviews ──
  var max = Math.max.apply(null, [1, overdue].concat(fc.perDay));
  var peak = Math.max.apply(null, fc.perDay);
  var col = function (key, cls, v, tip, label) {
    return ce("div", { key: key, className: "fc-col" + cls, 'data-tip': tip, tabIndex: 0, role: "listitem", 'aria-label': tip },
      ce("span", { className: "v", 'aria-hidden': "true" }, label ? v : ""),
      ce("i", { style: { height: v / max * 100 + '%' } }));
  };
  var next7 = fc.perDay.slice(0, 7).reduce(function (a, b) { return a + b; }, 0);
  var forecast = card("Upcoming reviews",
    deck.total > 0 && [statsFmt(next7) + " in the next 7 days · ", tableBtn(fcTable, setFcTable)],
    deck.total === 0 ? empty("No reviews scheduled yet", "Finish your first stage and its cards show up here.") : [
      ce("div", { key: "c", className: "fc", role: "list", 'aria-label': "Reviews due over the next 14 days" },
        col("o", " over", overdue, overdue + " overdue", true),
        fc.perDay.map(function (v, i) {
          var tip = (i === 0 ? "Today" : statsDateLabel(dayOf(i), { weekday: 'long', month: 'short', day: 'numeric' })) + ": " + v + " due";
          return col(i, i === 0 ? " today" : "", v, tip, i === 0 || (v === peak && v > 0));
        })),
      ce("div", { key: "x", className: "fc-x", 'aria-hidden': "true" },
        ce("span", { className: "o" }, "Overdue"),
        fc.perDay.map(function (_, i) {
          var d = dayOf(i);
          return ce("span", { key: i, className: i === 0 ? "t" : i < 7 ? "wd" : "" },
            i === 0 ? "Today" : i < 7 ? statsDateLabel(d, { weekday: 'short' }) : i === 7 || i === 13 ? d.getMonth() + 1 + "/" + d.getDate() : "");
        })),
      fcTable && ce("table", { key: "tb", className: "data" },
        ce("thead", null, ce("tr", null, ce("th", null, "Day"), ce("th", null, "Due"))),
        ce("tbody", null,
          ce("tr", null, ce("td", null, "Overdue"), ce("td", null, overdue)),
          fc.perDay.map(function (v, i) {
            return ce("tr", { key: i }, ce("td", null, statsDateLabel(dayOf(i), { weekday: 'short', month: 'short', day: 'numeric' })), ce("td", null, v));
          })))
    ]);

  // ── Card maturity ──
  var counts = [deck['new'], deck.learning, deck.young, deck.mature];
  var types = SRS_TYPES.filter(function (ty) { return deck.byType[ty] && deck.byType[ty].some(Boolean); });
  var stack = function (arr, prefix, focusable) {
    return arr.map(function (v, i) {
      if (!v) return null;
      var tip = prefix + STAGE_LABELS[i] + ": " + statsFmt(v) + (prefix ? "" : " cards (" + statsPct(v / deck.total) + ")");
      return ce("i", { key: i, style: { flex: v, background: STAGE_COLORS[i] }, 'data-tip': tip, tabIndex: focusable ? 0 : undefined,
        role: "listitem", 'aria-label': tip });
    });
  };
  var maturity = card("Card maturity", deck.total > 0 && tableBtn(matTable, setMatTable),
    deck.total === 0 ? empty("Your deck is empty", "Each stage you finish adds its words, kanji and grammar here.") : [
      ce("div", { key: "s", className: "stack", role: "list", 'aria-label': "Card maturity" }, stack(counts, "", true)),
      ce("div", { key: "l", className: "legend" }, counts.map(function (v, i) {
        return ce("div", { key: i }, ce("i", { style: { background: STAGE_COLORS[i] } }), STAGE_LABELS[i], ce("b", null, statsFmt(v)));
      })),
      ce("div", { key: "t", className: "types" }, types.map(function (ty) {
        var arr = deck.byType[ty];
        return ce("div", { key: ty, className: "trow" },
          ce("span", null, TYPE_LABELS[ty] || ty),
          ce("div", { className: "stack", role: "list", 'aria-label': TYPE_LABELS[ty] + " maturity" }, stack(arr, (TYPE_LABELS[ty] || ty) + " · ", false)),
          ce("span", { className: "n" }, statsFmt(arr.reduce(function (a, b) { return a + b; }, 0))));
      })),
      matTable && ce("table", { key: "tb", className: "data" },
        ce("thead", null, ce("tr", null, ce("th", null, "Type"), STAGE_LABELS.map(function (s) { return ce("th", { key: s }, s); }))),
        ce("tbody", null, types.map(function (ty) {
          return ce("tr", { key: ty }, ce("td", null, TYPE_LABELS[ty] || ty), deck.byType[ty].map(function (v, i) { return ce("td", { key: i }, v); }));
        })))
    ]);

  // ── Study activity heatmap (52 weeks, column = week, Sun..Sat) ──
  var studyDays = 0, reviews = 0;
  var months = [];
  var hm = cells.map(function (c, i) {
    var d = statsDay(c.date);
    if (i % 7 === 0) months.push(ce("span", { key: i }, d.getDate() <= 7 ? statsDateLabel(d, { month: 'short' }) : ""));
    if (c.future) return ce("i", { key: c.date, className: "future" });
    if (c.reviews || c.lessons) studyDays++;
    reviews += c.reviews;
    var what = [];
    if (c.reviews) what.push(c.reviews + (c.reviews === 1 ? " review" : " reviews"));
    if (c.lessons) what.push(c.lessons + (c.lessons === 1 ? " stage" : " stages"));
    return ce("i", { key: c.date, className: "l" + c.level + (c.date === today ? " today" : ""),
      'data-tip': statsDateLabel(d, { weekday: 'short', month: 'short', day: 'numeric' }) + ": " + (what.length ? what.join(", ") : "no study") });
  });
  var heat = card("Study activity", "last 12 months", [
    ce("div", { key: "g", className: "hm-scroll", ref: hmRef },
      ce("div", { className: "hm-grid" },
        ce("span", null),
        ce("div", { className: "hm-months", 'aria-hidden': "true" }, months),
        ce("div", { className: "hm-days", 'aria-hidden': "true" }, ["", "Mon", "", "Wed", "", "Fri", ""].map(function (s, i) { return ce("span", { key: i }, s); })),
        ce("div", { className: "hm", role: "img", 'aria-label': "Daily study activity, last 12 months: " + studyDays + " study days" }, hm))),
    ce("div", { key: "f", className: "hm-foot" }, "Less ",
      ce("span", { className: "sw", 'aria-hidden': "true" }, [0, 1, 2, 3, 4].map(function (l) { return ce("i", { key: l, className: "l" + l }); })),
      " More",
      ce("span", { className: "sum" }, studyDays ? [ce("b", { key: "d" }, studyDays), " study days · ", ce("b", { key: "r" }, statsFmt(reviews)), " reviews"] : "Your study days will fill this in"))
  ]);

  return ce("div", { className: "stats", onPointerMove: onMove, onPointerLeave: hideTip, onFocus: onFocus, onBlur: hideTip },
    kpis,
    ce("div", { className: "two" }, forecast, maturity),
    heat,
    ce("div", { ref: tipRef, className: "chart-tip", role: "tooltip", 'aria-hidden': "true" }));
}
