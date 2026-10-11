"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderLaTeXAsHTML = _interopRequireDefault(require("../renderLaTeXAsHTML"));
require("./czi-mathquill-editor-symbols-panel.css");
var _CustomButton = _interopRequireDefault(require("../CustomButton"));
var React = _interopRequireWildcard(require("react"));
var _MathQuillEditorSymbols = require("./MathQuillEditorSymbols");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class MathQuillEditorSymbolsPanel extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_renderButton", symbol => {
      const {
        label,
        latex,
        description
      } = symbol;
      const html = (0, _renderLaTeXAsHTML.default)(label);
      const icon = /*#__PURE__*/React.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: html
        }
      });
      return /*#__PURE__*/React.createElement(_CustomButton.default, {
        className: "czi-mathquill-editor-symbols-panel-button",
        icon: icon,
        key: label + latex,
        onClick: this.props.onSelect,
        title: description,
        value: symbol
      });
    });
  }
  render() {
    const {
      title,
      symbols
    } = this.props.symbols;
    const buttons = symbols.map(this._renderButton);
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-mathquill-editor-symbols-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-mathquill-editor-symbols-panel-title"
    }, title), /*#__PURE__*/React.createElement("div", {
      className: "czi-mathquill-editor-symbols-panel-body"
    }, buttons));
  }
}
var _default = exports.default = MathQuillEditorSymbolsPanel;