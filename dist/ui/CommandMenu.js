"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _CustomMenu = _interopRequireDefault(require("./CustomMenu"));
var _CustomMenuItem = _interopRequireDefault(require("./CustomMenuItem"));
var _UICommand = _interopRequireDefault(require("./UICommand"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class CommandMenu extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_activeCommand", null);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_onUIEnter", (command, event) => {
      if (command.shouldRespondToUIEvent(event)) {
        this._activeCommand && this._activeCommand.cancel();
        this._activeCommand = command;
        this._execute(command, event);
      }
    });
    _defineProperty(this, "_execute", (command, e) => {
      const {
        dispatch,
        editorState,
        editorView,
        onCommand
      } = this.props;
      if (command.execute(editorState, dispatch, editorView, e)) {
        onCommand && onCommand();
      }
    });
  }
  render() {
    const {
      commandGroups,
      editorState,
      editorView
    } = this.props;
    const children = [];
    const jj = commandGroups.length - 1;
    commandGroups.forEach((group, ii) => {
      Object.keys(group).forEach(label => {
        const command = group[label];
        let disabled = true;
        try {
          disabled = !editorView || !command.isEnabled(editorState, editorView);
        } catch (ex) {
          disabled = false;
        }
        children.push(/*#__PURE__*/React.createElement(_CustomMenuItem.default, {
          active: command.isActive(editorState),
          disabled: disabled,
          key: label,
          label: command.renderLabel(editorState) || label,
          onClick: this._onUIEnter,
          onMouseEnter: this._onUIEnter,
          value: command
        }));
      });
      if (ii !== jj) {
        children.push(/*#__PURE__*/React.createElement(_CustomMenuItem.default.Separator, {
          key: `${String(ii)}-hr`
        }));
      }
    });
    return /*#__PURE__*/React.createElement(_CustomMenu.default, null, children);
  }
}
var _default = exports.default = CommandMenu;