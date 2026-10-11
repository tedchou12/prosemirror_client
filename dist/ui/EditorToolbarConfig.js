"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TABLE_COMMANDS_GROUP = exports.COMMAND_GROUPS = void 0;
exports.parseLabel = parseLabel;
var React = _interopRequireWildcard(require("react"));
var EditorCommands = _interopRequireWildcard(require("../EditorCommands"));
var _FontSizeCommandMenuButton = _interopRequireDefault(require("./FontSizeCommandMenuButton"));
var _FontTypeCommandMenuButton = _interopRequireDefault(require("./FontTypeCommandMenuButton"));
var _HeadingCommandMenuButton = _interopRequireDefault(require("./HeadingCommandMenuButton"));
var _Icon = _interopRequireDefault(require("./Icon"));
var _i18n = _interopRequireDefault(require("./i18n"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
// eslint-disable-next-line no-unused-vars
const ICON_LABEL_PATTERN = /\[([A-Za-z_\d]+)\](.*)/;
function parseLabel(input) {
  const matched = input.match(ICON_LABEL_PATTERN);
  if (matched) {
    const [
    // eslint-disable-next-line no-unused-vars
    all, icon, label] = matched;
    return {
      icon: icon ? _Icon.default.get(icon) : null,
      title: label || null
    };
  }
  return {
    icon: null,
    title: input || null
  };
}
const {
  // [FS][07-MAY-2020][IRAD-956]
  // BLOCKQUOTE_TOGGLE,
  CLEAR_FORMAT,
  DOC_LAYOUT,
  EM,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  HISTORY_REDO,
  HISTORY_UNDO,
  HR,
  IMAGE_FROM_URL,
  IMAGE_UPLOAD,
  INDENT_LESS,
  INDENT_MORE,
  LINK_SET_URL,
  MATH_EDIT,
  OL,
  PRINT,
  STRIKE,
  STRONG,
  SUPER,
  SUB,
  TABLE_ADD_COLUMN_AFTER,
  TABLE_ADD_COLUMN_BEFORE,
  TABLE_ADD_ROW_AFTER,
  TABLE_ADD_ROW_BEFORE,
  TABLE_BORDER_COLOR,
  TABLE_BACKGROUND_COLOR,
  TABLE_DELETE_COLUMN,
  TABLE_DELETE_ROW,
  TABLE_DELETE_TABLE,
  TABLE_INSERT_TABLE,
  TABLE_MERGE_CELLS,
  // TABLE_MOVE_TO_NEXT_CELL,
  // TABLE_MOVE_TO_PREV_CELL,
  TABLE_SPLIT_ROW,
  TABLE_TOGGLE_HEADER_CELL,
  TABLE_TOGGLE_HEADER_COLUMN,
  TABLE_TOGGLE_HEADER_ROW,
  TEXT_ALIGN_CENTER,
  TEXT_ALIGN_JUSTIFY,
  TEXT_ALIGN_LEFT,
  TEXT_ALIGN_RIGHT,
  TEXT_COLOR,
  TEXT_HIGHLIGHT,
  TEXT_LINE_SPACINGS,
  UL,
  UNDERLINE
} = EditorCommands;
const TABLE_COMMANDS_GROUP = exports.TABLE_COMMANDS_GROUP = [{
  [(0, _i18n.default)('Insert Table...')]: TABLE_INSERT_TABLE
}, {
  [(0, _i18n.default)('Fill Color...')]: TABLE_BACKGROUND_COLOR,
  [(0, _i18n.default)('Border Color....')]: TABLE_BORDER_COLOR
}, {
  [(0, _i18n.default)('Insert Column Before')]: TABLE_ADD_COLUMN_BEFORE,
  [(0, _i18n.default)('Insert Column After')]: TABLE_ADD_COLUMN_AFTER,
  [(0, _i18n.default)('Delete Column')]: TABLE_DELETE_COLUMN
}, {
  [(0, _i18n.default)('Insert Row Before')]: TABLE_ADD_ROW_BEFORE,
  [(0, _i18n.default)('Insert Row After')]: TABLE_ADD_ROW_AFTER,
  [(0, _i18n.default)('Delete Row')]: TABLE_DELETE_ROW
}, {
  [(0, _i18n.default)('Merge Cells')]: TABLE_MERGE_CELLS,
  [(0, _i18n.default)('Split Row')]: TABLE_SPLIT_ROW
},
// Disable these commands cause user rarely use them.
{
  [(0, _i18n.default)('Toggle Header Column')]: TABLE_TOGGLE_HEADER_COLUMN,
  [(0, _i18n.default)('Toggle Header Row')]: TABLE_TOGGLE_HEADER_ROW,
  [(0, _i18n.default)('Toggle Header Cells')]: TABLE_TOGGLE_HEADER_CELL
}, {
  [(0, _i18n.default)('Delete Table')]: TABLE_DELETE_TABLE
}];

// [FS] IRAD-1012 2020-07-14
// Fix: Toolbar is poorly organized.

const COMMAND_GROUPS = exports.COMMAND_GROUPS = [{
  [(0, _i18n.default)('[print] Print')]: PRINT,
  [(0, _i18n.default)('[settings_overscan] Page layout')]: DOC_LAYOUT
}, {
  [(0, _i18n.default)('[undo] Undo')]: HISTORY_UNDO,
  [(0, _i18n.default)('[redo] Redo')]: HISTORY_REDO
},
// [FS] IRAD-1042 2020-09-09
// Changes the menu for include the custom styles.
{
  [(0, _i18n.default)('[H1] Header 1')]: _HeadingCommandMenuButton.default
}, {
  [(0, _i18n.default)('[font_download] Font Type')]: _FontTypeCommandMenuButton.default
}, {
  [(0, _i18n.default)('[format_size] Text Size')]: _FontSizeCommandMenuButton.default
}, {
  [(0, _i18n.default)('[format_bold] Bold')]: STRONG,
  [(0, _i18n.default)('[format_italic] Italic')]: EM,
  [(0, _i18n.default)('[format_underline] Underline')]: UNDERLINE,
  [(0, _i18n.default)('[format_strikethrough] Strike through')]: STRIKE,
  [(0, _i18n.default)('[superscript] Superscript')]: SUPER,
  [(0, _i18n.default)('[subscript] Subscript')]: SUB,
  [(0, _i18n.default)('[format_color_text] Text color')]: TEXT_COLOR,
  [(0, _i18n.default)('[border_color] Highlight color')]: TEXT_HIGHLIGHT,
  [(0, _i18n.default)('[format_clear] Clear formats')]: CLEAR_FORMAT
}, {
  [(0, _i18n.default)('[format_align_left] Left align')]: TEXT_ALIGN_LEFT,
  [(0, _i18n.default)('[format_align_center] Center Align')]: TEXT_ALIGN_CENTER,
  [(0, _i18n.default)('[format_align_right] Right Align')]: TEXT_ALIGN_RIGHT,
  [(0, _i18n.default)('[format_align_justify] Justify')]: TEXT_ALIGN_JUSTIFY
}, {
  [(0, _i18n.default)('[format_indent_increase] Indent more')]: INDENT_MORE,
  [(0, _i18n.default)('[format_indent_decrease] Indent less')]: INDENT_LESS,
  [(0, _i18n.default)('[format_line_spacing] Line spacing')]: TEXT_LINE_SPACINGS
}, {
  [(0, _i18n.default)('[format_list_numbered] Ordered list')]: OL,
  [(0, _i18n.default)('[format_list_bulleted] Bulleted list')]: UL
}, {
  [(0, _i18n.default)('[link] Apply link')]: LINK_SET_URL,
  [(0, _i18n.default)('[image] Insert image')]: [{
    [(0, _i18n.default)('Insert image by URL')]: IMAGE_FROM_URL
    // [Lang('Upload image from computer')]: IMAGE_UPLOAD,
  }],
  [(0, _i18n.default)('[grid_on] Table...')]: TABLE_COMMANDS_GROUP,
  [(0, _i18n.default)('[hr] Horizontal line')]: HR,
  [(0, _i18n.default)('[functions] Math')]: MATH_EDIT

  // [FS][07-MAY-2020][IRAD-956]
  // '[format_quote] Block quote': BLOCKQUOTE_TOGGLE,
}];