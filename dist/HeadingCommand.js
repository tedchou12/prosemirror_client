"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorUtils = require("prosemirror-utils");
var _prosemirrorView = require("prosemirror-view");
var _NodeNames = require("./NodeNames");
var _noop = _interopRequireDefault(require("./noop"));
var _toggleHeading = _interopRequireDefault(require("./toggleHeading"));
var _UICommand = _interopRequireDefault(require("./ui/UICommand"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class HeadingCommand extends _UICommand.default {
  constructor(level) {
    super();
    _defineProperty(this, "_level", void 0);
    _defineProperty(this, "isActive", state => {
      const result = this._findHeading(state);
      return !!(result && result.node && result.node.attrs && result.node.attrs.level === this._level);
    });
    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = (0, _toggleHeading.default)(state.tr.setSelection(selection), schema, this._level);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });
    this._level = level;
  }
  _findHeading(state) {
    const heading = state.schema.nodes[_NodeNames.HEADING];
    const fn = heading ? (0, _prosemirrorUtils.findParentNodeOfType)(heading) : _noop.default;
    return fn(state.selection);
  }
}
var _default = exports.default = HeadingCommand;