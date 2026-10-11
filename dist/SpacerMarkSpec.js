"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SPACER_SIZE_TAB_LARGE = exports.SPACER_SIZE_TAB = exports.HAIR_SPACE_CHAR = exports.DOM_ATTRIBUTE_SIZE = void 0;
var _prosemirrorModel = require("prosemirror-model");
var _Types = require("./Types");
const DOM_ATTRIBUTE_SIZE = exports.DOM_ATTRIBUTE_SIZE = 'data-spacer-size';
const SPACER_SIZE_TAB = exports.SPACER_SIZE_TAB = 'tab';
const SPACER_SIZE_TAB_LARGE = exports.SPACER_SIZE_TAB_LARGE = 'tab-large';

// See http://jkorpela.fi/chars/spaces.html
const HAIR_SPACE_CHAR = exports.HAIR_SPACE_CHAR = '\u200A';
const SpacerMarkSpec = {
  attrs: {
    size: {
      default: SPACER_SIZE_TAB
    }
  },
  defining: true,
  draggable: false,
  excludes: '_',
  group: 'inline',
  inclusive: false,
  inline: true,
  spanning: false,
  parseDOM: [{
    tag: `span[${DOM_ATTRIBUTE_SIZE}]`,
    getAttrs: el => {
      return {
        size: el.getAttribute(DOM_ATTRIBUTE_SIZE) || SPACER_SIZE_TAB
      };
    }
  }],
  toDOM(node) {
    const {
      size
    } = node.attrs;
    return ['span', {
      [DOM_ATTRIBUTE_SIZE]: size
    }, 0];
  }
};
var _default = exports.default = SpacerMarkSpec;