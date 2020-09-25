"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_EditorState = exports.bpfrpt_proptype_EditorRuntime = exports.bpfrpt_proptype_ImageLike = exports.bpfrpt_proptype_RenderCommentProps = exports.bpfrpt_proptype_DirectEditorProps = exports.bpfrpt_proptype_EditorProps = exports.bpfrpt_proptype_MarkSpec = exports.bpfrpt_proptype_NodeSpec = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var bpfrpt_proptype_NodeSpec = {
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
exports.bpfrpt_proptype_NodeSpec = bpfrpt_proptype_NodeSpec;
var bpfrpt_proptype_MarkSpec = {
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
exports.bpfrpt_proptype_MarkSpec = bpfrpt_proptype_MarkSpec;
var bpfrpt_proptype_EditorProps = {};
exports.bpfrpt_proptype_EditorProps = bpfrpt_proptype_EditorProps;
var bpfrpt_proptype_DirectEditorProps = _propTypes.default.any;
exports.bpfrpt_proptype_DirectEditorProps = bpfrpt_proptype_DirectEditorProps;
var bpfrpt_proptype_RenderCommentProps = {
  "commentThreadId": _propTypes.default.string.isRequired,
  "isActive": _propTypes.default.bool.isRequired,
  "requestCommentThreadDeletion": _propTypes.default.func.isRequired,
  "requestCommentThreadReflow": _propTypes.default.func.isRequired
};
exports.bpfrpt_proptype_RenderCommentProps = bpfrpt_proptype_RenderCommentProps;
var bpfrpt_proptype_ImageLike = {
  "height": _propTypes.default.number.isRequired,
  "id": _propTypes.default.string.isRequired,
  "src": _propTypes.default.string.isRequired,
  "width": _propTypes.default.number.isRequired
};
exports.bpfrpt_proptype_ImageLike = bpfrpt_proptype_ImageLike;
var bpfrpt_proptype_EditorRuntime = {
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
exports.bpfrpt_proptype_EditorRuntime = bpfrpt_proptype_EditorRuntime;
var bpfrpt_proptype_EditorState = _propTypes.default.any;
exports.bpfrpt_proptype_EditorState = bpfrpt_proptype_EditorState;