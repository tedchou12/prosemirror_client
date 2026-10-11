"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _ImageSourceCommand = _interopRequireDefault(require("./ImageSourceCommand"));
var _ImageUploadEditor = _interopRequireDefault(require("./ui/ImageUploadEditor"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class ImageUploadCommand extends _ImageSourceCommand.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "isEnabled", (state, view) => {
      if (!view) {
        return false;
      }
      const {
        runtime
      } = view;
      if (!runtime) {
        return false;
      }
      const {
        canUploadImage,
        uploadImage
      } = runtime;
      if (!canUploadImage || !uploadImage) {
        return false;
      }
      if (!canUploadImage()) {
        return false;
      }
      return this.__isEnabled(state, view);
    });
  }
  getEditor() {
    return _ImageUploadEditor.default;
  }
}
var _default = exports.default = ImageUploadCommand;