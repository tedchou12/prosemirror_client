"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LAYOUT = exports.ATTRIBUTE_LAYOUT = void 0;
exports.getAttrs = getAttrs;
var _convertToCSSPTValue = _interopRequireDefault(require("./convertToCSSPTValue"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const LAYOUT = exports.LAYOUT = {
  DESKTOP_SCREEN_4_3: 'desktop_screen_4_3',
  DESKTOP_SCREEN_16_9: 'desktop_screen_16_9',
  US_LETTER_LANDSCAPE: 'us_letter_landscape',
  US_LETTER_PORTRAIT: 'us_letter_portrait',
  A4_LANDSCAPE: 'a4_landscape',
  A4_PORTRAIT: 'a4_portrait'
};
const ATTRIBUTE_LAYOUT = exports.ATTRIBUTE_LAYOUT = 'data-layout';
function getAttrs(el) {
  const attrs = {
    layout: null,
    width: null,
    padding: null
  };
  const {
    width,
    maxWidth,
    padding
  } = el.style || {};
  const ww = (0, _convertToCSSPTValue.default)(width) || (0, _convertToCSSPTValue.default)(maxWidth);
  const pp = (0, _convertToCSSPTValue.default)(padding);
  if (ww) {
    // 1pt = 1/72in
    // letter size: 8.5in x 11inch
    const ptWidth = ww + pp * 2;
    const inWidth = ptWidth / 72;
    const cmWidth = inWidth * 2.54;
    if (inWidth >= 10.9 && inWidth <= 11.1) {
      // Round up to letter size.
      attrs.layout = LAYOUT.US_LETTER_LANDSCAPE;
    } else if (inWidth >= 8.4 && inWidth <= 8.6) {
      // Round up to letter size.
      attrs.layout = LAYOUT.US_LETTER_PORTRAIT;
    } else if (cmWidth >= 29.5 && cmWidth <= 30.1) {
      attrs.layout = LAYOUT.A4_LANDSCAPE;
    } else if (cmWidth >= 20.5 && cmWidth <= 21.5) {
      attrs.layout = LAYOUT.A4_PORTRAIT;
    } else {
      attrs.width = ptWidth;
      if (pp) {
        attrs.padding = pp;
      }
    }
  }
  return attrs;
}
const DocNodeSpec = {
  attrs: {
    layout: {
      default: null
    },
    padding: {
      default: null
    },
    width: {
      default: null
    }
  },
  content: 'block+'
};
var _default = exports.default = DocNodeSpec;