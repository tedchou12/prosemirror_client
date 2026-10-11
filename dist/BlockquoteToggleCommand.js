"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorUtils = require("prosemirror-utils");
var _prosemirrorView = require("prosemirror-view");
var _NodeNames = require("./NodeNames");
var _toggleBlockquote = _interopRequireDefault(require("./toggleBlockquote"));
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class BlockquoteToggleCommand extends _UICommand.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "isActive", state => {
      const blockquote = state.schema.nodes[_NodeNames.BLOCKQUOTE];
      return !!(blockquote && (0, _prosemirrorUtils.findParentNodeOfType)(blockquote)(state.selection));
    });
    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = (0, _toggleBlockquote.default)(state.tr.setSelection(selection), schema);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });
  }
}
var _default = exports.default = BlockquoteToggleCommand;