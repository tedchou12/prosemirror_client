"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bpfrpt_proptype_ImageInlineEditorValue = void 0;
require("./czi-inline-editor.css");
var _CustomButton = _interopRequireDefault(require("./CustomButton"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
const ImageAlignValues = {
  NONE: {
    value: null,
    text: 'Inline'
  },
  LEFT: {
    value: 'left',
    text: 'Float left'
  },
  CENTER: {
    value: 'center',
    text: 'Center'
  },
  RIGHT: {
    value: 'right',
    text: 'Float right'
  }
};
var bpfrpt_proptype_ImageInlineEditorValue = exports.bpfrpt_proptype_ImageInlineEditorValue = {
  "align": _propTypes.default.string
};
class ImageInlineEditor extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_onClick", align => {
      this.props.onSelect({
        align: align
      });
    });
  }
  render() {
    const align = this.props.value ? this.props.value.align : null;
    const onClick = this._onClick;
    const buttons = Object.keys(ImageAlignValues).map(key => {
      const {
        value,
        text
      } = ImageAlignValues[key];
      return /*#__PURE__*/React.createElement(_CustomButton.default, {
        active: align === value,
        key: key,
        label: text,
        onClick: onClick,
        value: value
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-inline-editor custom-"
    }, buttons);
  }
}
var _default = exports.default = ImageInlineEditor;