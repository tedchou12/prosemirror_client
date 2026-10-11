"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./czi-math-view.css");
var _CustomNodeView = _interopRequireWildcard(require("./CustomNodeView"));
var _MathInlineEditor = _interopRequireDefault(require("./MathInlineEditor"));
var React = _interopRequireWildcard(require("react"));
var _createPopUp = _interopRequireDefault(require("./createPopUp"));
var _classnames = _interopRequireDefault(require("classnames"));
var _renderLaTeXAsHTML = _interopRequireDefault(require("./renderLaTeXAsHTML"));
var _uuid = _interopRequireDefault(require("./uuid"));
var _prosemirrorView = require("prosemirror-view");
var _EditorFrameset = require("./EditorFrameset");
var _prosemirrorModel = require("prosemirror-model");
var _PopUpPosition = require("./PopUpPosition");
var _prosemirrorState = require("prosemirror-state");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
const EMPTY_SRC = 'data:image/gif;base64,' + 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
class MathViewBody extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "state", {
      isEditing: false
    });
    _defineProperty(this, "_inlineEditor", null);
    _defineProperty(this, "_id", (0, _uuid.default)());
    _defineProperty(this, "_mounted", false);
    _defineProperty(this, "_onEditStart", () => {
      this.setState({
        isEditing: true
      });
    });
    _defineProperty(this, "_onEditEnd", () => {
      this.setState({
        isEditing: false
      });
    });
    _defineProperty(this, "_onChange", value => {
      if (!this._mounted) {
        return;
      }
      const align = value ? value.align : null;
      const latex = value ? value.latex : null;
      const {
        getPos,
        node,
        editorView
      } = this.props;
      const pos = getPos();
      const attrs = _objectSpread(_objectSpread({}, node.attrs), {}, {
        latex,
        align
      });
      let tr = editorView.state.tr;
      const {
        selection
      } = editorView.state;
      tr = tr.setNodeMarkup(pos, null, attrs);
      // [FS] IRAD-1005 2020-07-23
      // Upgrade outdated packages.
      // reset selection to original using the latest doc.
      const origSelection = _prosemirrorState.NodeSelection.create(tr.doc, selection.from);
      tr = tr.setSelection(origSelection);
      editorView.dispatch(tr);
    });
  }
  componentDidMount() {
    this._mounted = true;
    this._renderInlineEditor();
  }
  componentWillUnmount() {
    this._mounted = false;
  }
  componentDidUpdate(prevProps) {
    this._renderInlineEditor();
  }
  render() {
    // TODO: Resolve `readOnly`;
    const readOnly = false;
    const {
      node,
      selected,
      focused
    } = this.props;
    const {
      attrs
    } = node;
    const {
      latex
    } = attrs;
    const {
      isEditing
    } = this.state;
    const active = (focused || isEditing) && !readOnly;
    const className = (0, _classnames.default)('czi-math-view-body', {
      active,
      selected
    });
    const html = (0, _renderLaTeXAsHTML.default)(latex);
    return /*#__PURE__*/React.createElement("span", {
      className: className,
      "data-active": active ? 'true' : null,
      "data-latex": latex || '',
      id: this._id,
      title: latex
    }, /*#__PURE__*/React.createElement("img", {
      alt: latex,
      className: "czi-math-view-body-img",
      src: EMPTY_SRC,
      title: latex
    }), /*#__PURE__*/React.createElement("span", {
      className: "czi-math-view-body-content",
      dangerouslySetInnerHTML: {
        __html: html
      }
    }));
  }
  _renderInlineEditor() {
    const el = document.getElementById(this._id);
    if (!el || el.getAttribute('data-active') !== 'true') {
      this._inlineEditor && this._inlineEditor.close();
      return;
    }
    const {
      node
    } = this.props;
    const editorProps = {
      value: node.attrs,
      onSelect: this._onChange,
      onEditStart: this._onEditStart,
      onEditEnd: this._onEditEnd
    };
    if (this._inlineEditor) {
      this._inlineEditor.update(editorProps);
    } else {
      this._inlineEditor = (0, _createPopUp.default)(_MathInlineEditor.default, editorProps, {
        anchor: el,
        autoDismiss: false,
        container: el.closest(`.${_EditorFrameset.FRAMESET_BODY_CLASSNAME}`),
        position: _PopUpPosition.atAnchorBottomCenter,
        onClose: () => {
          this._inlineEditor = null;
        }
      });
    }
  }
}
class MathNodeView extends _CustomNodeView.default {
  // @override
  createDOMElement() {
    const el = document.createElement('span');
    el.className = 'czi-math-view';
    this._updateDOM(el);
    return el;
  }

  // @override
  update(node, decorations) {
    super.update(node, decorations);
    this._updateDOM(this.dom);
    return true;
  }

  // @override
  renderReactComponent() {
    return /*#__PURE__*/React.createElement(MathViewBody, this.props);
  }
  _updateDOM(el) {
    const {
      align
    } = this.props.node.attrs;
    let className = 'czi-math-view';
    if (align) {
      className += ' align-' + align;
    }
    el.className = className;
  }
}
var _default = exports.default = MathNodeView;