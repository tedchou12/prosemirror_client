"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.setTextAlign = setTextAlign;
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var _NodeNames = require("./NodeNames");
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
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
var _default = exports.default = TextAlignCommand;