"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var _clearMarks = require("./clearMarks");
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class MarksClearCommand extends _UICommand.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "isActive", state => {
      return false;
    });
    _defineProperty(this, "isEnabled", state => {
      const {
        selection
      } = state;
      return !selection.empty && (selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection);
    });
    _defineProperty(this, "execute", (state, dispatch, view) => {
      let tr = (0, _clearMarks.clearMarks)(state.tr.setSelection(state.selection), state.schema);
      // [FS] IRAD-948 2020-05-22
      // Clear Header formatting
      tr = (0, _clearMarks.clearHeading)(tr, state.schema);
      if (dispatch && tr.docChanged) {
        dispatch(tr);
        return true;
      }
      return false;
    });
  }
}
var _default = exports.default = MarksClearCommand;