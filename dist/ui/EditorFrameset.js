"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bpfrpt_proptype_EditorFramesetProps = exports.FRAMESET_BODY_CLASSNAME = void 0;
var _classnames = _interopRequireDefault(require("classnames"));
var React = _interopRequireWildcard(require("react"));
require("./czi-editor-frameset.css");
var _propTypes = _interopRequireDefault(require("prop-types"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
var bpfrpt_proptype_EditorFramesetProps = exports.bpfrpt_proptype_EditorFramesetProps = {
  "body": _propTypes.default.node,
  "className": _propTypes.default.string,
  "embedded": _propTypes.default.bool,
  "header": _propTypes.default.node,
  "height": _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  "toolbarPlacement": _propTypes.default.oneOf(["header", "body"]),
  "toolbar": _propTypes.default.node,
  "width": _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
};
const FRAMESET_BODY_CLASSNAME = exports.FRAMESET_BODY_CLASSNAME = 'czi-editor-frame-body';
function toCSS(val) {
  if (!val || val === 'auto') {
    // '', 0, null, false, 'auto' are all treated as undefined
    // instead of auto...
    return undefined;
  }
  if (isNaN(val)) {
    return `${val}`;
  }
  return `${val}px`;
}
class EditorFrameset extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
  }
  render() {
    const {
      body,
      className,
      embedded,
      header,
      height,
      toolbarPlacement,
      toolbar,
      width
    } = this.props;
    const mainStyle = {
      width: toCSS(width),
      height: toCSS(height)
    };
    const mainClassName = (0, _classnames.default)(className, {
      'czi-editor-frameset': true,
      // Layout is fixed when either width or height is set.
      'with-fixed-layout': mainStyle.width || mainStyle.height,
      embedded: embedded
    });
    const toolbarHeader = toolbarPlacement === 'header' || !toolbarPlacement ? toolbar : null;
    const toolbarBody = toolbarPlacement === 'body' && toolbar;
    return /*#__PURE__*/React.createElement("div", {
      className: mainClassName,
      style: mainStyle
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-head"
    }, header, toolbarHeader), /*#__PURE__*/React.createElement("div", {
      className: FRAMESET_BODY_CLASSNAME
    }, toolbarBody, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-body-scroll"
    }, body)), /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-footer"
    })));
  }
}
var _default = exports.default = EditorFrameset;