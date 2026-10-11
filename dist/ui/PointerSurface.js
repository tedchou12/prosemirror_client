"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bpfrpt_proptype_PointerSurfaceProps = void 0;
var _classnames = _interopRequireDefault(require("classnames"));
var React = _interopRequireWildcard(require("react"));
var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
var bpfrpt_proptype_PointerSurfaceProps = exports.bpfrpt_proptype_PointerSurfaceProps = {
  "active": _propTypes.default.bool,
  "children": _propTypes.default.any,
  "className": _propTypes.default.string,
  "disabled": _propTypes.default.bool,
  "id": _propTypes.default.string,
  "onClick": _propTypes.default.func,
  "onMouseEnter": _propTypes.default.func,
  "style": _propTypes.default.object,
  "title": _propTypes.default.string,
  "value": _propTypes.default.any
};
class PointerSurface extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_clicked", false);
    _defineProperty(this, "_mul", false);
    _defineProperty(this, "_pressedTarget", null);
    _defineProperty(this, "_unmounted", false);
    _defineProperty(this, "state", {
      pressed: false
    });
    _defineProperty(this, "_onMouseEnter", e => {
      this._pressedTarget = null;
      e.preventDefault();
      const {
        onMouseEnter,
        value
      } = this.props;
      onMouseEnter && onMouseEnter(value, e);
    });
    _defineProperty(this, "_onMouseLeave", e => {
      this._pressedTarget = null;
      const mouseUpEvent = e;
      this._onMouseUpCapture(mouseUpEvent);
    });
    _defineProperty(this, "_onMouseDown", e => {
      e.preventDefault();
      this._pressedTarget = null;
      this._clicked = false;
      if (e.which === 3 || e.button == 2) {
        // right click.
        return;
      }
      this.setState({
        pressed: true
      });
      this._pressedTarget = e.currentTarget;
      this._clicked = false;
      if (!this._mul) {
        document.addEventListener('mouseup', this._onMouseUpCapture, true);
        this._mul = true;
      }
    });
    _defineProperty(this, "_onMouseUp", e => {
      e.preventDefault();
      if (this._clicked || e.type === 'keypress') {
        const {
          onClick,
          value,
          disabled
        } = this.props;
        !disabled && onClick && onClick(value, e);
      }
      this._pressedTarget = null;
      this._clicked = false;
    });
    _defineProperty(this, "_onMouseUpCapture", e => {
      if (this._mul) {
        this._mul = false;
        document.removeEventListener('mouseup', this._onMouseUpCapture, true);
      }
      const target = e.target;
      this._clicked = this._pressedTarget instanceof HTMLElement && target instanceof HTMLElement && (target === this._pressedTarget || target.contains(this._pressedTarget) || this._pressedTarget.contains(target));
      this.setState({
        pressed: false
      });
    });
  }
  render() {
    const {
      className,
      disabled,
      active,
      id,
      style,
      title,
      children
    } = this.props;
    const {
      pressed
    } = this.state;
    const buttonClassName = (0, _classnames.default)(className, {
      active: active,
      disabled: disabled,
      pressed: pressed
    });
    return /*#__PURE__*/React.createElement("span", {
      "aria-disabled": disabled,
      "aria-pressed": pressed,
      className: buttonClassName,
      disabled: disabled,
      id: id,
      onKeyPress: disabled ? _preventEventDefault.default : this._onMouseUp,
      onMouseDown: disabled ? _preventEventDefault.default : this._onMouseDown,
      onMouseEnter: disabled ? _preventEventDefault.default : this._onMouseEnter,
      onMouseLeave: disabled ? null : this._onMouseLeave,
      onMouseUp: disabled ? _preventEventDefault.default : this._onMouseUp,
      role: "button",
      style: style,
      tabIndex: disabled ? null : 0,
      title: title
    }, children);
  }
  componentWillUnmount() {
    this._unmounted = true;
    if (this._mul) {
      this._mul = false;
      document.removeEventListener('mouseup', this._onMouseUpCapture, true);
    }
  }
}
var _default = exports.default = PointerSurface;