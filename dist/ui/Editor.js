"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_EditorProps = exports.default = exports.DEFAULT_NODE_VIEWS = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _webfontloader = _interopRequireDefault(require("webfontloader"));

require("prosemirror-gapcursor/style/gapcursor.css");

require("prosemirror-view/style/prosemirror.css");

var _CZIProseMirror = require("../CZIProseMirror");

var _NodeNames = require("../NodeNames");

var _WebFontLoader = _interopRequireDefault(require("../WebFontLoader"));

var _FontTypeMarkSpec = require("../FontTypeMarkSpec");

var _createEmptyEditorState = _interopRequireDefault(require("../createEmptyEditorState"));

var _normalizeHTML = _interopRequireDefault(require("../normalizeHTML"));

var _BookmarkNodeView = _interopRequireDefault(require("./BookmarkNodeView"));

var _CustomEditorView = _interopRequireDefault(require("./CustomEditorView"));

var _CustomNodeView = _interopRequireDefault(require("./CustomNodeView"));

var _ImageNodeView = _interopRequireDefault(require("./ImageNodeView"));

var _ListItemNodeView = _interopRequireDefault(require("./ListItemNodeView"));

var _MathNodeView = _interopRequireDefault(require("./MathNodeView"));

var _handleEditorDrop = _interopRequireDefault(require("./handleEditorDrop"));

var _handleEditorKeyDown = _interopRequireDefault(require("./handleEditorKeyDown"));

var _handleEditorPaste = _interopRequireDefault(require("./handleEditorPaste"));

var _uuid = _interopRequireDefault(require("./uuid"));

require("./czi-editor.css");

require("./fonts.css");

var _Types = require("../Types");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bpfrpt_proptype_EditorProps = {
  "autoFocus": _propTypes.default.bool,
  "disabled": _propTypes.default.bool,
  "dispatchTransaction": _propTypes.default.func,
  "editorState": function () {
    return (typeof _prosemirrorState.EditorState === "function" ? _propTypes.default.instanceOf(_prosemirrorState.EditorState) : _propTypes.default.any).apply(this, arguments);
  },
  "embedded": _propTypes.default.bool,
  "fitToContent": _propTypes.default.bool,
  "onBlur": _propTypes.default.func,
  "onChange": _propTypes.default.func,
  "onReady": _propTypes.default.func,
  // Mapping for custom node views.
  "nodeViews": _propTypes.default.objectOf(function () {
    return (typeof _CustomNodeView.default === "function" ? _propTypes.default.instanceOf(_CustomNodeView.default).isRequired : _propTypes.default.any.isRequired).apply(this, arguments);
  }),
  "placeholder": _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.node]),
  "readOnly": _propTypes.default.bool,
  "runtime": function () {
    return (typeof _Types.bpfrpt_proptype_EditorRuntime === "function" ? _Types.bpfrpt_proptype_EditorRuntime : _propTypes.default.shape(_Types.bpfrpt_proptype_EditorRuntime)).apply(this, arguments);
  },
  "transformPastedHTML": _propTypes.default.func
};
exports.bpfrpt_proptype_EditorProps = bpfrpt_proptype_EditorProps;
// Export utilities for debugging.
window.CZIProseMirror = {
  exportJSON: _CZIProseMirror.exportJSON,
  registeryKeys: _CZIProseMirror.registeryKeys
};
const AUTO_FOCUS_DELAY = 350; // Default custom node views.

const DEFAULT_NODE_VIEWS = Object.freeze({
  [_NodeNames.IMAGE]: _ImageNodeView.default,
  [_NodeNames.MATH]: _MathNodeView.default,
  [_NodeNames.BOOKMARK]: _BookmarkNodeView.default,
  [_NodeNames.LIST_ITEM]: _ListItemNodeView.default
});
exports.DEFAULT_NODE_VIEWS = DEFAULT_NODE_VIEWS;
const EDITOR_EMPTY_STATE = Object.freeze((0, _createEmptyEditorState.default)()); // Monkey patch the `scrollIntoView` mathod of 'Transaction'.
// Why this is necessary?
// It appears that promse-mirror does call `scrollIntoView` extensively
// from many of the built-in transformations, thus cause unwanted page
// scrolls. To make the behavior more manageable, this patched method asks
// developer to explicitly use `scrollIntoView(true)` to enforce page scroll.

const scrollIntoView = _prosemirrorState.Transaction.prototype.scrollIntoView;

const scrollIntoViewPatched = function (forced) {
  if (forced === true && scrollIntoView) {
    return scrollIntoView.call(this);
  } else {
    return this;
  }
};

_prosemirrorState.Transaction.prototype.scrollIntoView = scrollIntoViewPatched; // Sets the implementation so that `FontTypeMarkSpec` can load custom fonts.

_WebFontLoader.default.setImplementation(_webfontloader.default); // FS IRAD-988 2020-06-18


(0, _FontTypeMarkSpec.preLoadFonts)();
const handleDOMEvents = {
  drop: _handleEditorDrop.default,
  keydown: _handleEditorKeyDown.default,
  paste: _handleEditorPaste.default
};

function bindNodeView(NodeView) {
  return (node, view, getPos, decorations) => {
    return new NodeView(node, view, getPos, decorations);
  };
}

function getSchema(editorState) {
  return editorState ? editorState.schema : EDITOR_EMPTY_STATE.schema;
}

class Editor extends React.PureComponent {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_autoFocusTimer", 0);

    _defineProperty(this, "_id", (0, _uuid.default)());

    _defineProperty(this, "_editorView", null);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "state", {
      isPrinting: false
    });

    _defineProperty(this, "_onBlur", () => {
      const {
        onBlur
      } = this.props;
      const view = this._editorView;

      if (view && !view.disabled && !view.readOnly && onBlur) {
        onBlur();
      }
    });

    _defineProperty(this, "focus", () => {
      const view = this._editorView;

      if (view && !view.disabled && !view.readOnly) {
        view.focus();
      }
    });

    _defineProperty(this, "_dispatchTransaction", transaction => {
      const {
        editorState,
        readOnly,
        onChange
      } = this.props;

      if (readOnly === true || !onChange) {
        return;
      }

      onChange({
        transaction,
        state: editorState || EDITOR_EMPTY_STATE
      });
    });

    _defineProperty(this, "_isEditable", () => {
      const {
        disabled,
        readOnly
      } = this.props;
      const {
        isPrinting
      } = this.state;
      return !isPrinting && !!this._editorView && !readOnly && !disabled;
    });

    _defineProperty(this, "_onPrintStart", () => {
      this.setState({
        isPrinting: true
      });
    });

    _defineProperty(this, "_onPrintEnd", () => {
      this.setState({
        isPrinting: false
      });
    });
  }

  componentDidMount() {
    const {
      onReady,
      editorState,
      readOnly,
      runtime,
      placeholder,
      disabled,
      dispatchTransaction,
      nodeViews,
      transformPastedHTML
    } = this.props;
    const editorNode = document.getElementById(this._id);

    if (editorNode) {
      const effectiveNodeViews = Object.assign({}, DEFAULT_NODE_VIEWS, nodeViews);
      const boundNodeViews = {};
      const schema = getSchema(editorState);
      const {
        nodes
      } = schema;
      Object.keys(effectiveNodeViews).forEach(nodeName => {
        const nodeView = effectiveNodeViews[nodeName]; // Only valid and supported node views should be used.

        if (nodes[nodeName]) {
          boundNodeViews[nodeName] = bindNodeView(nodeView);
        }
      }); // Reference: http://prosemirror.net/examples/basic/

      const view = this._editorView = new _CustomEditorView.default(editorNode, {
        clipboardSerializer: _prosemirrorModel.DOMSerializer.fromSchema(schema),
        dispatchTransaction,
        editable: this._isEditable,
        nodeViews: boundNodeViews,
        state: editorState || EDITOR_EMPTY_STATE,
        transformPastedHTML,
        handleDOMEvents
      });
      view.runtime = runtime;
      view.placeholder = placeholder;
      view.readOnly = !!readOnly;
      view.disabled = !!disabled;
      view.updateState(editorState || EDITOR_EMPTY_STATE); // Expose the view to CZIProseMirror so developer could debug it.

      (0, _CZIProseMirror.registerEditorView)(this._id, view);
      onReady && onReady(view);
      this._autoFocusTimer && clearTimeout(this._autoFocusTimer);
      this._autoFocusTimer = this.props.autoFocus ? setTimeout(this.focus, AUTO_FOCUS_DELAY) : 0;
    }

    window.addEventListener('beforeprint', this._onPrintStart, false);
    window.addEventListener('afterprint', this._onPrintEnd, false);
  }

  componentDidUpdate(prevProps) {
    const view = this._editorView;

    if (view) {
      const prevSchema = getSchema(prevProps.editorState);
      const currSchema = getSchema(this.props.editorState);

      if (prevSchema !== currSchema) {
        // schema should never change.
        // TODO: re-create the editor view if schema changed.
        console.error('editor schema changed.');
      }

      const {
        runtime,
        editorState,
        placeholder,
        readOnly,
        disabled
      } = this.props;
      const {
        isPrinting
      } = this.state;
      const state = editorState || EDITOR_EMPTY_STATE;
      view.runtime = runtime;
      view.placeholder = placeholder;
      view.readOnly = !!readOnly || isPrinting;
      view.disabled = !!disabled;
      view.updateState(state);
      this._autoFocusTimer && clearTimeout(this._autoFocusTimer);
      this._autoFocusTimer = !prevProps.autoFocus && this.props.autoFocus ? setTimeout(this.focus, AUTO_FOCUS_DELAY) : 0;
    }
  }

  componentWillUnmount() {
    this._autoFocusTimer && clearTimeout(this._autoFocusTimer);
    this._editorView && this._editorView.destroy();
    this._editorView = null;
    (0, _CZIProseMirror.releaseEditorView)(this._id);
    window.removeEventListener('beforeprint', this._onPrintStart, false);
    window.removeEventListener('afterprint', this._onPrintEnd, false);
  }

  render() {
    const {
      embedded,
      fitToContent,
      readOnly
    } = this.props;
    let className = ''; //  FS IRAD-1040 2020-17-09
    //  wrapping style for fit to content mode

    if (fitToContent) {
      className = (0, _classnames.default)('prosemirror-editor-wrapper', {
        fitToContent,
        readOnly
      });
    } else {
      className = (0, _classnames.default)('prosemirror-editor-wrapper', {
        embedded,
        readOnly
      });
    }

    return /*#__PURE__*/React.createElement("div", {
      className: className,
      "data-czi-prosemirror-editor-id": this._id,
      id: this._id,
      onBlur: this._onBlur
    });
  }

}

_defineProperty(Editor, "EDITOR_EMPTY_STATE", EDITOR_EMPTY_STATE);

_defineProperty(Editor, "defaultProps", {
  transformPastedHTML: _normalizeHTML.default
});

var _default = Editor;
exports.default = _default;