"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorUtils = require("prosemirror-utils");
var _prosemirrorView = require("prosemirror-view");
var _NodeNames = require("./NodeNames");
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
// This handles the case when user press SHIFT + ENTER key to insert a new line
// into list item.
function insertNewLine(tr, schema) {
  const {
    selection
  } = tr;
  if (!selection) {
    return tr;
  }
  const {
    from,
    empty
  } = selection;
  if (!empty) {
    return tr;
  }
  const br = schema.nodes[_NodeNames.HARD_BREAK];
  if (!br) {
    return tr;
  }
  const blockquote = schema.nodes[_NodeNames.LIST_ITEM];
  const result = (0, _prosemirrorUtils.findParentNodeOfType)(blockquote)(selection);
  if (!result) {
    return tr;
  }
  tr = tr.insert(from, _prosemirrorModel.Fragment.from(br.create()));
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, from + 1, from + 1));
  return tr;
}
class ListItemInsertNewLineCommand extends _UICommand.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = insertNewLine(state.tr.setSelection(selection), schema);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });
  }
}
var _default = exports.default = ListItemInsertNewLineCommand;