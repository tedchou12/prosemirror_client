"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FONT_PT_SIZES = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _FontSizeCommand = _interopRequireDefault(require("../FontSizeCommand"));
var _CommandMenuButton = _interopRequireDefault(require("./CommandMenuButton"));
var _findActiveFontSize = _interopRequireDefault(require("./findActiveFontSize"));
var _i18n = _interopRequireDefault(require("./i18n"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
const FONT_PT_SIZES = exports.FONT_PT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 90];
const FONT_PT_SIZE_COMMANDS = FONT_PT_SIZES.reduce((memo, size) => {
  memo[` ${size} `] = new _FontSizeCommand.default(size);
  return memo;
}, {});
const COMMAND_GROUPS = [{
  [(0, _i18n.default)('Default')]: new _FontSizeCommand.default(0)
}, FONT_PT_SIZE_COMMANDS];
class FontSizeCommandMenuButton extends React.PureComponent {
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
    const fontSize = (0, _findActiveFontSize.default)(editorState);
    const className = String(fontSize).length <= 2 ? 'width-30' : 'width-60';
    return /*#__PURE__*/React.createElement(_CommandMenuButton.default, {
      className: className
      // [FS] IRAD-1008 2020-07-16
      // Disable font size menu on editor disable state
      ,
      disabled: editorView && editorView.disabled ? true : false,
      commandGroups: COMMAND_GROUPS,
      dispatch: dispatch,
      editorState: editorState,
      editorView: editorView,
      label: fontSize
    });
  }
}
var _default = exports.default = FontSizeCommandMenuButton;