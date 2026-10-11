"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_RenderCommentProps = exports.bpfrpt_proptype_NodeSpec = exports.bpfrpt_proptype_MarkSpec = exports.bpfrpt_proptype_ImageLike = exports.bpfrpt_proptype_EditorState = exports.bpfrpt_proptype_EditorRuntime = exports.bpfrpt_proptype_EditorProps = exports.bpfrpt_proptype_DirectEditorProps = void 0;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
var bpfrpt_proptype_NodeSpec = exports.bpfrpt_proptype_NodeSpec = {
  "attrs": _propTypes.default.objectOf((props, propName, componentName) => {
    if (!Object.prototype.hasOwnProperty.call(props, propName)) {
      throw new Error(`Prop \`${propName}\` has type 'any' or 'mixed', but was not provided to \`${componentName}\`. Pass undefined or any other value.`);
    }
  }),
  "content": _propTypes.default.string,
  "draggable": _propTypes.default.bool,
  "group": _propTypes.default.string,
  "inline": _propTypes.default.bool,
  "name": _propTypes.default.string,
  "parseDOM": _propTypes.default.arrayOf((props, propName, componentName) => {
    if (!Object.prototype.hasOwnProperty.call(props, propName)) {
      throw new Error(`Prop \`${propName}\` has type 'any' or 'mixed', but was not provided to \`${componentName}\`. Pass undefined or any other value.`);
    }
  }),
  "toDOM": _propTypes.default.func
};
var bpfrpt_proptype_MarkSpec = exports.bpfrpt_proptype_MarkSpec = {
  "attrs": _propTypes.default.objectOf((props, propName, componentName) => {
    if (!Object.prototype.hasOwnProperty.call(props, propName)) {
      throw new Error(`Prop \`${propName}\` has type 'any' or 'mixed', but was not provided to \`${componentName}\`. Pass undefined or any other value.`);
    }
  }),
  "name": _propTypes.default.string,
  "parseDOM": _propTypes.default.arrayOf((props, propName, componentName) => {
    if (!Object.prototype.hasOwnProperty.call(props, propName)) {
      throw new Error(`Prop \`${propName}\` has type 'any' or 'mixed', but was not provided to \`${componentName}\`. Pass undefined or any other value.`);
    }
  }).isRequired,
  "toDOM": _propTypes.default.func.isRequired
};
var bpfrpt_proptype_EditorProps = exports.bpfrpt_proptype_EditorProps = {};
var bpfrpt_proptype_DirectEditorProps = exports.bpfrpt_proptype_DirectEditorProps = _propTypes.default.any;
var bpfrpt_proptype_RenderCommentProps = exports.bpfrpt_proptype_RenderCommentProps = {
  "commentThreadId": _propTypes.default.string.isRequired,
  "isActive": _propTypes.default.bool.isRequired,
  "requestCommentThreadDeletion": _propTypes.default.func.isRequired,
  "requestCommentThreadReflow": _propTypes.default.func.isRequired
};
var bpfrpt_proptype_ImageLike = exports.bpfrpt_proptype_ImageLike = {
  "height": _propTypes.default.number.isRequired,
  "id": _propTypes.default.string.isRequired,
  "src": _propTypes.default.string.isRequired,
  "width": _propTypes.default.number.isRequired
};
var bpfrpt_proptype_EditorRuntime = exports.bpfrpt_proptype_EditorRuntime = {
  // Image Proxy
  "canProxyImageSrc": _propTypes.default.func,
  "getProxyImageSrc": _propTypes.default.func,
  // Image Upload
  "canUploadImage": _propTypes.default.func,
  "uploadImage": _propTypes.default.func,
  // Comments
  "canComment": _propTypes.default.func,
  "createCommentThreadID": _propTypes.default.func,
  "renderComment": _propTypes.default.func,
  // External HTML
  "canLoadHTML": _propTypes.default.func,
  "loadHTML": _propTypes.default.func
};
var bpfrpt_proptype_EditorState = exports.bpfrpt_proptype_EditorState = _propTypes.default.any;