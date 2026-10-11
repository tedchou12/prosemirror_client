"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEditorKeyMap;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var EditorCommands = _interopRequireWildcard(require("./EditorCommands"));
var EditorKeyMap = _interopRequireWildcard(require("./EditorKeyMap"));
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
const {
  KEY_BACK_DELETE,
  KEY_FORWARD_DELETE,
  // [FS][07-MAY-2020][IRAD-956]
  // KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE,
  KEY_INSERT_NEW_LINE_IN_LIST_ITEM,
  KEY_REDO,
  KEY_SPLIT_LIST_ITEM,
  KEY_TAB_SHIFT,
  KEY_TAB,
  KEY_TOGGLE_BOLD,
  KEY_TOGGLE_ITALIC,
  KEY_TOGGLE_UNDERLINE,
  KEY_UNDO
} = EditorKeyMap;
const {
  // [FS][07-MAY-2020][IRAD-956]
  // BLOCKQUOTE_INSERT_NEW_LINE,
  EM,
  HISTORY_REDO,
  HISTORY_UNDO,
  INDENT_LESS,
  INDENT_MORE,
  LIST_ITEM_INSERT_NEW_LINE,
  LIST_ITEM_MERGE_DOWN,
  LIST_ITEM_MERGE_UP,
  LIST_SPLIT,
  TABLE_MOVE_TO_NEXT_CELL,
  TABLE_MOVE_TO_PREV_CELL,
  TEXT_INSERT_TAB_SPACE,
  STRONG,
  UNDERLINE
} = EditorCommands;
function bindCommands() {
  for (var _len = arguments.length, commands = new Array(_len), _key = 0; _key < _len; _key++) {
    commands[_key] = arguments[_key];
  }
  return function (state, dispatch, view) {
    return commands.some(cmd => {
      if (cmd.isEnabled(state, view)) {
        cmd.execute(state, dispatch, view);
        return true;
      }
      return false;
    });
  };
}
function createEditorKeyMap() {
  const result = {
    [KEY_BACK_DELETE.common]: LIST_ITEM_MERGE_UP.execute,
    [KEY_FORWARD_DELETE.common]: LIST_ITEM_MERGE_DOWN.execute,
    [KEY_REDO.common]: HISTORY_REDO.execute,
    [KEY_SPLIT_LIST_ITEM.common]: LIST_SPLIT.execute,
    [KEY_TAB.common]: bindCommands(TABLE_MOVE_TO_NEXT_CELL, TEXT_INSERT_TAB_SPACE, INDENT_MORE),
    [KEY_TAB_SHIFT.common]: bindCommands(TABLE_MOVE_TO_PREV_CELL, TEXT_INSERT_TAB_SPACE, INDENT_LESS),
    [KEY_TOGGLE_BOLD.common]: STRONG.execute,
    [KEY_TOGGLE_ITALIC.common]: EM.execute,
    [KEY_TOGGLE_UNDERLINE.common]: UNDERLINE.execute,
    [KEY_UNDO.common]: HISTORY_UNDO.execute,
    // [FS][07-MAY-2020][IRAD-956]
    // [KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE.common]:
    //   BLOCKQUOTE_INSERT_NEW_LINE.execute,
    [KEY_INSERT_NEW_LINE_IN_LIST_ITEM.common]: LIST_ITEM_INSERT_NEW_LINE.execute
  };
  return result;
}