"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HEADING_NAMES = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _ParagraphNodeSpec = _interopRequireWildcard(require("./ParagraphNodeSpec"));

var _Types = require("./Types");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const TAG_NAME_TO_LEVEL = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6
}; // [FS] IRAD-1042 2020-09-09
// Fix: Changes the menu for include the custom styles.

const HEADING_NAMES = [{
  "name": "Normal",
  "level": 0
}, {
  "name": "Heading 1",
  "level": 1
}, {
  "name": "Heading 2",
  "level": 2
}, {
  "name": "Heading 3",
  "level": 3
}, {
  "name": "Heading 4",
  "level": 4
}, {
  "name": "Title",
  "customstyles": [{
    'stylename': 'Title',
    // 'fontsize' : 30,
    // 'fontname' : 'Acme',
    'strong': true,
    'em': true,
    'color': 'Green'
  }]
}, {
  "name": "Quote",
  "style": [{
    "font-size": 20,
    "font-name": "Arial"
  }]
}]; // https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.

exports.HEADING_NAMES = HEADING_NAMES;

const HeadingNodeSpec = _objectSpread(_objectSpread({}, _ParagraphNodeSpec.default), {}, {
  attrs: _objectSpread(_objectSpread({}, _ParagraphNodeSpec.default.attrs), {}, {
    level: {
      default: 1
    }
  }),
  defining: true,
  parseDOM: [{
    tag: 'h1',
    getAttrs
  }, {
    tag: 'h2',
    getAttrs
  }, {
    tag: 'h3',
    getAttrs
  }, {
    tag: 'h4',
    getAttrs
  }, {
    tag: 'h5',
    getAttrs
  }, {
    tag: 'h6',
    getAttrs
  }],
  toDOM
});

function toDOM(node) {
  const dom = (0, _ParagraphNodeSpec.toParagraphDOM)(node);
  const level = node.attrs.level || 1;
  dom[0] = `h${level}`;
  return dom;
}

function getAttrs(dom) {
  const attrs = (0, _ParagraphNodeSpec.getParagraphNodeAttrs)(dom);
  const level = TAG_NAME_TO_LEVEL[dom.nodeName.toUpperCase()] || 1;
  attrs.level = level;
  return attrs;
}

var _default = HeadingNodeSpec;
exports.default = _default;