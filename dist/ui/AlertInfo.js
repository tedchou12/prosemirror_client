"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CustomButton = _interopRequireDefault(require("./CustomButton"));
require("./czi-form.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class AlertInfo extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_unmounted", false);
    _defineProperty(this, "state", _objectSpread(_objectSpread({}, this.props.initialValue || {}), {}, {
      validValue: null
    }));
    _defineProperty(this, "_cancel", () => {
      this.props.close();
    });
  } // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  // To take care of the property type declaration.
  componentWillUnmount() {
    this._unmounted = true;
  }
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "alert"
    }, /*#__PURE__*/React.createElement("span", {
      class: "closebtn",
      onClick: this._cancel
    }, "\xD7"), /*#__PURE__*/React.createElement("strong", null, "Document Error!"), " Unable to load the document.", /*#__PURE__*/React.createElement("span", null, " Have issues in Json format, please verify..."));
  }
}
_defineProperty(AlertInfo, "propsTypes", {
  initialValue: _propTypes.default.object,
  close: function (props, propName) {
    var fn = props[propName];
    if (!fn.prototype || typeof fn.prototype.constructor !== 'function' && fn.prototype.constructor.length !== 1) {
      return new Error(propName + 'must be a function with 1 arg of type ImageLike');
    }
  }
});
var _default = exports.default = AlertInfo;