"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _color = _interopRequireDefault(require("color"));
var React = _interopRequireWildcard(require("react"));
var _CustomButton = _interopRequireDefault(require("./CustomButton"));
var _clamp = _interopRequireDefault(require("./clamp"));
var _i18n = _interopRequireDefault(require("./i18n"));
require("./czi-color-editor.css");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function generateGreyColors(count) {
  let cc = 255;
  const interval = cc / count;
  const colors = [];
  while (cc > 0) {
    const color = (0, _color.default)({
      r: cc,
      g: cc,
      b: cc
    });
    cc -= interval;
    cc = Math.floor(cc);
    colors.unshift(color);
  }
  return colors;
}
function generateRainbowColors(count, saturation, lightness) {
  const colors = [];
  const interval = 360 / count;
  const ss = (0, _clamp.default)(0, saturation, 100);
  const ll = (0, _clamp.default)(0, lightness, 100);
  let hue = 0;
  while (hue < 360) {
    const hsl = `hsl(${hue},${ss}%,${ll}%)`;
    const color = (0, _color.default)(hsl);
    colors.unshift(color);
    hue += interval;
  }
  return colors;
}
class ColorEditor extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_renderColor", (color, index) => {
      const selectedColor = this.props.hex;
      const hex = color.hex().toLowerCase();
      const style = {
        backgroundColor: hex
      };
      const active = selectedColor && selectedColor.toLowerCase() === hex;
      return /*#__PURE__*/React.createElement(_CustomButton.default, {
        active: active,
        className: "czi-color-editor-cell",
        key: `${hex}-${index}`,
        label: "",
        onClick: this._onSelectColor,
        style: style,
        value: hex
      });
    });
    _defineProperty(this, "_onSelectColor", hex => {
      this.props.close(hex);
    });
  }
  render() {
    const renderColor = this._renderColor;
    const selectedColor = this.props.hex;
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor-section"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      active: !selectedColor,
      className: "czi-color-editor-color-transparent",
      label: (0, _i18n.default)("Transparent"),
      onClick: this._onSelectColor,
      value: "rgba(0,0,0,0)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor-section"
    }, generateGreyColors(10).map(renderColor)), /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor-section"
    }, generateRainbowColors(10, 90, 50).map(renderColor)), /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor-section"
    }, generateRainbowColors(30, 70, 70).map(renderColor)), /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor-section"
    }, generateRainbowColors(30, 90, 30).map(renderColor)));
  }
}
var _default = exports.default = ColorEditor;