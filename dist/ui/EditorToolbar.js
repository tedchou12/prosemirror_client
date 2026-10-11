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
var _reactDom = _interopRequireDefault(require("react-dom"));
var _CommandButton = _interopRequireDefault(require("./CommandButton"));
var _CommandMenuButton = _interopRequireDefault(require("./CommandMenuButton"));
var _CustomButton = _interopRequireDefault(require("./CustomButton"));
var _EditorToolbarConfig = require("./EditorToolbarConfig");
var _Icon = _interopRequireDefault(require("./Icon"));
var _ResizeObserver = _interopRequireDefault(require("./ResizeObserver"));
var _UICommand = _interopRequireDefault(require("./UICommand"));
var _isReactClass = _interopRequireDefault(require("./isReactClass"));
require("./czi-editor-toolbar.css");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class EditorToolbar extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "_body", null);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "state", {
      expanded: false,
      wrapped: null
    });
    _defineProperty(this, "_renderButtonsGroup", (group, index) => {
      const buttons = Object.keys(group).map(label => {
        const obj = group[label];
        if ((0, _isReactClass.default)(obj)) {
          // JSX requies the component to be named with upper camel case.
          const ThatComponent = obj;
          const {
            editorState,
            editorView,
            dispatchTransaction
          } = this.props;
          return /*#__PURE__*/React.createElement(ThatComponent, {
            dispatch: dispatchTransaction,
            editorState: editorState,
            editorView: editorView,
            key: label
          });
        } else if (obj instanceof _UICommand.default) {
          return this._renderButton(label, obj);
        } else if (Array.isArray(obj)) {
          return this._renderMenuButton(label, obj);
        } else {
          return null;
        }
      }).filter(Boolean);
      return /*#__PURE__*/React.createElement("div", {
        className: "czi-custom-buttons",
        key: 'g' + String(index)
      }, buttons);
    });
    _defineProperty(this, "_renderMenuButton", (label, commandGroups) => {
      const {
        editorState,
        editorView,
        disabled,
        dispatchTransaction
      } = this.props;
      const {
        icon,
        title
      } = (0, _EditorToolbarConfig.parseLabel)(label);
      return /*#__PURE__*/React.createElement(_CommandMenuButton.default, {
        commandGroups: commandGroups,
        disabled: disabled,
        dispatch: dispatchTransaction,
        editorState: editorState,
        editorView: editorView,
        icon: icon,
        key: label,
        label: icon ? null : title,
        title: title
      });
    });
    _defineProperty(this, "_renderButton", (label, command) => {
      const {
        disabled,
        editorState,
        editorView,
        dispatchTransaction
      } = this.props;
      const {
        icon,
        title
      } = (0, _EditorToolbarConfig.parseLabel)(label);
      return /*#__PURE__*/React.createElement(_CommandButton.default, {
        command: command,
        disabled: disabled,
        dispatch: dispatchTransaction,
        editorState: editorState,
        editorView: editorView,
        icon: icon,
        key: label,
        label: icon ? null : title,
        title: title
      });
    });
    _defineProperty(this, "_onBodyRef", ref => {
      if (ref) {
        this._body = ref;
        // Mounting
        const el = _reactDom.default.findDOMNode(ref);
        if (el instanceof HTMLElement) {
          _ResizeObserver.default.observe(el, this._checkIfContentIsWrapped);
        }
      } else {
        // Unmounting.
        const el = this._body && _reactDom.default.findDOMNode(this._body);
        if (el instanceof HTMLElement) {
          _ResizeObserver.default.unobserve(el);
        }
        this._body = null;
      }
    });
    _defineProperty(this, "_checkIfContentIsWrapped", () => {
      const ref = this._body;
      const el = ref && _reactDom.default.findDOMNode(ref);
      const startAnchor = el && el.firstChild;
      const endAnchor = el && el.lastChild;
      if (startAnchor && endAnchor) {
        const wrapped = startAnchor.offsetTop < endAnchor.offsetTop;
        this.setState({
          wrapped
        });
      }
    });
    _defineProperty(this, "_toggleExpansion", expanded => {
      this.setState({
        expanded: !expanded
      });
    });
  }
  render() {
    const {
      wrapped,
      expanded
    } = this.state;
    const className = (0, _classnames.default)('czi-editor-toolbar', {
      expanded,
      wrapped
    });
    const wrappedButton = wrapped ? /*#__PURE__*/React.createElement(_CustomButton.default, {
      active: expanded,
      className: "czi-editor-toolbar-expand-button",
      icon: _Icon.default.get('more_horiz'),
      key: "expand",
      onClick: this._toggleExpansion,
      title: "More",
      value: expanded
    }) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: className
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-toolbar-flex"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-toolbar-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-toolbar-body-content",
      ref: this._onBodyRef
    }, /*#__PURE__*/React.createElement("i", {
      className: "czi-editor-toolbar-wrapped-anchor"
    }), _EditorToolbarConfig.COMMAND_GROUPS.map(this._renderButtonsGroup), /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-toolbar-background"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-toolbar-background-line"
    }), /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-toolbar-background-line"
    }), /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-toolbar-background-line"
    }), /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-toolbar-background-line"
    }), /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-toolbar-background-line"
    })), /*#__PURE__*/React.createElement("i", {
      className: "czi-editor-toolbar-wrapped-anchor"
    })), wrappedButton), /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-toolbar-footer"
    })));
  }
}
var _default = exports.default = EditorToolbar;