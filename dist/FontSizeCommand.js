"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
var _applyMark = _interopRequireDefault(require("./applyMark"));
var _isTextStyleMarkCommandEnabled = _interopRequireDefault(require("./isTextStyleMarkCommandEnabled"));
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorView = require("prosemirror-view");
var _MarkNames = require("./MarkNames");
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorTransform = require("prosemirror-transform");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function setFontSize(tr, schema, pt) {
  const markType = schema.marks[_MarkNames.MARK_FONT_SIZE];
  if (!markType) {
    return tr;
  }
  const attrs = pt ? {
    pt
  } : null;
  tr = (0, _applyMark.default)(tr, schema, markType, attrs);
  return tr;
}
class FontSizeCommand extends _UICommand.default {
  constructor(pt) {
    super();
    _defineProperty(this, "_popUp", null);
    _defineProperty(this, "_pt", 0);
    _defineProperty(this, "isEnabled", state => {
      return (0, _isTextStyleMarkCommandEnabled.default)(state, _MarkNames.MARK_FONT_SIZE);
    });
    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = setFontSize(state.tr.setSelection(selection), schema, this._pt);
      if (tr.docChanged || tr.storedMarksSet) {
        // If selection is empty, the color is added to `storedMarks`, which
        // works like `toggleMark`
        // (see https://prosemirror.net/docs/ref/#commands.toggleMark).
        dispatch && dispatch(tr);
        return true;
      }
      return false;
    });
    this._pt = pt;
  }
}
var _default = exports.default = FontSizeCommand;