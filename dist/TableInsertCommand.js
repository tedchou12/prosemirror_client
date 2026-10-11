"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nullthrows = _interopRequireDefault(require("nullthrows"));
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var _insertTable = _interopRequireDefault(require("./insertTable"));
var _PopUpPosition = require("./ui/PopUpPosition");
var _TableGridSizeEditor = _interopRequireWildcard(require("./ui/TableGridSizeEditor"));
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class TableInsertCommand extends _UICommand.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_popUp", null);
    _defineProperty(this, "shouldRespondToUIEvent", e => {
      return e.type === _UICommand.default.EventType.MOUSEENTER;
    });
    _defineProperty(this, "isEnabled", state => {
      const tr = state;
      let bOK = false;
      const {
        selection
      } = tr;
      if (selection instanceof _prosemirrorState.TextSelection) {
        bOK = selection.from === selection.to;
        // [FS] IRAD-1065 2020-09-18
        // Disable create table menu if the selection is inside a table.
        if (bOK) {
          let $head = selection.$head;
          for (let d = $head.depth; d > 0; d--) {
            if ($head.node(d).type.spec.tableRole == "row") {
              return false;
            }
          }
        }
        return bOK;
      }
      return bOK;
    });
    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      if (this._popUp) {
        return Promise.resolve(undefined);
      }
      const target = (0, _nullthrows.default)(event).currentTarget;
      if (!(target instanceof HTMLElement)) {
        return Promise.resolve(undefined);
      }
      const anchor = event ? event.currentTarget : null;
      return new Promise(resolve => {
        this._popUp = (0, _createPopUp.default)(_TableGridSizeEditor.default, null, {
          anchor,
          position: _PopUpPosition.atAnchorRight,
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
        if (inputs) {
          const {
            rows,
            cols
          } = inputs;
          tr = tr.setSelection(selection);
          tr = (0, _insertTable.default)(tr, schema, rows, cols);
        }
        dispatch(tr);
      }
      return false;
    });
  }
}
var _default = exports.default = TableInsertCommand;