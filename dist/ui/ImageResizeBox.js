"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MIN_SIZE = exports.MAX_SIZE = void 0;
var _classnames = _interopRequireDefault(require("classnames"));
var _nullthrows = _interopRequireDefault(require("nullthrows"));
var React = _interopRequireWildcard(require("react"));
var _clamp = _interopRequireDefault(require("./clamp"));
var _uuid = _interopRequireDefault(require("./uuid"));
require("./czi-image-resize-box.css");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
const MIN_SIZE = exports.MIN_SIZE = 20;
const MAX_SIZE = exports.MAX_SIZE = 10000;
function setWidth(el, width, height) {
  el.style.width = width + 'px';
}
function setHeight(el, width, height) {
  el.style.height = height + 'px';
}
function setSize(el, width, height) {
  el.style.width = Math.round(width) + 'px';
  el.style.height = Math.round(height) + 'px';
}
const ResizeDirection = {
  top: setHeight,
  top_right: setSize,
  right: setWidth,
  bottom_right: setSize,
  bottom: setHeight,
  bottom_left: setSize,
  left: setWidth,
  top_left: setSize
};
class ImageResizeBoxControl extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_active", false);
    _defineProperty(this, "_el", null);
    _defineProperty(this, "_h", '');
    _defineProperty(this, "_rafID", 0);
    _defineProperty(this, "_w", '');
    _defineProperty(this, "_x1", 0);
    _defineProperty(this, "_x2", 0);
    _defineProperty(this, "_y1", 0);
    _defineProperty(this, "_y2", 0);
    _defineProperty(this, "_ww", 0);
    _defineProperty(this, "_hh", 0);
    _defineProperty(this, "_syncSize", () => {
      if (!this._active) {
        return;
      }
      const {
        direction,
        width,
        height
      } = this.props;
      const dx = (this._x2 - this._x1) * (/left/.test(direction) ? -1 : 1);
      const dy = (this._y2 - this._y1) * (/top/.test(direction) ? -1 : 1);
      const el = (0, _nullthrows.default)(this._el);
      const fn = (0, _nullthrows.default)(ResizeDirection[direction]);
      const aspect = width / height;
      let ww = (0, _clamp.default)(MIN_SIZE, width + Math.round(dx), MAX_SIZE);
      let hh = (0, _clamp.default)(MIN_SIZE, height + Math.round(dy), MAX_SIZE);
      if (fn === setSize) {
        hh = Math.max(ww / aspect, MIN_SIZE);
        ww = hh * aspect;
      }
      fn(el, Math.round(ww), Math.round(hh));
      this._ww = ww;
      this._hh = hh;
    });
    _defineProperty(this, "_onMouseDown", e => {
      e.preventDefault();
      e.stopPropagation();
      this._end();
      this._start(e);
    });
    _defineProperty(this, "_onMouseMove", e => {
      e.preventDefault();
      e.stopPropagation();
      this._x2 = e.clientX;
      this._y2 = e.clientY;
      this._rafID = requestAnimationFrame(this._syncSize);
    });
    _defineProperty(this, "_onMouseUp", e => {
      e.preventDefault();
      e.stopPropagation();
      this._x2 = e.clientX;
      this._y2 = e.clientY;
      const {
        direction
      } = this.props;
      const el = (0, _nullthrows.default)(this._el);
      el.classList.remove(direction);
      this._end();
      this.props.onResizeEnd(this._ww, this._hh);
    });
  }
  componentWillUnmount() {
    this._end();
  }
  render() {
    const {
      direction
    } = this.props;
    const className = (0, _classnames.default)({
      'czi-image-resize-box-control': true,
      [direction]: true
    });
    return /*#__PURE__*/React.createElement("span", {
      className: className,
      onMouseDown: this._onMouseDown
    });
  }
  _start(e) {
    if (this._active) {
      this._end();
    }
    this._active = true;
    const {
      boxID,
      direction,
      width,
      height
    } = this.props;
    const el = (0, _nullthrows.default)(document.getElementById(boxID));
    el.className += ' ' + direction;
    this._el = el;
    this._x1 = e.clientX;
    this._y1 = e.clientY;
    this._x2 = this._x1;
    this._y2 = this._y1;
    this._w = this._el.style.width;
    this._h = this._el.style.height;
    this._ww = width;
    this._hh = height;
    document.addEventListener('mousemove', this._onMouseMove, true);
    document.addEventListener('mouseup', this._onMouseUp, true);
  }
  _end() {
    if (!this._active) {
      return;
    }
    this._active = false;
    document.removeEventListener('mousemove', this._onMouseMove, true);
    document.removeEventListener('mouseup', this._onMouseUp, true);
    const el = (0, _nullthrows.default)(this._el);
    el.style.width = this._w;
    el.style.height = this._h;
    el.className = 'czi-image-resize-box';
    this._el = null;
    this._rafID && cancelAnimationFrame(this._rafID);
    this._rafID = null;
  }
}
class ImageResizeBox extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_id", (0, _uuid.default)());
  }
  render() {
    const {
      onResizeEnd,
      width,
      height,
      src
    } = this.props;
    const style = {
      height: height + 'px',
      width: width + 'px'
    };
    const boxID = this._id;
    const controls = Object.keys(ResizeDirection).map(key => {
      return /*#__PURE__*/React.createElement(ImageResizeBoxControl, {
        boxID: boxID,
        config: ResizeDirection[key],
        direction: key,
        height: height,
        key: key,
        onResizeEnd: onResizeEnd,
        width: width
      });
    });
    return /*#__PURE__*/React.createElement("span", {
      className: "czi-image-resize-box",
      id: boxID,
      style: style
    }, controls, /*#__PURE__*/React.createElement("img", {
      className: "czi-image-resize-box-image",
      src: src
    }));
  }
}
var _default = exports.default = ImageResizeBox;