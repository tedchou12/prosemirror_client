"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = updateIndentLevel;

var _clamp = _interopRequireDefault(require("./ui/clamp"));

var _compareNumber = _interopRequireDefault(require("./compareNumber"));

var _consolidateListNodes = _interopRequireDefault(require("./consolidateListNodes"));

var _isListNode = _interopRequireDefault(require("./isListNode"));

var _transformAndPreserveTextSelection = _interopRequireDefault(require("./transformAndPreserveTextSelection"));

var _prosemirrorState = require("prosemirror-state");

var _NodeNames = require("./NodeNames");

var _prosemirrorModel = require("prosemirror-model");

var _ParagraphNodeSpec = require("./ParagraphNodeSpec");

var _prosemirrorTransform = require("prosemirror-transform");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function updateIndentLevel(tr, schema, delta) {
  const {
    doc,
    selection
  } = tr;

  if (!doc || !selection) {
    return tr;
  }

  if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    return tr;
  }

  const {
    nodes
  } = schema;
  const {
    from,
    to
  } = selection;
  const listNodePoses = [];
  const blockquote = nodes[_NodeNames.BLOCKQUOTE];
  const heading = nodes[_NodeNames.HEADING];
  const paragraph = nodes[_NodeNames.PARAGRAPH];
  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;

    if (nodeType === paragraph || nodeType === heading || nodeType === blockquote) {
      tr = setNodeIndentMarkup(tr, schema, pos, delta);
      return false;
    } else if ((0, _isListNode.default)(node)) {
      // List is tricky, we'll handle it later.
      listNodePoses.push(pos);
      return false;
    }

    return true;
  });

  if (!listNodePoses.length) {
    return tr;
  }

  tr = (0, _transformAndPreserveTextSelection.default)(tr, schema, memo => {
    const {
      schema
    } = memo;
    let tr2 = memo.tr;
    listNodePoses.sort(_compareNumber.default).reverse().forEach(pos => {
      tr2 = setListNodeIndent(tr2, schema, pos, delta);
    });
    tr2 = (0, _consolidateListNodes.default)(tr2);
    return tr2;
  });
  return tr;
}

function setListNodeIndent(tr, schema, pos, delta) {
  const listItem = schema.nodes[_NodeNames.LIST_ITEM];

  if (!listItem) {
    return tr;
  }

  const {
    doc,
    selection
  } = tr;

  if (!doc) {
    return tr;
  }

  const listNode = doc.nodeAt(pos);

  if (!listNode) {
    return tr;
  }

  const indentNew = (0, _clamp.default)(_ParagraphNodeSpec.MIN_INDENT_LEVEL, listNode.attrs.indent + delta, _ParagraphNodeSpec.MAX_INDENT_LEVEL);

  if (indentNew === listNode.attrs.indent) {
    return tr;
  }

  const {
    from,
    to
  } = selection; // [FS] IRAD-947 2020-05-19
  // Fix for Multi-level lists lose multi-levels when indenting/de-indenting 
  // Earlier they checked the to postion value to >= pos + listNode.nodeSize
  // It wont satisfy the list hve childrens 

  if (from <= pos && to >= pos) {
    return setNodeIndentMarkup(tr, schema, pos, delta);
  }

  const listNodeType = listNode.type; // listNode is partially selected.

  const itemsBefore = [];
  const itemsSelected = [];
  const itemsAfter = [];
  doc.nodesBetween(pos, pos + listNode.nodeSize, (itemNode, itemPos) => {
    if (itemNode.type === listNodeType) {
      return true;
    }

    if (itemNode.type === listItem) {
      const listItemNode = listItem.create(itemNode.attrs, itemNode.content, itemNode.marks);

      if (itemPos + itemNode.nodeSize <= from) {
        itemsBefore.push(listItemNode);
      } else if (itemPos > to) {
        itemsAfter.push(listItemNode);
      } else {
        itemsSelected.push(listItemNode);
      }

      return false;
    }

    return true;
  });
  tr = tr.delete(pos, pos + listNode.nodeSize);

  if (itemsAfter.length) {
    const listNodeNew = listNodeType.create(listNode.attrs, _prosemirrorModel.Fragment.from(itemsAfter));
    tr = tr.insert(pos, _prosemirrorModel.Fragment.from(listNodeNew));
  }

  if (itemsSelected.length) {
    const listNodeAttrs = _objectSpread(_objectSpread({}, listNode.attrs), {}, {
      indent: indentNew
    });

    const listNodeNew = listNodeType.create(listNodeAttrs, _prosemirrorModel.Fragment.from(itemsSelected));
    tr = tr.insert(pos, _prosemirrorModel.Fragment.from(listNodeNew));
  }

  if (itemsBefore.length) {
    const listNodeNew = listNodeType.create(listNode.attrs, _prosemirrorModel.Fragment.from(itemsBefore));
    tr = tr.insert(pos, _prosemirrorModel.Fragment.from(listNodeNew));
  }

  return tr;
}

function setNodeIndentMarkup(tr, schema, pos, delta) {
  if (!tr.doc) {
    return tr;
  }

  const node = tr.doc.nodeAt(pos);

  if (!node) {
    return tr;
  }

  const indent = (0, _clamp.default)(_ParagraphNodeSpec.MIN_INDENT_LEVEL, (node.attrs.indent || 0) + delta, _ParagraphNodeSpec.MAX_INDENT_LEVEL);

  if (indent === node.attrs.indent) {
    return tr;
  }

  const nodeAttrs = _objectSpread(_objectSpread({}, node.attrs), {}, {
    indent
  });

  return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
}