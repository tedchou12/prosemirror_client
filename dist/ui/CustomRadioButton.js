"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./czi-custom-radio-button.css");
var _PointerSurface = _interopRequireWildcard(require("./PointerSurface"));
var React = _interopRequireWildcard(require("react"));
var _classnames = _interopRequireDefault(require("classnames"));
var _uuid = _interopRequireDefault(require("./uuid"));
var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class CustomRadioButton extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_name", (0, _uuid.default)());
  }
  render() {
    const _this$props = this.props,
      {
        title,
        className,
        checked,
        label,
        inline,
        name,
        onSelect,
        disabled
      } = _this$props,
      pointerProps = _objectWithoutProperties(_this$props, ["title", "className", "checked", "label", "inline", "name", "onSelect", "disabled"]);
    const klass = (0, _classnames.default)(className, 'czi-custom-radio-button', {
      checked: checked,
      inline: inline
    });
    return /*#__PURE__*/React.createElement(_PointerSurface.default, _extends({}, pointerProps, {
      className: klass,
      disabled: disabled,
      onClick: onSelect,
      title: title || label
    }), /*#__PURE__*/React.createElement("input", {
      checked: checked,
      className: "czi-custom-radio-button-input",
      disabled: disabled,
      name: name || this._name,
      onChange: _preventEventDefault.default,
      tabIndex: disabled ? null : 0,
      type: "radio"
    }), /*#__PURE__*/React.createElement("span", {
      className: "czi-custom-radio-button-icon"
    }), /*#__PURE__*/React.createElement("span", {
      className: "czi-custom-radio-button-label"
    }, label));
  }
}
var _default = exports.default = CustomRadioButton;