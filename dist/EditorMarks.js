"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorModel = require("prosemirror-model");
var _CodeMarkSpec = _interopRequireDefault(require("./CodeMarkSpec"));
var _DocNodeSpec = _interopRequireDefault(require("./DocNodeSpec"));
var _EMMarkSpec = _interopRequireDefault(require("./EMMarkSpec"));
var _FontSizeMarkSpec = _interopRequireDefault(require("./FontSizeMarkSpec"));
var _FontTypeMarkSpec = _interopRequireDefault(require("./FontTypeMarkSpec"));
var _LinkMarkSpec = _interopRequireDefault(require("./LinkMarkSpec"));
var MarkNames = _interopRequireWildcard(require("./MarkNames"));
var _NodeNames = require("./NodeNames");
var _ParagraphNodeSpec = _interopRequireDefault(require("./ParagraphNodeSpec"));
var _SpacerMarkSpec = _interopRequireDefault(require("./SpacerMarkSpec"));
var _StrikeMarkSpec = _interopRequireDefault(require("./StrikeMarkSpec"));
var _StrongMarkSpec = _interopRequireDefault(require("./StrongMarkSpec"));
var _TextColorMarkSpec = _interopRequireDefault(require("./TextColorMarkSpec"));
var _TextHighlightMarkSpec = _interopRequireDefault(require("./TextHighlightMarkSpec"));
var _TextNoWrapMarkSpec = _interopRequireDefault(require("./TextNoWrapMarkSpec"));
var _TextNodeSpec = _interopRequireDefault(require("./TextNodeSpec"));
var _TextSelectionMarkSpec = _interopRequireDefault(require("./TextSelectionMarkSpec"));
var _TextSuperMarkSpec = _interopRequireDefault(require("./TextSuperMarkSpec"));
var _TextSubMarkSpec = _interopRequireDefault(require("./TextSubMarkSpec"));
var _TextUnderlineMarkSpec = _interopRequireDefault(require("./TextUnderlineMarkSpec"));
var _CustomStyleMarkSpec = _interopRequireDefault(require("./CustomStyleMarkSpec"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  MARK_CODE,
  MARK_EM,
  MARK_FONT_SIZE,
  MARK_FONT_TYPE,
  MARK_LINK,
  MARK_NO_BREAK,
  MARK_STRIKE,
  MARK_STRONG,
  MARK_SUPER,
  MARK_SUB,
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_TEXT_SELECTION,
  MARK_UNDERLINE,
  MARK_SPACER,
  MARK_CUSTOMSTYLES
} = MarkNames;

// These nodes are required to build basic marks.
const nodes = {
  [_NodeNames.DOC]: _DocNodeSpec.default,
  [_NodeNames.PARAGRAPH]: _ParagraphNodeSpec.default,
  [_NodeNames.TEXT]: _TextNodeSpec.default
};
const marks = {
  // Link mark should be rendered first.
  // https://discuss.prosemirror.net/t/prevent-marks-from-breaking-up-links/401/5
  [MARK_LINK]: _LinkMarkSpec.default,
  [MARK_NO_BREAK]: _TextNoWrapMarkSpec.default,
  [MARK_CODE]: _CodeMarkSpec.default,
  [MARK_EM]: _EMMarkSpec.default,
  [MARK_FONT_SIZE]: _FontSizeMarkSpec.default,
  [MARK_FONT_TYPE]: _FontTypeMarkSpec.default,
  [MARK_SPACER]: _SpacerMarkSpec.default,
  [MARK_STRIKE]: _StrikeMarkSpec.default,
  [MARK_STRONG]: _StrongMarkSpec.default,
  [MARK_SUPER]: _TextSuperMarkSpec.default,
  [MARK_SUB]: _TextSubMarkSpec.default,
  [MARK_TEXT_COLOR]: _TextColorMarkSpec.default,
  [MARK_TEXT_HIGHLIGHT]: _TextHighlightMarkSpec.default,
  [MARK_TEXT_SELECTION]: _TextSelectionMarkSpec.default,
  [MARK_UNDERLINE]: _TextUnderlineMarkSpec.default,
  [MARK_CUSTOMSTYLES]: _CustomStyleMarkSpec.default
};
const schema = new _prosemirrorModel.Schema({
  nodes,
  marks
});
const EditorMarks = schema.spec.marks;
var _default = exports.default = EditorMarks;