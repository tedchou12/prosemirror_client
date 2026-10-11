"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _createEmptyEditorState = _interopRequireDefault(require("../createEmptyEditorState"));
var _Editor = _interopRequireWildcard(require("./Editor"));
var _EditorFrameset = _interopRequireWildcard(require("./EditorFrameset"));
var _EditorToolbar = _interopRequireDefault(require("./EditorToolbar"));
var _Frag = _interopRequireDefault(require("./Frag"));
var _uuid = _interopRequireDefault(require("./uuid"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
const EMPTY_EDITOR_RUNTIME = {};
class RichTextEditor extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "state", void 0);
    _defineProperty(this, "_id", void 0);
    _defineProperty(this, "_dispatchTransaction", tr => {
      const {
        onChange,
        editorState,
        readOnly
      } = this.props;
      if (readOnly === true) {
        return;
      }
      if (onChange) {
        // [FS-AFQ][20-FEB-2020]
        // Collaboration
        onChange({
          state: editorState || _Editor.default.EDITOR_EMPTY_STATE,
          transaction: tr
        });
      }
    });
    _defineProperty(this, "_onReady", editorView => {
      if (editorView !== this.state.editorView) {
        this.setState({
          editorView
        });
        const {
          onReady
        } = this.props;
        onReady && onReady(editorView);
      }
    });
    this._id = (0, _uuid.default)();
    this.state = {
      contentHeight: NaN,
      contentOverflowHidden: false,
      editorView: null
    };
  }
  render() {
    const {
      autoFocus,
      children,
      className,
      disabled,
      embedded,
      header,
      height,
      onChange,
      nodeViews,
      placeholder,
      readOnly,
      width
    } = this.props;
    let {
      editorState,
      runtime
    } = this.props;
    editorState = editorState || (0, _createEmptyEditorState.default)();
    runtime = runtime || EMPTY_EDITOR_RUNTIME;
    const {
      editorView
    } = this.state;
    const toolbar = !!readOnly === true ? null : /*#__PURE__*/React.createElement(_EditorToolbar.default, {
      disabled: disabled,
      dispatchTransaction: this._dispatchTransaction,
      editorState: editorState || _Editor.default.EDITOR_EMPTY_STATE,
      editorView: editorView,
      readOnly: readOnly
    });
    const body = /*#__PURE__*/React.createElement(_Frag.default, null, /*#__PURE__*/React.createElement(_Editor.default, {
      autoFocus: autoFocus,
      disabled: disabled,
      dispatchTransaction: this._dispatchTransaction,
      editorState: editorState,
      embedded: embedded,
      id: this._id,
      nodeViews: nodeViews,
      onChange: onChange,
      onReady: this._onReady,
      placeholder: placeholder,
      readOnly: readOnly,
      runtime: runtime
    }), children);
    return /*#__PURE__*/React.createElement(_EditorFrameset.default, {
      body: body,
      className: className,
      embedded: embedded,
      header: header,
      height: height,
      toolbar: toolbar,
      width: width
    });
  }
}
var _default = exports.default = RichTextEditor;