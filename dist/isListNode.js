"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isListNode;
var _prosemirrorModel = require("prosemirror-model");
var _isBulletListNode = _interopRequireDefault(require("./isBulletListNode"));
var _isOrderedListNode = _interopRequireDefault(require("./isOrderedListNode"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function isListNode(node) {
  if (node instanceof _prosemirrorModel.Node) {
    return (0, _isBulletListNode.default)(node) || (0, _isOrderedListNode.default)(node);
  }
  return false;
}