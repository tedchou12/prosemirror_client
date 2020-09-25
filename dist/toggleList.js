"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleList;
exports.unwrapNodesFromList = unwrapNodesFromList;

var _consolidateListNodes = _interopRequireDefault(require("./consolidateListNodes"));

var _compareNumber = _interopRequireDefault(require("./compareNumber"));

var _nullthrows = _interopRequireDefault(require("nullthrows"));

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorUtils = require("prosemirror-utils");

var _NodeNames = require("./NodeNames");

var _isListNode = _interopRequireDefault(require("./isListNode"));

var _transformAndPreserveTextSelection = _interopRequireWildcard(require("./transformAndPreserveTextSelection"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function toggleList(tr, schema, listNodeType) {
  const {
    selection,
    doc
  } = tr;

  if (!selection || !doc) {
    return tr;
  } // [FS][04-AUG-2020][IRAD-955]
  // Fix Unable to apply list using Ctrl+A selection


  let {
    from,
    to
  } = selection;
  let newselection = null;

  if (from === 0) {
    from = 1;
    newselection = _prosemirrorState.TextSelection.create(doc, from, to);
    tr = tr.setSelection(newselection);
  }

  const fromSelection = _prosemirrorState.TextSelection.create(doc, from, from);

  const paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  const heading = schema.nodes[_NodeNames.HEADING];
  const result = (0, _prosemirrorUtils.findParentNodeOfType)(listNodeType)(fromSelection);
  const p = (0, _prosemirrorUtils.findParentNodeOfType)(paragraph)(fromSelection);
  const h = (0, _prosemirrorUtils.findParentNodeOfType)(heading)(fromSelection);

  if (result) {
    tr = unwrapNodesFromList(tr, schema, result.pos);
  } else if (paragraph && p) {
    tr = wrapNodesWithList(tr, schema, listNodeType, newselection);
  } else if (heading && h) {
    tr = wrapNodesWithList(tr, schema, listNodeType, newselection);
  }

  return tr;
}

function unwrapNodesFromList(tr, schema, listNodePos, unwrapParagraphNode) {
  return (0, _transformAndPreserveTextSelection.default)(tr, schema, memo => {
    return (0, _consolidateListNodes.default)(unwrapNodesFromListInternal(memo, listNodePos, unwrapParagraphNode));
  });
}

function wrapNodesWithList(tr, schema, listNodeType) {
  let newselection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return (0, _transformAndPreserveTextSelection.default)(tr, schema, memo => {
    // [FS][04-AUG-2020][IRAD-955]
    // Fix Unable to apply list using Ctrl+A selection
    return (0, _consolidateListNodes.default)(wrapNodesWithListInternal(memo, listNodeType, newselection));
  });
}

function wrapNodesWithListInternal(memo, listNodeType) {
  let newselection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  const {
    schema
  } = memo;
  let {
    tr
  } = memo;
  const {
    doc,
    selection
  } = tr;
  let {
    from,
    to
  } = selection;

  if (!tr || !selection) {
    return tr;
  }

  if (newselection) {
    from = newselection.from;
    to = newselection.to;
  }

  const paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  const heading = schema.nodes[_NodeNames.HEADING];
  let items = null;
  let lists = [];
  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;
    const nodeName = nodeType.name;

    if ((0, _isListNode.default)(node)) {
      if (node.type !== listNodeType) {
        const listNodeAttrs = _objectSpread(_objectSpread({}, node.attrs), {}, {
          listNodeType: null
        });

        tr = tr.setNodeMarkup(pos, listNodeType, listNodeAttrs, node.marks);
      }

      items && lists.push(items);
      items = null;
      return false;
    }

    if (/table/.test(nodeName)) {
      items && lists.push(items);
      items = null;
      return true;
    }

    if (nodeType === heading || nodeType === paragraph) {
      items = items || [];
      items.push({
        node,
        pos
      });
    } else {
      items && items.length && lists.push(items);
      items = null;
    }

    return true;
  });
  items && items.length && lists.push(items);
  lists = lists.filter(items => items.length > 0);

  if (!lists.length) {
    return tr;
  }

  lists = lists.sort((a, b) => {
    const pa = (0, _nullthrows.default)(a[0]).pos;
    const pb = (0, _nullthrows.default)(b[0]).pos;
    return pa >= pb ? 1 : -1;
  });
  lists.reverse();
  lists.forEach(items => {
    tr = wrapItemsWithListInternal(tr, schema, listNodeType, items);
  });
  return tr;
}

function wrapItemsWithListInternal(tr, schema, listNodeType, items) {
  const initialTr = tr;
  const paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  const listItem = schema.nodes[_NodeNames.LIST_ITEM];

  if (!paragraph || !listItem) {
    return tr;
  }

  const paragraphNodes = [];
  items.forEach(item => {
    const {
      node,
      pos
    } = item; // Temporarily annotate each node with an unique ID.

    const uniqueID = {};

    const nodeAttrs = _objectSpread(_objectSpread({}, node.attrs), {}, {
      id: uniqueID
    }); // Replace the original node with the node annotated by the uniqueID.


    tr = tr.setNodeMarkup(pos, paragraph, nodeAttrs, node.marks);
    paragraphNodes.push(tr.doc.nodeAt(pos));
  });
  const firstNode = paragraphNodes[0];
  const lastNode = paragraphNodes[paragraphNodes.length - 1];

  if (!firstNode || !lastNode) {
    return initialTr;
  }

  const firstNodeID = firstNode.attrs.id;
  const lastNodeID = lastNode.attrs.id;

  if (!firstNodeID || !lastNodeID) {
    return initialTr;
  }

  let fromPos = null;
  let toPos = null;
  tr.doc.descendants((node, pos) => {
    const nodeID = node.attrs.id;

    if (nodeID === firstNodeID) {
      fromPos = pos;
    }

    if (nodeID === lastNodeID) {
      toPos = pos + node.nodeSize;
    }

    return fromPos === null || toPos === null;
  });

  if (fromPos === null || toPos === null) {
    return initialTr;
  }

  const listItemNodes = [];
  items.forEach(item => {
    const {
      node
    } = item; // Restore the annotated nodes with the copy of the original ones.

    const paragraphNode = paragraph.create(node.attrs, node.content, node.marks);
    const listItemNode = listItem.create(node.attrs, _prosemirrorModel.Fragment.from(paragraphNode));
    listItemNodes.push(listItemNode);
  });
  const listNodeAttrs = {
    indent: 0,
    start: 1
  };
  const $fromPos = tr.doc.resolve(fromPos);
  const $toPos = tr.doc.resolve(toPos);
  const hasSameListNodeBefore = $fromPos.nodeBefore && $fromPos.nodeBefore.type === listNodeType && $fromPos.nodeBefore.attrs.indent === 0;
  const hasSameListNodeAfter = $toPos.nodeAfter && $toPos.nodeAfter.type === listNodeType && $toPos.nodeAfter.attrs.indent === 0;

  if (hasSameListNodeBefore) {
    tr = tr.delete(fromPos, toPos);
    tr = tr.insert(fromPos - 1, _prosemirrorModel.Fragment.from(listItemNodes));

    if (hasSameListNodeAfter) {
      tr = tr.delete(toPos + 1, toPos + 3);
    }
  } else if (hasSameListNodeAfter) {
    tr = tr.delete(fromPos, toPos);
    tr = tr.insert(fromPos + 1, _prosemirrorModel.Fragment.from(listItemNodes));
  } else {
    const listNode = listNodeType.create(listNodeAttrs, _prosemirrorModel.Fragment.from(listItemNodes));
    tr = tr.delete(fromPos, toPos);
    tr = tr.insert(fromPos, _prosemirrorModel.Fragment.from(listNode));
  }

  return tr;
} // [FS] IRAD-966 2020-05-20
// Fix: Toggling issue for Multi-level list.


function unwrapNodesFromSelection(tr, listNodePos, nodes, unwrapParagraphNode, from, to) {
  const contentBlocksBefore = [];
  const contentBlocksSelected = [];
  const contentBlocksAfter = [];
  const paragraph = nodes[_NodeNames.PARAGRAPH];
  const listItem = nodes[_NodeNames.LIST_ITEM];
  const listNode = tr.doc.nodeAt(listNodePos);
  tr.doc.nodesBetween(listNodePos, listNodePos + listNode.nodeSize, (node, pos, parentNode, index) => {
    if (node.type !== paragraph) {
      return true;
    }

    const block = {
      node,
      pos,
      parentNode,
      index
    };

    if (pos + node.nodeSize <= from) {
      contentBlocksBefore.push(block);
    } else if (pos > to) {
      contentBlocksAfter.push(block);
    } else {
      contentBlocksSelected.push(block);
    }

    return false;
  });

  if (!contentBlocksSelected.length) {
    return tr;
  }

  tr = tr.delete(listNodePos, listNodePos + listNode.nodeSize);
  const listNodeType = listNode.type;
  const attrs = {
    indent: listNode.attrs.indent,
    start: 1
  };

  if (contentBlocksAfter.length) {
    const nodes = contentBlocksAfter.map(block => {
      return listItem.create({}, _prosemirrorModel.Fragment.from(block.node));
    });

    const frag = _prosemirrorModel.Fragment.from(listNodeType.create(attrs, _prosemirrorModel.Fragment.from(nodes)));

    tr = tr.insert(listNodePos, frag);
  }

  if (contentBlocksSelected.length) {
    const nodes = contentBlocksSelected.map(block => {
      if (unwrapParagraphNode) {
        return unwrapParagraphNode(block.node);
      } else {
        return block.node;
      }
    });

    const frag = _prosemirrorModel.Fragment.from(nodes);

    tr = tr.insert(listNodePos, frag);
  }

  if (contentBlocksBefore.length) {
    const nodes = contentBlocksBefore.map(block => {
      return listItem.create({}, _prosemirrorModel.Fragment.from(block.node));
    });

    const frag = _prosemirrorModel.Fragment.from(listNodeType.create(attrs, _prosemirrorModel.Fragment.from(nodes)));

    tr = tr.insert(listNodePos, frag);
  }

  return tr;
}

function unwrapNodesFromListInternal(memo, listNodePos, unwrapParagraphNode) {
  const {
    schema
  } = memo;
  let {
    tr
  } = memo;

  if (!tr.doc || !tr.selection) {
    return tr;
  }

  const {
    nodes
  } = schema;
  const paragraph = nodes[_NodeNames.PARAGRAPH];
  const listItem = nodes[_NodeNames.LIST_ITEM];

  if (!listItem || !paragraph) {
    return tr;
  }

  const listNode = tr.doc.nodeAt(listNodePos);

  if (!(0, _isListNode.default)(listNode)) {
    return tr;
  }

  const initialSelection = tr.selection;
  const {
    from,
    to
  } = initialSelection;
  const listNodePoses = []; // keep all list type nodes starting position

  tr.doc.nodesBetween(from, to, (node, pos) => {
    if ((0, _isListNode.default)(node)) {
      listNodePoses.push(pos);
    }
  });

  if (from === to && from < 1) {
    return tr;
  } // Unwraps all selected list


  listNodePoses.sort(_compareNumber.default).reverse().forEach(pos => {
    tr = unwrapNodesFromSelection(tr, pos, nodes, unwrapParagraphNode, from, to);
  });
  return tr;
}