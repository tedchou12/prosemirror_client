"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bpfrpt_proptype_IsActiveCall = exports.bpfrpt_proptype_FindNodeTypeInSelectionCall = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
var bpfrpt_proptype_IsActiveCall = exports.bpfrpt_proptype_IsActiveCall = _propTypes.default.func;
var bpfrpt_proptype_FindNodeTypeInSelectionCall = exports.bpfrpt_proptype_FindNodeTypeInSelectionCall = _propTypes.default.func;
const EventType = {
  CLICK: 'mouseup',
  MOUSEENTER: 'mouseenter'
};
function dryRunEditorStateProxyGetter(state, propKey) {
  const val = state[propKey];
  if (propKey === 'tr' && val instanceof _prosemirrorTransform.Transform) {
    return val.setMeta('dryrun', true);
  }
  return val;
}
function dryRunEditorStateProxySetter(state, propKey, propValue) {
  state[propKey] = propValue;
  // Indicate success
  return true;
}
class UICommand {
  constructor() {
    _defineProperty(this, "shouldRespondToUIEvent", e => {
      return e.type === UICommand.EventType.CLICK;
    });
    _defineProperty(this, "renderLabel", state => {
      return null;
    });
    _defineProperty(this, "isActive", state => {
      return false;
    });
    _defineProperty(this, "isEnabled", (state, view) => {
      return this.dryRun(state, view);
    });
    _defineProperty(this, "dryRun", (state, view) => {
      const {
        Proxy
      } = window;
      const dryRunState = Proxy ? new Proxy(state, {
        get: dryRunEditorStateProxyGetter,
        set: dryRunEditorStateProxySetter
      }) : state;
      return this.execute(dryRunState, null, view);
    });
    _defineProperty(this, "execute", (state, dispatch, view, event) => {
      this.waitForUserInput(state, dispatch, view, event).then(inputs => {
        this.executeWithUserInput(state, dispatch, view, inputs);
      }).catch(error => {
        console.error(error);
      });
      return false;
    });
    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      return Promise.resolve(undefined);
    });
    _defineProperty(this, "executeWithUserInput", (state, dispatch, view, inputs) => {
      return false;
    });
  }
  cancel() {
    // subclass should overwrite this.
  }
}
_defineProperty(UICommand, "EventType", EventType);
var _default = exports.default = UICommand;