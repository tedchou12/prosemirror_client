"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CommandMenuButton = _interopRequireDefault(require("./CommandMenuButton"));
var _FontTypeCommand = _interopRequireDefault(require("../FontTypeCommand"));
var React = _interopRequireWildcard(require("react"));
var _findActiveFontType = _interopRequireWildcard(require("./findActiveFontType"));
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorView = require("prosemirror-view");
var _FontTypeMarkSpec = require("../FontTypeMarkSpec");
var _prosemirrorTransform = require("prosemirror-transform");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
const FONT_TYPE_COMMANDS = {
  [_findActiveFontType.FONT_TYPE_NAME_DEFAULT]: new _FontTypeCommand.default('')
};
_FontTypeMarkSpec.FONT_TYPE_NAMES.forEach(name => {
  FONT_TYPE_COMMANDS[name] = new _FontTypeCommand.default(name);
});
const COMMAND_GROUPS = [FONT_TYPE_COMMANDS];
class FontTypeCommandMenuButton extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
  }
  render() {
    const {
      dispatch,
      editorState,
      editorView
    } = this.props;
    const fontType = (0, _findActiveFontType.default)(editorState);
    return /*#__PURE__*/React.createElement(_CommandMenuButton.default, {
      className: "width-100"
      // [FS] IRAD-1008 2020-07-16
      // Disable font type menu on editor disable state
      ,
      disabled: editorView && editorView.disabled ? true : false,
      commandGroups: COMMAND_GROUPS,
      dispatch: dispatch,
      editorState: editorState,
      editorView: editorView,
      label: fontType
    });
  }
}
var _default = exports.default = FontTypeCommandMenuButton;