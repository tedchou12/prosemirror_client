"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_DOC_JSON = void 0;
exports.default = createEmptyEditorStateschema;
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorState = require("prosemirror-state");
var _convertFromJSON = _interopRequireDefault(require("./convertFromJSON"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EMPTY_DOC_JSON = exports.EMPTY_DOC_JSON = {
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{
      type: 'text',
      text: ' '
    }]
  }]
};
function createEmptyEditorStateschema(schema, plugins) {
  // TODO: Check if schema support doc and paragraph nodes.
  return (0, _convertFromJSON.default)(EMPTY_DOC_JSON, schema, plugins);
}