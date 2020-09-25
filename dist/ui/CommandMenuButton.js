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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var _default = CommandMenuButton;
exports.default = _default;