"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_EditorFramesetProps = exports.default = exports.FRAMESET_BODY_CLASSNAME = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

require("./czi-editor-frameset.css");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bpfrpt_proptype_EditorFramesetProps = {
  "body": _propTypes.default.node,
  "className": _propTypes.default.string,
  "embedded": _propTypes.default.bool,
  "fitToContent": _propTypes.default.bool,
  "header": _propTypes.default.node,
  "height": _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  "toolbarPlacement": _propTypes.default.oneOf(["header", "body"]),
  "toolbar": _propTypes.default.node,
  "width": _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
};
exports.bpfrpt_proptype_EditorFramesetProps = bpfrpt_proptype_EditorFramesetProps;
const FRAMESET_BODY_CLASSNAME = 'czi-editor-frame-body';
exports.FRAMESET_BODY_CLASSNAME = FRAMESET_BODY_CLASSNAME;

function toCSS(val) {
  if (typeof val === 'number') {
    return val + 'px';
  }

  if (val === undefined || val === null) {
    return 'auto';
  }

  return String(val);
}

class EditorFrameset extends React.PureComponent {
  constructor() {
    super(...arguments);

    _defineProperty(this, "props", void 0);
  }

  render() {
    const {
      body,
      className,
      embedded,
      header,
      height,
      toolbarPlacement,
      toolbar,
      width,
      fitToContent
    } = this.props;
    const useFixedLayout = width !== undefined || height !== undefined;
    let mainClassName = ''; //  FS IRAD-1040 2020-17-09
    //  wrapping style for fit to content mode

    if (fitToContent) {
      mainClassName = (0, _classnames.default)(className, {
        'czi-editor-frameset': true,
        'with-fixed-layout': useFixedLayout,
        fitToContent: fitToContent
      });
    } else {
      mainClassName = (0, _classnames.default)(className, {
        'czi-editor-frameset': true,
        'with-fixed-layout': useFixedLayout,
        embedded: embedded
      });
    }

    const mainStyle = {
      width: toCSS(width === undefined && useFixedLayout ? 'auto' : width),
      height: toCSS(height === undefined && useFixedLayout ? 'auto' : height)
    };
    const toolbarHeader = toolbarPlacement === 'header' || !toolbarPlacement ? toolbar : null;
    const toolbarBody = toolbarPlacement === 'body' && toolbar;
    return /*#__PURE__*/React.createElement("div", {
      className: mainClassName,
      style: mainStyle
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-head"
    }, header, toolbarHeader), /*#__PURE__*/React.createElement("div", {
      className: FRAMESET_BODY_CLASSNAME
    }, toolbarBody, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-body-scroll"
    }, body)), /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-footer"
    })));
  }

}

var _default = EditorFrameset;
exports.default = _default;