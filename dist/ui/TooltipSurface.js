"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./czi-tooltip-surface.css");
require("./czi-animations.css");
var React = _interopRequireWildcard(require("react"));
var _createPopUp = _interopRequireDefault(require("./createPopUp"));
var _PopUpPosition = require("./PopUpPosition");
var _uuid = _interopRequireDefault(require("./uuid"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class TooltipView extends React.PureComponent {
  render() {
    const {
      tooltip
    } = this.props;
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-tooltip-view czi-animation-fade-in"
    }, tooltip);
  }
}
class TooltipSurface extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_id", (0, _uuid.default)());
    _defineProperty(this, "_popUp", null);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_onMouseEnter", () => {
      if (!this._popUp) {
        const {
          tooltip
        } = this.props;
        this._popUp = (0, _createPopUp.default)(TooltipView, {
          tooltip
        }, {
          anchor: document.getElementById(this._id),
          onClose: this._onClose,
          position: _PopUpPosition.atAnchorBottomCenter
        });
      }
    });
    _defineProperty(this, "_onMouseLeave", () => {
      this._popUp && this._popUp.close();
      this._popUp = null;
    });
    _defineProperty(this, "_onClose", () => {
      this._popUp = null;
    });
  }
  componentWillUnmount() {
    this._popUp && this._popUp.close();
  }
  render() {
    const {
      tooltip,
      children
    } = this.props;
    return /*#__PURE__*/React.createElement("span", {
      "aria-label": tooltip,
      className: "czi-tooltip-surface",
      "data-tooltip": tooltip,
      id: this._id,
      onMouseDown: tooltip && this._onMouseLeave,
      onMouseEnter: tooltip && this._onMouseEnter,
      onMouseLeave: tooltip && this._onMouseLeave,
      role: "tooltip"
    }, children);
  }
}
var _default = exports.default = TooltipSurface;