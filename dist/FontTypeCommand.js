"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _MarkNames = require("./MarkNames");
var _applyMark = _interopRequireDefault(require("./applyMark"));
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function setFontType(tr, schema, name) {
  const markType = schema.marks[_MarkNames.MARK_FONT_TYPE];
  if (!markType) {
    return tr;
  }
  const {
    selection
  } = tr;
  if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    return tr;
  }
  const attrs = name ? {
    name
  } : null;
  tr = (0, _applyMark.default)(tr, schema, markType, attrs);
  return tr;
}
class FontTypeCommand extends _UICommand.default {
  constructor(name) {
    super();
    _defineProperty(this, "_label", null);
    _defineProperty(this, "_name", '');
    _defineProperty(this, "_popUp", null);
    _defineProperty(this, "renderLabel", state => {
      return this._label;
    });
    _defineProperty(this, "isEnabled", state => {
      const {
        schema,
        selection,
        tr
      } = state;
      if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
        return false;
      }
      const markType = schema.marks[_MarkNames.MARK_FONT_TYPE];
      if (!markType) {
        return false;
      }
      const {
        from,
        to
      } = selection;
      if (to === from + 1) {
        const node = tr.doc.nodeAt(from);
        if (node.isAtom && !node.isText && node.isLeaf) {
          // An atomic node (e.g. Image) is selected.
          return false;
        }
      }
      return true;
    });
    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = setFontType(state.tr.setSelection(selection), schema, this._name);
      if (tr.docChanged || tr.storedMarksSet) {
        // If selection is empty, the color is added to `storedMarks`, which
        // works like `toggleMark`
        // (see https://prosemirror.net/docs/ref/#commands.toggleMark).
        dispatch && dispatch(tr);
        return true;
      }
      return false;
    });
    this._name = name;
    this._label = name ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: name
      }
    }, name) : null;
  }
}
var _default = exports.default = FontTypeCommand;