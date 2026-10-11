"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class WebFontLoader {
  constructor() {
    _defineProperty(this, "_implementation", null);
  }
  setImplementation(impl) {
    this._implementation = impl;
  }
  load(params) {
    const impl = this._implementation;
    if (impl) {
      impl.load(params);
    } else {
      console.warn('Method WebFontLoader.load does not have an implementation');
    }
  }
}
const loader = new WebFontLoader();
var _default = exports.default = loader;