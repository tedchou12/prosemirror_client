"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bpfrpt_proptype_NodeViewProps = void 0;
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _SelectionObserver = _interopRequireDefault(require("./SelectionObserver"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); } // @xflow
var bpfrpt_proptype_NodeViewProps = exports.bpfrpt_proptype_NodeViewProps = {
  "editorView": function () {
    return (typeof _prosemirrorView.EditorView === "function" ? _propTypes.default.instanceOf(_prosemirrorView.EditorView).isRequired : _propTypes.default.any.isRequired).apply(this, arguments);
  },
  "getPos": _propTypes.default.func.isRequired,
  "node": function () {
    return (typeof _prosemirrorModel.Node === "function" ? _propTypes.default.instanceOf(_prosemirrorModel.Node).isRequired : _propTypes.default.any.isRequired).apply(this, arguments);
  },
  "selected": _propTypes.default.bool.isRequired,
  "focused": _propTypes.default.bool.isRequired
};
// Standard className for selected node.
const SELECTED_NODE_CLASS_NAME = 'ProseMirror-selectednode';
const mountedViews = new Set();
const pendingViews = new Set();
function onMutation(mutations, observer) {
  const root = document.body;
  if (!root) {
    return;
  }
  const mountingViews = [];
  for (const view of pendingViews) {
    const el = view.dom;
    if (root.contains(el)) {
      pendingViews.delete(view);
      mountingViews.push(view);
      view.__renderReactComponent();
    }
  }
  for (const view of mountedViews) {
    const el = view.dom;
    if (!root.contains(el)) {
      mountedViews.delete(el);
      _reactDom.default.unmountComponentAtNode(el);
    }
  }
  mountingViews.forEach(view => mountedViews.add(view));
  if (mountedViews.size === 0) {
    observer.disconnect();
  }
}

// Workaround to get in-selection views selected.
// See https://discuss.prosemirror.net/t/copy-selection-issue-with-the-image-node/1673/2;
function onSelection(entries, observer) {
  if (!window.getSelection) {
    console.warn('window.getSelection() is not supported');
    observer.disconnect();
    return;
  }
  const selection = window.getSelection();
  if (!selection.containsNode) {
    console.warn('selection.containsNode() is not supported');
    observer.disconnect();
    return;
  }
  for (const view of mountedViews) {
    const el = view.dom;
    if (selection.containsNode(el)) {
      view.selectNode();
    } else {
      view.deselectNode();
    }
  }
  if (mountedViews.size === 0) {
    observer.disconnect();
  }
}
const selectionObserver = new _SelectionObserver.default(onSelection);
const mutationObserver = new MutationObserver(onMutation);

// This implements the `NodeView` interface and renders a Node with a react
// Component.
// https://prosemirror.net/docs/ref/#view.NodeView
// https://github.com/ProseMirror/prosemirror-view/blob/master/src/viewdesc.js#L429
class CustomNodeView {
  constructor(node, editorView, getPos, decorations) {
    _defineProperty(this, "dom", void 0);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_selected", void 0);
    this.props = {
      decorations,
      editorView,
      getPos,
      node,
      selected: false,
      focused: false
    };
    pendingViews.add(this);

    // The editor will use this as the node's DOM representation
    const dom = this.createDOMElement();
    this.dom = dom;
    dom.onClick = this._onClick;
    if (pendingViews.size === 1) {
      // [FS] IRAD-1060 2020-09-10
      // Observe the editorview's dom insteadof root document so that 
      // if multiple instances of editor in a page shouldn't cross-talk
      mutationObserver.observe(/*document*/editorView.dom, {
        childList: true,
        subtree: true
      });
      selectionObserver.observe(/*document*/editorView.dom);
    }
  }
  update(node, decorations) {
    this.props = _objectSpread(_objectSpread({}, this.props), {}, {
      node
    });
    this.__renderReactComponent();
    return true;
  }
  stopEvent() {
    return false;
  }

  // Mark this node as being the selected node.
  selectNode() {
    this._selected = true;
    this.dom.classList.add(SELECTED_NODE_CLASS_NAME);
    this.__renderReactComponent();
  }

  // Remove selected node marking from this node.
  deselectNode() {
    this._selected = false;
    this.dom.classList.remove(SELECTED_NODE_CLASS_NAME);
    this.__renderReactComponent();
  }

  // This should be overwrite by subclass.
  createDOMElement() {
    // The editor will use this as the node's DOM representation.
    // return document.createElement('span');
    throw new Error('not implemented');
  }

  // This should be overwrite by subclass.
  renderReactComponent() {
    // return <CustomNodeViewComponent {...this.props} />;
    throw new Error('not implemented');
  }
  destroy() {
    // Called when the node view is removed from the editor or the whole
    // editor is destroyed.
    // sub-class may override this method.
  }
  __renderReactComponent() {
    const {
      editorView,
      getPos
    } = this.props;
    if (editorView.state && editorView.state.selection) {
      const {
        from
      } = editorView.state.selection;
      const pos = getPos();
      this.props.selected = this._selected;
      this.props.focused = editorView.focused && pos === from;
    } else {
      this.props.selected = false;
      this.props.focused = false;
    }
    _reactDom.default.render(this.renderReactComponent(), this.dom);
  }
}
var _default = exports.default = CustomNodeView;