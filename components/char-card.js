"use strict";

// ── CharCard with Stroke Order ───────────────────────────────────────────────
function CharCard(_ref9a) {
  var char = _ref9a.char,
    isKanji = _ref9a.isKanji;
  var _React$useState9a = React.useState(false),
    _React$useState9b = _slicedToArray(_React$useState9a, 2),
    showStroke = _React$useState9b[0],
    setShowStroke = _React$useState9b[1];
  var _React$useState9c = React.useState(null),
    _React$useState9d = _slicedToArray(_React$useState9c, 2),
    strokeSvg = _React$useState9d[0],
    setStrokeSvg = _React$useState9d[1];
  var _React$useState9e = React.useState(false),
    _React$useState9f = _slicedToArray(_React$useState9e, 2),
    loading = _React$useState9f[0],
    setLoading = _React$useState9f[1];
  var _React$useState9g = React.useState(false),
    _React$useState9h = _slicedToArray(_React$useState9g, 2),
    error = _React$useState9h[0],
    setError = _React$useState9h[1];
  
  var fetchStroke = function() {
    setLoading(true);
    setError(false);
    loadStrokeOrderSvg(char[0])
      .then(function(svg) {
        setStrokeSvg(sanitizeSvg(svg));
        setShowStroke(true);
        setLoading(false);
      })
      .catch(function() {
        setError(true);
        setLoading(false);
      });
  };

  var toggleStroke = function() {
    if (!showStroke && !strokeSvg && !error) {
      fetchStroke();
    } else {
      setShowStroke(!showStroke);
    }
  };
  
  return /*#__PURE__*/React.createElement("div", {
    className: "char-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "char-jp"
  }, char[0]), /*#__PURE__*/React.createElement("button", {
    className: "speak-btn speak-btn-char",
    onClick: function() { return speak(char[0]); },
    title: "Listen to pronunciation",
    'aria-label': "Listen to pronunciation of " + char[0]
  }, "\uD83D\uDD0A"), /*#__PURE__*/React.createElement("span", {
    className: "char-reading"
  }, char[1]), isKanji && /*#__PURE__*/React.createElement("button", {
    className: "stroke-toggle" + (showStroke ? " active" : ""),
    onClick: toggleStroke,
    title: "Toggle stroke order"
  }, showStroke ? "Hide strokes" : "📝 Strokes"), showStroke && strokeSvg && /*#__PURE__*/React.createElement("div", {
    className: "stroke-viewer",
    dangerouslySetInnerHTML: { __html: strokeSvg }
  }), loading && /*#__PURE__*/React.createElement("div", {
    className: "stroke-loading"
  }, "Loading..."), error && /*#__PURE__*/React.createElement("div", {
    className: "stroke-error"
  }, /*#__PURE__*/React.createElement("span", { className: "stroke-error-char" }, char[0]),
    /*#__PURE__*/React.createElement("p", null, "Stroke order unavailable"),
    /*#__PURE__*/React.createElement("button", { className: "stroke-retry-btn", onClick: fetchStroke }, "Retry")));
}
