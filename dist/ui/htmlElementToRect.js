"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = htmlElementToRect;
exports.bpfrpt_proptype_Rect = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bpfrpt_proptype_Rect = {
  "h": _propTypes.default.number.isRequired,
  "w": _propTypes.default.number.isRequired,
  "x": _propTypes.default.number.isRequired,
  "y": _propTypes.default.number.isRequired
};
exports.bpfrpt_proptype_Rect = bpfrpt_proptype_Rect;

function htmlElementToRect(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    w: rect.width,
    h: rect.height
  };
}