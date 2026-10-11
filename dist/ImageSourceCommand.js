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
var _CursorPlaceholderPlugin = require("./CursorPlaceholderPlugin");
var _NodeNames = require("./NodeNames");
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));
var _Types = require("./Types");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function insertImage(tr, schema, src) {
  const {
    selection
  } = tr;
  if (!selection) {
    return tr;
  }
  const {
    from,
    to
  } = selection;
  if (from !== to) {
    return tr;
  }
  const image = schema.nodes[_NodeNames.IMAGE];
  if (!image) {
    return tr;
  }
  const attrs = {
    src: src || '',
    alt: '',
    title: ''
  };
  const node = image.create(attrs, null, null);
  const frag = _prosemirrorModel.Fragment.from(node);
  tr = tr.insert(from, frag);
  return tr;
}
class ImageSourceCommand extends _UICommand.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_popUp", null);
    _defineProperty(this, "isEnabled", (state, view) => {
      return this.__isEnabled(state, view);
    });
    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      if (this._popUp) {
        return Promise.resolve(undefined);
      }
      if (dispatch) {
        dispatch((0, _CursorPlaceholderPlugin.showCursorPlaceholder)(state));
      }
      return new Promise(resolve => {
        const props = {
          runtime: view ? view.runtime : null
        };
        this._popUp = (0, _createPopUp.default)(this.getEditor(), props, {
          modal: true,
          onClose: val => {
            if (this._popUp) {
              this._popUp = null;
              resolve(val);
            }
          }
        });
      });
    });
    _defineProperty(this, "executeWithUserInput", (state, dispatch, view, inputs) => {
      if (dispatch) {
        const {
          selection,
          schema
        } = state;
        let {
          tr
        } = state;
        tr = view ? (0, _CursorPlaceholderPlugin.hideCursorPlaceholder)(view.state) : tr;
        tr = tr.setSelection(selection);
        if (inputs) {
          const {
            src
          } = inputs;
          tr = insertImage(tr, schema, src);
        }
        dispatch(tr);
        view && view.focus();
      }
      return false;
    });
    _defineProperty(this, "__isEnabled", (state, view) => {
      const tr = state;
      const {
        selection
      } = tr;
      if (selection instanceof _prosemirrorState.TextSelection) {
        return selection.from === selection.to;
      }
      return false;
    });
  }
  getEditor() {
    throw new Error('Not implemented');
  }
}
var _default = exports.default = ImageSourceCommand;