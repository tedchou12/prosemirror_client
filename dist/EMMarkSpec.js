"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Types = require("./Types");

const EM_DOM = ['em', 0];
const EMMarkSpec = {
  parseDOM: [{
    tag: 'i'
  }, {
    tag: 'em'
  }, {
    style: 'font-style=italic'
  }],

  toDOM() {
    return EM_DOM;
  }

};
var _default = EMMarkSpec;
exports.default = _default;