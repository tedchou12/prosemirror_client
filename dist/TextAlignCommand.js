"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTextAlign = setTextAlign;
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _NodeNames = require("./NodeNames");

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function setTextAlign(tr, schema, alignment) {
  const {
    selection,
    doc
  } = tr;

  if (!selection || !doc) {
    return tr;
  }

  const {
    from,
    to
  } = selection;
  const {
    nodes
  } = schema;
  const blockquote = nodes[_NodeNames.BLOCKQUOTE];
  const listItem = nodes[_NodeNames.LIST_ITEM];
  const heading = nodes[_NodeNames.HEADING];
  const paragraph = nodes[_NodeNames.PARAGRAPH];
  const tasks = [];
  alignment = alignment || null;
  const allowedNodeTypes = new Set([blockquote, heading, listItem, paragraph]);
  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type;
    const align = node.attrs.align || null;

    if (align !== alignment && allowedNodeTypes.has(nodeType)) {
      tasks.push({
        node,
        pos,
        nodeType
      });
    }

    return true;
  });

  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(job => {
    const {
      node,
      pos,
      nodeType
    } = job;
    let {
      attrs
    } = node;

    if (alignment) {
      attrs = _objectSpread(_objectSpread({}, attrs), {}, {
        align: alignment
      });
    } else {
      attrs = _objectSpread(_objectSpread({}, attrs), {}, {
        align: null
      });
    }

    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
  });
  return tr;
}

class TextAlignCommand extends _UICommand.default {
  constructor(alignment) {
    super();

    _defineProperty(this, "_alignment", void 0);

    _defineProperty(this, "isActive", state => {
      const {
        selection,
        doc
      } = state;
      const {
        from,
        to
      } = selection;
      let keepLooking = true;
      let active = false;
      doc.nodesBetween(from, to, (node, pos) => {
        if (keepLooking && node.attrs.align === this._alignment) {
          keepLooking = false;
          active = true;
        }

        return keepLooking;
      });
      return active;
    });

    _defineProperty(this, "isEnabled", state => {
      const {
        selection
      } = state;
      return selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection;
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = setTextAlign(state.tr.setSelection(selection), schema, this._alignment);

      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });

    this._alignment = alignment;
  }

}

var _default = TextAlignCommand;
exports.default = _default;