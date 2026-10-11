"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.setTextLineSpacing = setTextLineSpacing;
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
var _prosemirrorState = require("prosemirror-state");
var _NodeNames = require("./NodeNames");
var _prosemirrorView = require("prosemirror-view");
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorTransform = require("prosemirror-transform");
var _i18n = _interopRequireDefault(require("./ui/i18n"));
var _toCSSLineSpacing = require("./ui/toCSSLineSpacing");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function setTextLineSpacing(tr, schema, lineSpacing) {
  const {
    selection,
    doc
  } = tr;
  if (!selection || !doc) {
    return tr;
  }
  if (!(selection instanceof _prosemirrorState.TextSelection) && !(selection instanceof _prosemirrorState.AllSelection)) {
    return tr;
  }
  const {
    from,
    to
  } = selection;
  const paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  const heading = schema.nodes[_NodeNames.HEADING];
  const listItem = schema.nodes[_NodeNames.LIST_ITEM];
  const blockquote = schema.nodes[_NodeNames.BLOCKQUOTE];
  if (!paragraph && !heading && !listItem && !blockquote) {
    return tr;
  }
  const tasks = [];
  const lineSpacingValue = lineSpacing || null;
  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type;
    if (nodeType === paragraph || nodeType === heading || nodeType === listItem || nodeType === blockquote) {
      const lineSpacing = node.attrs.lineSpacing || null;
      if (lineSpacing !== lineSpacingValue) {
        tasks.push({
          node,
          pos,
          nodeType
        });
      }
      return nodeType === listItem ? true : false;
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
    if (lineSpacingValue) {
      attrs = _objectSpread(_objectSpread({}, attrs), {}, {
        lineSpacing: lineSpacingValue
      });
    } else {
      attrs = _objectSpread(_objectSpread({}, attrs), {}, {
        lineSpacing: null
      });
    }
    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
  });
  return tr;
}
function createGroup() {
  const group = {
    [(0, _i18n.default)('Single')]: new TextLineSpacingCommand(_toCSSLineSpacing.SINGLE_LINE_SPACING),
    '1.15': new TextLineSpacingCommand(_toCSSLineSpacing.LINE_SPACING_115),
    '1.5': new TextLineSpacingCommand(_toCSSLineSpacing.LINE_SPACING_150),
    [(0, _i18n.default)('Double')]: new TextLineSpacingCommand(_toCSSLineSpacing.DOUBLE_LINE_SPACING)
  };
  return [group];
}
class TextLineSpacingCommand extends _UICommand.default {
  constructor(lineSpacing) {
    super();
    _defineProperty(this, "_lineSpacing", void 0);
    _defineProperty(this, "isActive", state => {
      const {
        selection,
        doc,
        schema
      } = state;
      const {
        from,
        to
      } = selection;
      const paragraph = schema.nodes[_NodeNames.PARAGRAPH];
      const heading = schema.nodes[_NodeNames.HEADING];
      let keepLooking = true;
      let active = false;
      doc.nodesBetween(from, to, (node, pos) => {
        const nodeType = node.type;
        if (keepLooking && (nodeType === paragraph || nodeType === heading) && node.attrs.lineSpacing === this._lineSpacing) {
          keepLooking = false;
          active = true;
        }
        return keepLooking;
      });
      return active;
    });
    _defineProperty(this, "isEnabled", state => {
      return this.isActive(state) || this.execute(state);
    });
    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = setTextLineSpacing(state.tr.setSelection(selection), schema, this._lineSpacing);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });
    this._lineSpacing = lineSpacing;
  }
}
_defineProperty(TextLineSpacingCommand, "createGroup", createGroup);
var _default = exports.default = TextLineSpacingCommand;