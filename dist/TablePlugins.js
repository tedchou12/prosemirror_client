"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorTables = require("prosemirror-tables");
var _TableCellMenuPlugin = _interopRequireDefault(require("./TableCellMenuPlugin"));
var _TableResizePlugin = _interopRequireDefault(require("./TableResizePlugin"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Tables
// https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
var _default = exports.default = [new _TableCellMenuPlugin.default(), new _TableResizePlugin.default(), (0, _prosemirrorTables.tableEditing)()];