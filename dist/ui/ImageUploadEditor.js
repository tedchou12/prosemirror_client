"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classnames = _interopRequireDefault(require("classnames"));
var React = _interopRequireWildcard(require("react"));
var _CustomButton = _interopRequireDefault(require("./CustomButton"));
var _LoadingIndicator = _interopRequireDefault(require("./LoadingIndicator"));
var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));
var _uuid = _interopRequireDefault(require("./uuid"));
require("./czi-form.css");
require("./czi-image-upload-editor.css");
var _Types = require("../Types");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class ImageUploadEditor extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_img", null);
    _defineProperty(this, "_unmounted", false);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "state", {
      error: null,
      id: (0, _uuid.default)(),
      pending: false
    });
    _defineProperty(this, "_onSelectFile", event => {
      const file = event.target.files && event.target.files[0];
      if (file && typeof file === 'object') {
        this._upload(file);
      }
    });
    _defineProperty(this, "_onSuccess", image => {
      if (this._unmounted) {
        return;
      }
      this.props.close(image);
    });
    _defineProperty(this, "_onError", error => {
      if (this._unmounted) {
        return;
      }
      this.setState({
        error,
        id: (0, _uuid.default)(),
        pending: false
      });
    });
    _defineProperty(this, "_upload", async file => {
      try {
        const runtime = this.props.runtime || {};
        const {
          canUploadImage,
          uploadImage
        } = runtime;
        if (!canUploadImage || !uploadImage || !canUploadImage()) {
          throw new Error('feature is not available');
        }
        this.setState({
          pending: true,
          error: null
        });
        const image = await uploadImage(file);
        this._onSuccess(image);
      } catch (ex) {
        this._onError(ex);
      }
    });
    _defineProperty(this, "_cancel", () => {
      this.props.close();
    });
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  render() {
    const {
      id,
      error,
      pending
    } = this.state;
    const className = (0, _classnames.default)('czi-image-upload-editor', {
      pending,
      error
    });
    let label = 'Choose an image file...';
    if (pending) {
      label = /*#__PURE__*/React.createElement(_LoadingIndicator.default, null);
    } else if (error) {
      label = 'Something went wrong, please try again';
    }
    return /*#__PURE__*/React.createElement("div", {
      className: className
    }, /*#__PURE__*/React.createElement("form", {
      className: "czi-form",
      onSubmit: _preventEventDefault.default
    }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "Upload Image"), /*#__PURE__*/React.createElement("div", {
      className: "czi-image-upload-editor-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-image-upload-editor-label"
    }, label), /*#__PURE__*/React.createElement("input", {
      accept: "image/png,image/gif,image/jpeg,image/jpg",
      className: "czi-image-upload-editor-input",
      disabled: pending,
      id: id,
      key: id,
      onChange: this._onSelectFile,
      type: "file"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "czi-form-buttons"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: "Cancel",
      onClick: this._cancel
    }))));
  }
}
var _default = exports.default = ImageUploadEditor;