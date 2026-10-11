"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bpfrpt_proptype_SetStateCall = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorModel = require("prosemirror-model");
var _reactDom = _interopRequireDefault(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
var bpfrpt_proptype_SetStateCall = exports.bpfrpt_proptype_SetStateCall = _propTypes.default.func;
class SimpleConnector {
  constructor(_editorState, setState) {
    _defineProperty(this, "_setState", void 0);
    _defineProperty(this, "_editorState", void 0);
    _defineProperty(this, "onEdit", transaction => {
      _reactDom.default.unstable_batchedUpdates(() => {
        const editorState = this._editorState.apply(transaction);
        const state = {
          editorState,
          data: transaction.doc.toJSON()
        };
        this._setState(state, () => {
          this._editorState = editorState;
        });
      });
    });
    _defineProperty(this, "getState", () => {
      return this._editorState;
    });
    _defineProperty(this, "updateSchema", schema => {});
    this._editorState = _editorState;
    this._setState = setState;
  }

  // FS IRAD-989 2020-18-06
  // updating properties should automatically render the changes

  // FS IRAD-1040 2020-09-02
  // Send the modified schema to server
}
var _default = exports.default = SimpleConnector;