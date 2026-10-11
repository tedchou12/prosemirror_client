"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classnames = _interopRequireDefault(require("classnames"));
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _CommandMenu = _interopRequireDefault(require("./CommandMenu"));
var _CustomButton = _interopRequireDefault(require("./CustomButton"));
var _UICommand = _interopRequireDefault(require("./UICommand"));
var _createPopUp = _interopRequireDefault(require("./createPopUp"));
var _uuid = _interopRequireDefault(require("./uuid"));
require("./czi-custom-menu-button.css");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class CommandMenuButton extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_menu", null);
    _defineProperty(this, "_id", (0, _uuid.default)());
    _defineProperty(this, "state", {
      expanded: false
    });
    _defineProperty(this, "_onClick", () => {
      const expanded = !this.state.expanded;
      this.setState({
        expanded
      });
      expanded ? this._showMenu() : this._hideMenu();
    });
    _defineProperty(this, "_hideMenu", () => {
      const menu = this._menu;
      this._menu = null;
      menu && menu.close();
    });
    _defineProperty(this, "_showMenu", () => {
      const menu = this._menu;
      const menuProps = _objectSpread(_objectSpread({}, this.props), {}, {
        onCommand: this._onCommand
      });
      if (menu) {
        menu.update(menuProps);
      } else {
        this._menu = (0, _createPopUp.default)(_CommandMenu.default, menuProps, {
          anchor: document.getElementById(this._id),
          onClose: this._onClose
        });
      }
    });
    _defineProperty(this, "_onCommand", () => {
      this.setState({
        expanded: false
      });
      this._hideMenu();
    });
    _defineProperty(this, "_onClose", () => {
      if (this._menu) {
        this.setState({
          expanded: false
        });
        this._menu = null;
      }
    });
  }
  render() {
    const {
      className,
      label,
      commandGroups,
      editorState,
      editorView,
      icon,
      disabled,
      title
    } = this.props;
    const enabled = !disabled && commandGroups.some((group, ii) => {
      return Object.keys(group).some(label => {
        const command = group[label];
        let disabledVal = true;
        try {
          disabledVal = !editorView || !command.isEnabled(editorState, editorView);
        } catch (ex) {
          disabledVal = false;
        }
        return !disabledVal;
      });
    });
    const {
      expanded
    } = this.state;
    const buttonClassName = (0, _classnames.default)(className, {
      'czi-custom-menu-button': true,
      expanded
    });
    return /*#__PURE__*/React.createElement(_CustomButton.default, {
      className: buttonClassName,
      disabled: !enabled,
      icon: icon,
      id: this._id,
      label: label,
      onClick: this._onClick,
      title: title
    });
  }
  componentWillUnmount() {
    this._hideMenu();
  }
}
var _default = exports.default = CommandMenuButton;