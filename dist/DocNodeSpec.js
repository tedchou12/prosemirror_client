"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAttrs = getAttrs;
exports.default = exports.ATTRIBUTE_LAYOUT = exports.LAYOUT = void 0;

var _convertToCSSPTValue = _interopRequireDefault(require("./convertToCSSPTValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LAYOUT = {
  DESKTOP_SCREEN_4_3: 'desktop_screen_4_3',
  DESKTOP_SCREEN_16_9: 'desktop_screen_16_9',
  US_LETTER_LANDSCAPE: 'us_letter_landscape',
  US_LETTER_PORTRAIT: 'us_letter_portrait'
};
exports.LAYOUT = LAYOUT;
const ATTRIBUTE_LAYOUT = 'data-layout';
exports.ATTRIBUTE_LAYOUT = ATTRIBUTE_LAYOUT;

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

    if (inWidth >= 11 && inWidth <= 11.5) {
      // Round up to letter size.
      attrs.layout = LAYOUT.US_LETTER_LANDSCAPE;
    } else if (inWidth >= 7 && inWidth <= 9) {
      // Round up to letter size.
      attrs.layout = LAYOUT.US_LETTER_PORTRAIT;
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
var _default = DocNodeSpec;
exports.default = _default;