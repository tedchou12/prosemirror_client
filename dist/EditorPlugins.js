"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _EditorSchema = _interopRequireDefault(require("./EditorSchema"));
var _buildEditorPlugins = _interopRequireDefault(require("./buildEditorPlugins"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Plugin
const EditorPlugins = (0, _buildEditorPlugins.default)(_EditorSchema.default);
var _default = exports.default = EditorPlugins;