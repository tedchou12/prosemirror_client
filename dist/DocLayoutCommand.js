"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var _SetDocAttrStep = _interopRequireDefault(require("./SetDocAttrStep"));
var _DocLayoutEditor = _interopRequireWildcard(require("./ui/DocLayoutEditor"));
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function setDocLayout(tr, schema, width, layout) {
  const {
    doc
  } = tr;
  if (!doc) {
    return tr;
  }
  tr = tr.step(new _SetDocAttrStep.default('width', width || null));
  tr = tr.step(new _SetDocAttrStep.default('layout', layout || null));
  return tr;
}
class DocLayoutCommand extends _UICommand.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_popUp", null);
    _defineProperty(this, "isEnabled", state => {
      return true;
    });
    _defineProperty(this, "isActive", state => {
      return !!this._popUp;
    });
    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      if (this._popUp) {
        return Promise.resolve(undefined);
      }
      const {
        doc
      } = state;
      return new Promise(resolve => {
        const props = {
          initialValue: doc.attrs
        };
        this._popUp = (0, _createPopUp.default)(_DocLayoutEditor.default, props, {
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
        // tr = view ? hideCursorPlaceholder(view.state) : tr;
        tr = tr.setSelection(selection);
        if (inputs) {
          const {
            width,
            layout
          } = inputs;
          tr = setDocLayout(tr, schema, width, layout);
        }
        dispatch(tr);
        view && view.focus();
      }
      return false;
    });
  }
}
var _default = exports.default = DocLayoutCommand;