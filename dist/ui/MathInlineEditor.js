"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bpfrpt_proptype_MathInlineEditorValue = void 0;
require("./czi-inline-editor.css");
var _CustomButton = _interopRequireDefault(require("./CustomButton"));
var _CustomEditorView = _interopRequireDefault(require("./CustomEditorView"));
var _MathEditor = _interopRequireDefault(require("./MathEditor"));
var React = _interopRequireWildcard(require("react"));
var _createPopUp = _interopRequireDefault(require("./createPopUp"));
var _i18n = _interopRequireDefault(require("./i18n"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
const MathAlignValues = {
  NONE: {
    value: null,
    text: (0, _i18n.default)('Inline')
  },
  CENTER: {
    value: 'center',
    text: (0, _i18n.default)('Break text')
  }
};
var bpfrpt_proptype_MathInlineEditorValue = exports.bpfrpt_proptype_MathInlineEditorValue = {
  "align": _propTypes.default.string,
  "latex": _propTypes.default.string.isRequired
};
class MathInlineEditor extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_popUp", null);
    _defineProperty(this, "_onClick", align => {
      const value = this.props.value || {};
      this.props.onSelect(_objectSpread(_objectSpread({}, value), {}, {
        align
      }));
    });
    _defineProperty(this, "_editLatex", latex => {
      if (this._popUp) {
        return;
      }
      const {
        editorView,
        value
      } = this.props;
      const props = {
        runtime: editorView ? editorView.runtime : null,
        initialValue: value && value.latex || ''
      };
      this._popUp = (0, _createPopUp.default)(_MathEditor.default, props, {
        autoDismiss: false,
        modal: true,
        onClose: latex => {
          if (this._popUp) {
            this._popUp = null;
            if (latex !== undefined) {
              const value = this.props.value || {};
              this.props.onSelect(_objectSpread(_objectSpread({}, value), {}, {
                latex
              }));
            }
            this.props.onEditEnd();
          }
        }
      });
      this.props.onEditStart();
    });
  }
  componentWillUnmount() {
    this._popUp && this._popUp.close();
  }
  render() {
    const {
      align,
      latex
    } = this.props.value || {};
    const onClick = this._onClick;
    const buttons = Object.keys(MathAlignValues).map(key => {
      const {
        value,
        text
      } = MathAlignValues[key];
      return /*#__PURE__*/React.createElement(_CustomButton.default, {
        active: align === value,
        key: key,
        label: text,
        onClick: onClick,
        value: value
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-inline-editor"
    }, buttons, /*#__PURE__*/React.createElement(_CustomButton.default, {
      key: "edit",
      label: (0, _i18n.default)("Edit"),
      onClick: this._editLatex,
      value: latex || ''
    }));
  }
}
var _default = exports.default = MathInlineEditor;