"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bpfrpt_proptype_DocLayoutEditorValue = void 0;
var React = _interopRequireWildcard(require("react"));
var _DocNodeSpec = require("../DocNodeSpec");
var _CustomButton = _interopRequireDefault(require("./CustomButton"));
var _CustomRadioButton = _interopRequireDefault(require("./CustomRadioButton"));
var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));
var _i18n = _interopRequireDefault(require("./i18n"));
require("./czi-body-layout-editor.css");
require("./czi-form.css");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
var bpfrpt_proptype_DocLayoutEditorValue = exports.bpfrpt_proptype_DocLayoutEditorValue = {
  "layout": _propTypes.default.string,
  "width": _propTypes.default.number
};
class DocLayoutEditor extends React.PureComponent {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  // To take care of the property type declaration.

  constructor(props, context) {
    super(props, context);
    _defineProperty(this, "_unmounted", false);
    _defineProperty(this, "state", void 0);
    _defineProperty(this, "_onSelect", selectedValue => {
      this.setState({
        selectedValue
      });
    });
    _defineProperty(this, "_cancel", () => {
      this.props.close();
    });
    _defineProperty(this, "_apply", () => {
      const {
        selectedValue
      } = this.state;
      if (typeof selectedValue === 'string') {
        this.props.close({
          width: null,
          layout: selectedValue
        });
      } else {
        this.props.close({
          width: selectedValue,
          layout: null
        });
      }
    });
    const {
      width,
      layout
    } = this.props.initialValue || {};
    this.state = {
      width,
      layout,
      selectedValue: width || layout || _DocNodeSpec.LAYOUT.A4_PORTRAIT
    };
  }
  render() {
    const {
      width,
      selectedValue
    } = this.state;
    const customOption = width ? /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === width,
      key: "c",
      label: `Custom width: ${width}pt`,
      onSelect: this._onSelect,
      value: width
    }) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-body-layout-editor"
    }, /*#__PURE__*/React.createElement("form", {
      className: "czi-form",
      onSubmit: _preventEventDefault.default
    }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, (0, _i18n.default)('Page Layout')), /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === _DocNodeSpec.LAYOUT.A4_PORTRAIT,
      label: (0, _i18n.default)("A4 - Portrait"),
      onSelect: this._onSelect,
      value: _DocNodeSpec.LAYOUT.A4_PORTRAIT
    }), /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === _DocNodeSpec.LAYOUT.A4_LANDSCAPE,
      label: (0, _i18n.default)("A4 - Landscape"),
      onSelect: this._onSelect,
      value: _DocNodeSpec.LAYOUT.A4_LANDSCAPE
    }), /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === _DocNodeSpec.LAYOUT.US_LETTER_PORTRAIT,
      label: (0, _i18n.default)("US Letter - Portrait"),
      onSelect: this._onSelect,
      value: _DocNodeSpec.LAYOUT.US_LETTER_PORTRAIT
    }), /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === _DocNodeSpec.LAYOUT.US_LETTER_LANDSCAPE,
      label: (0, _i18n.default)("US Letter - Landscape"),
      onSelect: this._onSelect,
      value: _DocNodeSpec.LAYOUT.US_LETTER_LANDSCAPE
    }), /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === _DocNodeSpec.LAYOUT.DESKTOP_SCREEN_4_3,
      label: "4:3 Desktop Screen",
      onSelect: this._onSelect,
      value: _DocNodeSpec.LAYOUT.DESKTOP_SCREEN_4_3
    }), /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === _DocNodeSpec.LAYOUT.DESKTOP_SCREEN_16_9,
      label: "16:9 Desktop Screen",
      onSelect: this._onSelect,
      value: _DocNodeSpec.LAYOUT.DESKTOP_SCREEN_16_9
    }), customOption), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
      className: "czi-form-buttons"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: (0, _i18n.default)('Cancel'),
      onClick: this._cancel
    }), /*#__PURE__*/React.createElement(_CustomButton.default, {
      active: true,
      label: (0, _i18n.default)('Apply'),
      onClick: this._apply
    }))));
  }
}
_defineProperty(DocLayoutEditor, "propsTypes", {
  // initialValue: PropTypes.shape({
  //   layout: PropTypes.string,
  //   width: PropTypes.number,
  // }),

  close: function (props, propName) {
    var fn = props[propName];
    if (!fn.prototype || typeof fn.prototype.constructor !== 'function' && fn.prototype.constructor.length !== 1) {
      return new Error(propName + 'must be a function with 1 arg of type DocLayoutEditorValue');
    }
  }
});
var _default = exports.default = DocLayoutEditor;