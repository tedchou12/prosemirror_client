"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_Rect = void 0;
exports.default = htmlElementToRect;
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var bpfrpt_proptype_Rect = exports.bpfrpt_proptype_Rect = {
  "h": _propTypes.default.number.isRequired,
  "w": _propTypes.default.number.isRequired,
  "x": _propTypes.default.number.isRequired,
  "y": _propTypes.default.number.isRequired
};
function htmlElementToRect(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    w: rect.width,
    h: rect.height
  };
}