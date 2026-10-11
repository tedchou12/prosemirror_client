"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./czi-loading-indicator.css");
var React = _interopRequireWildcard(require("react"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
// https://loading.io/css/
class LoadingIndicator extends React.PureComponent {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-loading-indicator"
    }, /*#__PURE__*/React.createElement("div", {
      className: "frag czi-loading-indicator-frag-1"
    }), /*#__PURE__*/React.createElement("div", {
      className: "frag czi-loading-indicator-frag-2"
    }), /*#__PURE__*/React.createElement("div", {
      className: "frag czi-loading-indicator-frag-3"
    }), /*#__PURE__*/React.createElement("div", {
      className: "frag czi-loading-indicator-frag-4"
    }));
  }
}
var _default = exports.default = LoadingIndicator;