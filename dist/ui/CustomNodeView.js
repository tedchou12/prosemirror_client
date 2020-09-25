"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_NodeViewProps = exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _SelectionObserver = _interopRequireDefault(require("./SelectionObserver"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bpfrpt_proptype_NodeViewProps = {
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
exports.bpfrpt_proptype_NodeViewProps = bpfrpt_proptype_NodeViewProps;
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
} // Workaround to get in-selection views selected.
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
const mutationObserver = new MutationObserver(onMutation); // This implements the `NodeView` interface and renders a Node with a react
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
    pendingViews.add(this); // The editor will use this as the node's DOM representation

    const dom = this.createDOMElement();
    this.dom = dom;
    dom.onClick = this._onClick;

    if (pendingViews.size === 1) {
      // [FS] IRAD-1060 2020-09-10
      // Observe the editorview's dom insteadof root document so that 
      // if multiple instances of editor in a page shouldn't cross-talk
      mutationObserver.observe(
      /*document*/
      editorView.dom, {
        childList: true,
        subtree: true
      });
      selectionObserver.observe(
      /*document*/
      editorView.dom);
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
  } // Mark this node as being the selected node.


  selectNode() {
    this._selected = true;
    this.dom.classList.add(SELECTED_NODE_CLASS_NAME);

    this.__renderReactComponent();
  } // Remove selected node marking from this node.


  deselectNode() {
    this._selected = false;
    this.dom.classList.remove(SELECTED_NODE_CLASS_NAME);

    this.__renderReactComponent();
  } // This should be overwrite by subclass.


  createDOMElement() {
    // The editor will use this as the node's DOM representation.
    // return document.createElement('span');
    throw new Error('not implemented');
  } // This should be overwrite by subclass.


  renderReactComponent() {
    // return <CustomNodeViewComponent {...this.props} />;
    throw new Error('not implemented');
  }

  destroy() {// Called when the node view is removed from the editor or the whole
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

var _default = CustomNodeView;
exports.default = _default;