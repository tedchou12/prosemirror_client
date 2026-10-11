"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _Types = require("../Types");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
// https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
class CustomEditorView extends _prosemirrorView.EditorView {
  constructor(place, props) {
    super(place, props);
    _defineProperty(this, "disabled", void 0);
    _defineProperty(this, "placeholder", void 0);
    _defineProperty(this, "readOnly", void 0);
    _defineProperty(this, "runtime", void 0);
    this.runtime = null;
    this.readOnly = true;
    this.disabled = true;
    this.placeholder = null;
  }
  destroy() {
    super.destroy();
    this._props = {};
  }
}
var _default = exports.default = CustomEditorView;