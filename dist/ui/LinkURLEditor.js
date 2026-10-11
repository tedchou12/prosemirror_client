"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _sanitizeURL = _interopRequireDefault(require("../sanitizeURL"));
var _CustomButton = _interopRequireDefault(require("./CustomButton"));
var _KeyCodes = require("./KeyCodes");
var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));
var _i18n = _interopRequireDefault(require("./i18n"));
require("./czi-form.css");
require("./czi-image-url-editor.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
const BAD_CHARACTER_PATTER = /\s/;
class LinkURLEditor extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", {
      url: this.props.href
    });
    _defineProperty(this, "_onKeyDown", e => {
      if (e.keyCode === _KeyCodes.ENTER) {
        e.preventDefault();
        this._apply();
      }
    });
    _defineProperty(this, "_onURLChange", e => {
      const url = e.target.value;
      this.setState({
        url
      });
    });
    _defineProperty(this, "_cancel", () => {
      this.props.close();
    });
    _defineProperty(this, "_apply", () => {
      const {
        url
      } = this.state;
      if (url && !BAD_CHARACTER_PATTER.test(url)) {
        this.props.close((0, _sanitizeURL.default)(url));
      }
    });
  } // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  // To take care of the property type declaration.
  render() {
    const {
      href
    } = this.props;
    const {
      url
    } = this.state;
    const error = url ? BAD_CHARACTER_PATTER.test(url) : false;
    let label = (0, _i18n.default)('Apply');
    let disabled = !!error;
    if (href) {
      label = url ? (0, _i18n.default)('Apply') : (0, _i18n.default)('Remove');
      disabled = error;
    } else {
      disabled = error || !url;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-image-url-editor"
    }, /*#__PURE__*/React.createElement("form", {
      className: "czi-form",
      onSubmit: _preventEventDefault.default
    }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, (0, _i18n.default)('Add a Link')), /*#__PURE__*/React.createElement("input", {
      autoFocus: true,
      onChange: this._onURLChange,
      onKeyDown: this._onKeyDown,
      placeholder: (0, _i18n.default)("Paste a URL"),
      spellCheck: false,
      type: "text",
      value: url || ''
    })), /*#__PURE__*/React.createElement("div", {
      className: "czi-form-buttons"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: (0, _i18n.default)('Cancel'),
      onClick: this._cancel
    }), /*#__PURE__*/React.createElement(_CustomButton.default, {
      active: true,
      disabled: disabled,
      label: label,
      onClick: this._apply
    }))));
  }
}
_defineProperty(LinkURLEditor, "propsTypes", {
  href: _propTypes.default.string,
  close: function (props, propName) {
    var fn = props[propName];
    if (!fn.prototype || typeof fn.prototype.constructor !== 'function' && fn.prototype.constructor.length !== 1) {
      return new Error(propName + 'must be a function with 1 arg of type string');
    }
  }
});
var _default = exports.default = LinkURLEditor;