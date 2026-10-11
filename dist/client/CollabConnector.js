"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorModel = require("prosemirror-model");
var _SimpleConnector = _interopRequireWildcard(require("./SimpleConnector"));
var _EditorConnection = _interopRequireDefault(require("./EditorConnection"));
var _reactDom = _interopRequireDefault(require("react-dom"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); } // import Reporter from './Reporter';
class CollabConnector extends _SimpleConnector.default {
  constructor(editorState, setState, config) {
    super(editorState, setState);
    _defineProperty(this, "_clientID", void 0);
    _defineProperty(this, "_connected", void 0);
    _defineProperty(this, "_connection", void 0);
    _defineProperty(this, "_docID", void 0);
    _defineProperty(this, "_stepKeys", void 0);
    _defineProperty(this, "_selection", void 0);
    _defineProperty(this, "onEdit", transaction => {
      if (!this._connection.ready) {
        // console.warn('not ready');
        return;
      }
      _reactDom.default.unstable_batchedUpdates(() => {
        this._connection.dispatch({
          type: 'transaction',
          transaction
        });
      });
    });
    _defineProperty(this, "updateSchema", schema => {
      // this._connection.updateSchema(schema);
      this._connection.ws_start();
    });
    const {
      ws_url,
      session_hash,
      user_id,
      docID
    } = config;

    // [FS][11-MAR-2020]
    // Modified the scripts to ensure not to always replace 3001 with 3002 to run both servers together,
    // instead used running hostname and configured port.
    // const url = window.location.protocol + '\/\/' +
    //   window.location.hostname + ':3002/docs/' +
    //   docID;
    this._connection = new _EditorConnection.default(setState, ws_url, session_hash, user_id, docID);
    this._connection.view = {
      updateState: s => {
        // console.log('update', s);
        //poll if selection changes
        // if (this._connection.ready) {
        //   if (this._selection != s.selection) {
        //     this._selection = s.selection;
        //     this._connection.cursor_send(s.selection);
        //   }
        // }
        setState({
          editorState: s
        }, () => {});
      }
    };
  }

  // FS IRAD-1040 2020-09-02
  // Send the modified schema to server
}
var _default = exports.default = CollabConnector;