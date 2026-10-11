"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertFromHTML;
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorState = require("prosemirror-state");
var _convertFromDOMElement = _interopRequireDefault(require("./convertFromDOMElement"));
var _normalizeHTML = _interopRequireDefault(require("./normalizeHTML"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function convertFromHTML(html, schema, plugins) {
  const root = document.createElement('html');
  const newHTML = (0, _normalizeHTML.default)(html);
  root.innerHTML = newHTML;
  return (0, _convertFromDOMElement.default)(root, schema, plugins);
}