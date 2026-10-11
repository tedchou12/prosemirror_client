"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nullthrows = _interopRequireDefault(require("nullthrows"));
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTables = require("prosemirror-tables");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var _ColorEditor = _interopRequireDefault(require("./ui/ColorEditor"));
var _PopUpPosition = require("./ui/PopUpPosition");
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
const setCellBackgroundBlack = (0, _prosemirrorTables.setCellAttr)('background', '#000000');
class TableCellColorCommand extends _UICommand.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_popUp", null);
    _defineProperty(this, "shouldRespondToUIEvent", e => {
      return e.type === _UICommand.default.EventType.MOUSEENTER;
    });
    _defineProperty(this, "isEnabled", state => {
      return setCellBackgroundBlack(state.tr);
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
        this._popUp = (0, _createPopUp.default)(_ColorEditor.default, null, {
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
    _defineProperty(this, "executeWithUserInput", (state, dispatch, view, hex) => {
      if (dispatch && hex !== undefined) {
        const cmd = (0, _prosemirrorTables.setCellAttr)('background', hex);
        cmd(state, dispatch, view);
        return true;
      }
      return false;
    });
  }
}
var _default = exports.default = TableCellColorCommand;