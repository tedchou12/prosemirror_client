"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorModel = require("prosemirror-model");
var _EditorMarks = _interopRequireDefault(require("./EditorMarks"));
var _EditorNodes = _interopRequireDefault(require("./EditorNodes"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const EditorSchema = new _prosemirrorModel.Schema({
  nodes: _EditorNodes.default,
  marks: _EditorMarks.default
});
var _default = exports.default = EditorSchema;