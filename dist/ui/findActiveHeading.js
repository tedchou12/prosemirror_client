"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HEADING_NAME_DEFAULT = void 0;
exports.findActiveHeading = findActiveHeading;
var _prosemirrorState = require("prosemirror-state");
var _NodeNames = require("../NodeNames");
var _prosemirrorUtils = require("prosemirror-utils");
var _i18n = _interopRequireDefault(require("./i18n"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const HEADING_NAME_DEFAULT = exports.HEADING_NAME_DEFAULT = [(0, _i18n.default)('Normal')];
// [FS] IRAD-1042 2020-09-15
// To find the selected heading

function findActiveHeading(state) {
  const {
    schema,
    doc,
    selection,
    tr
  } = state;
  const markType = schema.nodes[_NodeNames.HEADING];
  if (!markType) {
    return HEADING_NAME_DEFAULT;
  }
  const fn = markType ? (0, _prosemirrorUtils.findParentNodeOfType)(markType) : null;
  const headingName = fn(state.selection);
  // const level = headingName.node.attrs.level;
  if (headingName && undefined !== headingName) {
    return headingName.node.attrs.level;
  }
  return 0;
}