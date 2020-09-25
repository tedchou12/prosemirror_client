"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleHeading;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTransform = require("prosemirror-transform");

var _NodeNames = require("./NodeNames");

var _compareNumber = _interopRequireDefault(require("./compareNumber"));

var _isInsideListItem = _interopRequireDefault(require("./isInsideListItem"));

var _isListNode = _interopRequireDefault(require("./isListNode"));

var _clearMarks = require("./clearMarks");

var _toggleList = require("./toggleList");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function toggleHeading(tr, schema, level) {
  const {
    nodes
  } = schema;
  const {
    selection,
    doc
  } = tr;
  const blockquote = nodes[_NodeNames.BLOCKQUOTE];
  const heading = nodes[_NodeNames.HEADING];
  const listItem = nodes[_NodeNames.LIST_ITEM];
  const paragraph = nodes[_NodeNames.PARAGRAPH];

  if (!selection || !doc || !heading || !paragraph || !listItem || !blockquote) {
    return tr;
  }

  const {
    from,
    to
  } = tr.selection;
  let startWithHeadingBlock = null;
  const poses = [];
  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type;
    const parentNodeType = parentNode.type;

    if (startWithHeadingBlock === null) {
      startWithHeadingBlock = nodeType === heading && node.attrs.level === level;
    }

    if (parentNodeType !== listItem) {
      poses.push(pos);
    }

    return !(0, _isListNode.default)(node);
  }); // Update from the bottom to avoid disruptive changes in pos.

  poses.sort(_compareNumber.default).reverse().forEach(pos => {
    tr = setHeadingNode(tr, schema, pos, startWithHeadingBlock ? null : level);
  });
  return tr;
}

function setHeadingNode(tr, schema, pos, level) {
  const {
    nodes
  } = schema;
  const heading = nodes[_NodeNames.HEADING];
  const paragraph = nodes[_NodeNames.PARAGRAPH];
  const blockquote = nodes[_NodeNames.BLOCKQUOTE];

  if (pos >= tr.doc.content.size) {
    // Workaround to handle the edge case that pos was shifted caused by `toggleList`.
    return tr;
  }

  const node = tr.doc.nodeAt(pos);

  if (!node || !heading || !paragraph || !blockquote) {
    return tr;
  }

  const nodeType = node.type;

  if ((0, _isInsideListItem.default)(tr.doc, pos)) {
    return tr;
  } else if ((0, _isListNode.default)(node)) {
    // Toggle list
    if (heading && level !== null) {
      tr = (0, _toggleList.unwrapNodesFromList)(tr, schema, pos, paragraphNode => {
        const {
          content,
          marks,
          attrs
        } = paragraphNode;

        const headingAttrs = _objectSpread(_objectSpread({}, attrs), {}, {
          level
        });

        return heading.create(headingAttrs, content, marks);
      });
    }
  } else if (nodeType === heading) {
    // Toggle heading
    if (level === null) {
      tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
    } else {
      tr = tr.setNodeMarkup(pos, heading, _objectSpread(_objectSpread({}, node.attrs), {}, {
        level
      }), node.marks);
    }
  } else if (level && nodeType === paragraph || nodeType === blockquote) {
    // [FS] IRAD-948 2020-05-22
    // Clear Header formatting
    tr = (0, _clearMarks.clearMarks)(tr, schema);
    tr = tr.setNodeMarkup(pos, heading, _objectSpread(_objectSpread({}, node.attrs), {}, {
      level
    }), node.marks);
  }

  return tr;
}