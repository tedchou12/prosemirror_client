"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseLabel = parseLabel;
exports.COMMAND_GROUPS = exports.TABLE_COMMANDS_GROUP = void 0;

var React = _interopRequireWildcard(require("react"));

var EditorCommands = _interopRequireWildcard(require("../EditorCommands"));

var _FontSizeCommandMenuButton = _interopRequireDefault(require("./FontSizeCommandMenuButton"));

var _FontTypeCommandMenuButton = _interopRequireDefault(require("./FontTypeCommandMenuButton"));

var _HeadingCommandMenuButton = _interopRequireDefault(require("./HeadingCommandMenuButton"));

var _Icon = _interopRequireDefault(require("./Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// eslint-disable-next-line no-unused-vars
const ICON_LABEL_PATTERN = /\[([A-Za-z_\d]+)\](.*)/;

function parseLabel(input) {
  const matched = input.match(ICON_LABEL_PATTERN);

  if (matched) {
    const [// eslint-disable-next-line no-unused-vars
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
  STRIKE,
  STRONG,
  SUPER,
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
const TABLE_COMMANDS_GROUP = [{
  'Insert Table...': TABLE_INSERT_TABLE
}, {
  'Fill Color...': TABLE_BACKGROUND_COLOR,
  'Border Color....': TABLE_BORDER_COLOR
}, {
  'Insert Column Before': TABLE_ADD_COLUMN_BEFORE,
  'Insert Column After': TABLE_ADD_COLUMN_AFTER,
  'Delete Column': TABLE_DELETE_COLUMN
}, {
  'Insert Row Before': TABLE_ADD_ROW_BEFORE,
  'Insert Row After': TABLE_ADD_ROW_AFTER,
  'Delete Row': TABLE_DELETE_ROW
}, {
  'Merge Cells': TABLE_MERGE_CELLS,
  'Split Row': TABLE_SPLIT_ROW
}, // Disable these commands cause user rarely use them.
{
  'Toggle Header Column': TABLE_TOGGLE_HEADER_COLUMN,
  'Toggle Header Row': TABLE_TOGGLE_HEADER_ROW,
  'Toggle Header Cells': TABLE_TOGGLE_HEADER_CELL
}, {
  'Delete Table': TABLE_DELETE_TABLE
}]; // [FS] IRAD-1012 2020-07-14
// Fix: Toolbar is poorly organized.

exports.TABLE_COMMANDS_GROUP = TABLE_COMMANDS_GROUP;
const COMMAND_GROUPS = [{
  '[font_download] Font Type': _FontTypeCommandMenuButton.default
}, {
  '[format_size] Text Size': _FontSizeCommandMenuButton.default
}, {
  '[format_bold] Bold': STRONG,
  '[format_italic] Italic': EM,
  '[format_underline] Underline': UNDERLINE,
  '[format_strikethrough] Strike through': STRIKE,
  '[superscript] Superscript': SUPER,
  '[format_color_text] Text color': TEXT_COLOR,
  '[border_color] Highlight color': TEXT_HIGHLIGHT,
  '[format_clear] Clear formats': CLEAR_FORMAT
}, {
  '[format_align_left] Left align': TEXT_ALIGN_LEFT,
  '[format_align_center] Center Align': TEXT_ALIGN_CENTER,
  '[format_align_right] Right Align': TEXT_ALIGN_RIGHT,
  '[format_align_justify] Justify': TEXT_ALIGN_JUSTIFY
}, {
  '[format_indent_increase] Indent more': INDENT_MORE,
  '[format_indent_decrease] Indent less': INDENT_LESS,
  '[format_line_spacing] Line spacing': TEXT_LINE_SPACINGS
}, {
  '[format_list_numbered] Ordered list': OL,
  '[format_list_bulleted] Bulleted list': UL
}, // [FS] IRAD-1042 2020-09-09
// Changes the menu for include the custom styles.
{
  '[H1] Header 1': _HeadingCommandMenuButton.default
}, {
  '[link] Apply link': LINK_SET_URL,
  '[image] Insert image': [{
    'Insert image by URL': IMAGE_FROM_URL,
    'Upload image from computer': IMAGE_UPLOAD
  }],
  '[grid_on] Table...': TABLE_COMMANDS_GROUP,
  '[hr] Horizontal line': HR,
  '[functions] Math': MATH_EDIT // [FS][07-MAY-2020][IRAD-956]
  // '[format_quote] Block quote': BLOCKQUOTE_TOGGLE,

}, {
  '[settings_overscan] Page layout': DOC_LAYOUT
}, {
  '[undo] Undo': HISTORY_UNDO,
  '[redo] Redo': HISTORY_REDO
}];
exports.COMMAND_GROUPS = COMMAND_GROUPS;