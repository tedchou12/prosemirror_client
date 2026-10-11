"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNDERLINE = exports.UL = exports.TEXT_LINE_SPACINGS = exports.TEXT_INSERT_TAB_SPACE = exports.TEXT_HIGHLIGHT = exports.TEXT_COLOR = exports.TEXT_ALIGN_RIGHT = exports.TEXT_ALIGN_LEFT = exports.TEXT_ALIGN_JUSTIFY = exports.TEXT_ALIGN_CENTER = exports.TABLE_TOGGLE_HEADER_ROW = exports.TABLE_TOGGLE_HEADER_COLUMN = exports.TABLE_TOGGLE_HEADER_CELL = exports.TABLE_SPLIT_ROW = exports.TABLE_MOVE_TO_PREV_CELL = exports.TABLE_MOVE_TO_NEXT_CELL = exports.TABLE_MERGE_CELLS = exports.TABLE_INSERT_TABLE = exports.TABLE_DELETE_TABLE = exports.TABLE_DELETE_ROW = exports.TABLE_DELETE_COLUMN = exports.TABLE_BORDER_COLOR = exports.TABLE_BACKGROUND_COLOR = exports.TABLE_ADD_ROW_BEFORE = exports.TABLE_ADD_ROW_AFTER = exports.TABLE_ADD_COLUMN_BEFORE = exports.TABLE_ADD_COLUMN_AFTER = exports.SUPER = exports.SUB = exports.STRONG = exports.STRIKE = exports.PRINT = exports.OL = exports.MATH_EDIT = exports.LIST_SPLIT = exports.LIST_ITEM_MERGE_UP = exports.LIST_ITEM_MERGE_DOWN = exports.LIST_ITEM_INSERT_NEW_LINE = exports.LINK_SET_URL = exports.INDENT_MORE = exports.INDENT_LESS = exports.IMAGE_UPLOAD = exports.IMAGE_FROM_URL = exports.HR = exports.HISTORY_UNDO = exports.HISTORY_REDO = exports.H6 = exports.H5 = exports.H4 = exports.H3 = exports.H2 = exports.H1 = exports.EM = exports.DOC_LAYOUT = exports.CLEAR_FORMAT = void 0;
var ProsemirrorTables = _interopRequireWildcard(require("prosemirror-tables"));
var _DocLayoutCommand = _interopRequireDefault(require("./DocLayoutCommand"));
var _HeadingCommand = _interopRequireDefault(require("./HeadingCommand"));
var _HistoryRedoCommand = _interopRequireDefault(require("./HistoryRedoCommand"));
var _HistoryUndoCommand = _interopRequireDefault(require("./HistoryUndoCommand"));
var _HorizontalRuleCommand = _interopRequireDefault(require("./HorizontalRuleCommand"));
var _ImageFromURLCommand = _interopRequireDefault(require("./ImageFromURLCommand"));
var _ImageUploadCommand = _interopRequireDefault(require("./ImageUploadCommand"));
var _IndentCommand = _interopRequireDefault(require("./IndentCommand"));
var _LinkSetURLCommand = _interopRequireDefault(require("./LinkSetURLCommand"));
var _ListItemInsertNewLineCommand = _interopRequireDefault(require("./ListItemInsertNewLineCommand"));
var _ListItemMergeCommand = _interopRequireDefault(require("./ListItemMergeCommand"));
var _ListSplitCommand = _interopRequireDefault(require("./ListSplitCommand"));
var _ListToggleCommand = _interopRequireDefault(require("./ListToggleCommand"));
var MarkNames = _interopRequireWildcard(require("./MarkNames"));
var _MarkToggleCommand = _interopRequireDefault(require("./MarkToggleCommand"));
var _MarksClearCommand = _interopRequireDefault(require("./MarksClearCommand"));
var _MathEditCommand = _interopRequireDefault(require("./MathEditCommand"));
var _PrintCommand = _interopRequireDefault(require("./PrintCommand"));
var _TableBackgroundColorCommand = _interopRequireDefault(require("./TableBackgroundColorCommand"));
var _TableBorderColorCommand = _interopRequireDefault(require("./TableBorderColorCommand"));
var _TableInsertCommand = _interopRequireDefault(require("./TableInsertCommand"));
var _TableMergeCellsCommand = _interopRequireDefault(require("./TableMergeCellsCommand"));
var _TextAlignCommand = _interopRequireDefault(require("./TextAlignCommand"));
var _TextColorCommand = _interopRequireDefault(require("./TextColorCommand"));
var _TextHighlightCommand = _interopRequireDefault(require("./TextHighlightCommand"));
var _TextInsertTabSpaceCommand = _interopRequireDefault(require("./TextInsertTabSpaceCommand"));
var _TextLineSpacingCommand = _interopRequireDefault(require("./TextLineSpacingCommand"));
var _createCommand = _interopRequireDefault(require("./createCommand"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
// [FS][07-MAY-2020][IRAD-956]
// import BlockquoteInsertNewLineCommand from './BlockquoteInsertNewLineCommand';
// import BlockquoteToggleCommand from './BlockquoteToggleCommand';
const {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  // columnResizing,
  deleteColumn,
  deleteRow,
  deleteTable,
  // fixTables,
  goToNextCell,
  // mergeCells,
  // setCellAttr,
  splitCell,
  // tableEditing,
  // tableNodes,
  toggleHeaderCell,
  toggleHeaderColumn,
  toggleHeaderRow
} = ProsemirrorTables;
const {
  MARK_STRONG,
  MARK_EM,
  MARK_STRIKE,
  MARK_SUPER,
  MARK_SUB,
  MARK_UNDERLINE
} = MarkNames;

// Note that Firefox will, by default, add various kinds of controls to
// editable tables, even though those don't work in ProseMirror. The only way
// to turn these off is globally, which you might want to do with the
// following code:
document.execCommand('enableObjectResizing', false, 'false');
document.execCommand('enableInlineTableEditing', false, 'false');
// [FS][07-MAY-2020][IRAD-956]
//  export const BLOCKQUOTE_TOGGLE = new BlockquoteToggleCommand();
//  export const BLOCKQUOTE_INSERT_NEW_LINE = new BlockquoteInsertNewLineCommand();
const CLEAR_FORMAT = exports.CLEAR_FORMAT = new _MarksClearCommand.default();
const DOC_LAYOUT = exports.DOC_LAYOUT = new _DocLayoutCommand.default();
const EM = exports.EM = new _MarkToggleCommand.default(MARK_EM);
const H1 = exports.H1 = new _HeadingCommand.default(1);
const H2 = exports.H2 = new _HeadingCommand.default(2);
const H3 = exports.H3 = new _HeadingCommand.default(3);
const H4 = exports.H4 = new _HeadingCommand.default(4);
const H5 = exports.H5 = new _HeadingCommand.default(5);
const H6 = exports.H6 = new _HeadingCommand.default(6);
const HISTORY_REDO = exports.HISTORY_REDO = new _HistoryRedoCommand.default();
const HISTORY_UNDO = exports.HISTORY_UNDO = new _HistoryUndoCommand.default();
const HR = exports.HR = new _HorizontalRuleCommand.default();
const IMAGE_FROM_URL = exports.IMAGE_FROM_URL = new _ImageFromURLCommand.default();
const IMAGE_UPLOAD = exports.IMAGE_UPLOAD = new _ImageUploadCommand.default();
const INDENT_LESS = exports.INDENT_LESS = new _IndentCommand.default(-1);
const INDENT_MORE = exports.INDENT_MORE = new _IndentCommand.default(1);
const LINK_SET_URL = exports.LINK_SET_URL = new _LinkSetURLCommand.default();
const LIST_ITEM_INSERT_NEW_LINE = exports.LIST_ITEM_INSERT_NEW_LINE = new _ListItemInsertNewLineCommand.default();
const LIST_ITEM_MERGE_DOWN = exports.LIST_ITEM_MERGE_DOWN = new _ListItemMergeCommand.default('down');
const LIST_ITEM_MERGE_UP = exports.LIST_ITEM_MERGE_UP = new _ListItemMergeCommand.default('up');
const LIST_SPLIT = exports.LIST_SPLIT = new _ListSplitCommand.default();
const MATH_EDIT = exports.MATH_EDIT = new _MathEditCommand.default();
const OL = exports.OL = new _ListToggleCommand.default(true);
const PRINT = exports.PRINT = new _PrintCommand.default();
const STRIKE = exports.STRIKE = new _MarkToggleCommand.default(MARK_STRIKE);
const STRONG = exports.STRONG = new _MarkToggleCommand.default(MARK_STRONG);
const SUPER = exports.SUPER = new _MarkToggleCommand.default(MARK_SUPER);
const SUB = exports.SUB = new _MarkToggleCommand.default(MARK_SUB);
const TABLE_ADD_COLUMN_AFTER = exports.TABLE_ADD_COLUMN_AFTER = (0, _createCommand.default)(addColumnAfter);
const TABLE_ADD_COLUMN_BEFORE = exports.TABLE_ADD_COLUMN_BEFORE = (0, _createCommand.default)(addColumnBefore);
const TABLE_ADD_ROW_AFTER = exports.TABLE_ADD_ROW_AFTER = (0, _createCommand.default)(addRowAfter);
const TABLE_ADD_ROW_BEFORE = exports.TABLE_ADD_ROW_BEFORE = (0, _createCommand.default)(addRowBefore);
const TABLE_BACKGROUND_COLOR = exports.TABLE_BACKGROUND_COLOR = new _TableBackgroundColorCommand.default();
const TABLE_BORDER_COLOR = exports.TABLE_BORDER_COLOR = new _TableBorderColorCommand.default();
const TABLE_DELETE_COLUMN = exports.TABLE_DELETE_COLUMN = (0, _createCommand.default)(deleteColumn);
const TABLE_DELETE_ROW = exports.TABLE_DELETE_ROW = (0, _createCommand.default)(deleteRow);
const TABLE_DELETE_TABLE = exports.TABLE_DELETE_TABLE = (0, _createCommand.default)(deleteTable);
const TABLE_INSERT_TABLE = exports.TABLE_INSERT_TABLE = new _TableInsertCommand.default();
const TABLE_MERGE_CELLS = exports.TABLE_MERGE_CELLS = new _TableMergeCellsCommand.default();
const TABLE_MOVE_TO_NEXT_CELL = exports.TABLE_MOVE_TO_NEXT_CELL = (0, _createCommand.default)(goToNextCell(1));
const TABLE_MOVE_TO_PREV_CELL = exports.TABLE_MOVE_TO_PREV_CELL = (0, _createCommand.default)(goToNextCell(-1));
const TABLE_SPLIT_ROW = exports.TABLE_SPLIT_ROW = (0, _createCommand.default)(splitCell);
const TABLE_TOGGLE_HEADER_CELL = exports.TABLE_TOGGLE_HEADER_CELL = (0, _createCommand.default)(toggleHeaderCell);
const TABLE_TOGGLE_HEADER_COLUMN = exports.TABLE_TOGGLE_HEADER_COLUMN = (0, _createCommand.default)(toggleHeaderColumn);
const TABLE_TOGGLE_HEADER_ROW = exports.TABLE_TOGGLE_HEADER_ROW = (0, _createCommand.default)(toggleHeaderRow);
const TEXT_ALIGN_CENTER = exports.TEXT_ALIGN_CENTER = new _TextAlignCommand.default('center');
const TEXT_ALIGN_JUSTIFY = exports.TEXT_ALIGN_JUSTIFY = new _TextAlignCommand.default('justify');
const TEXT_ALIGN_LEFT = exports.TEXT_ALIGN_LEFT = new _TextAlignCommand.default('left');
const TEXT_ALIGN_RIGHT = exports.TEXT_ALIGN_RIGHT = new _TextAlignCommand.default('right');
const TEXT_COLOR = exports.TEXT_COLOR = new _TextColorCommand.default();
const TEXT_HIGHLIGHT = exports.TEXT_HIGHLIGHT = new _TextHighlightCommand.default();
const TEXT_INSERT_TAB_SPACE = exports.TEXT_INSERT_TAB_SPACE = new _TextInsertTabSpaceCommand.default();
const TEXT_LINE_SPACINGS = exports.TEXT_LINE_SPACINGS = _TextLineSpacingCommand.default.createGroup();
const UL = exports.UL = new _ListToggleCommand.default(false);
const UNDERLINE = exports.UNDERLINE = new _MarkToggleCommand.default(MARK_UNDERLINE);