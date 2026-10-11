"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classnames = _interopRequireDefault(require("classnames"));
var React = _interopRequireWildcard(require("react"));
var _canUseCSSFont = _interopRequireDefault(require("./canUseCSSFont"));
require("./czi-icon.css");
require("./icon-font.css");
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); } // [FS] IRAD-1061 2020-09-19
// Now loaded locally, so that it work in closed network as well.
//import injectStyleSheet from './injectStyleSheet';
const VALID_CHARS = /[a-z_]+/;
const cached = {};
const CSS_CDN_URL = '//fonts.googleapis.com/icon?family=Material+Icons';
const CSS_FONT = 'Material Icons';
(async function () {
  // Inject CSS Fonts reuqired for toolbar icons.
  const fontSupported = await (0, _canUseCSSFont.default)(CSS_FONT);
  if (!fontSupported) {
    console.info('Add CSS from ', CSS_CDN_URL);
    // [FS] IRAD-1061 2020-09-19
    // Now loaded locally, so that it work in closed network as well.
    //injectStyleSheet(CSS_CDN_URL);
  }
})();
class SuperscriptIcon extends React.PureComponent {
  render() {
    return /*#__PURE__*/React.createElement("span", {
      className: "superscript-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "superscript-base"
    }, "x"), /*#__PURE__*/React.createElement("span", {
      className: "superscript-top"
    }, "y"));
  }
}
class SubscriptIcon extends React.PureComponent {
  render() {
    return /*#__PURE__*/React.createElement("span", {
      className: "subscript-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "subscript-base"
    }, "x"), /*#__PURE__*/React.createElement("span", {
      className: "subscript-bottom"
    }, "y"));
  }
}
class Icon extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
  }
  // Get the static Icon.
  static get(type, title) {
    const key = `${type || ''}-${title || ''}`;
    const icon = cached[key] || /*#__PURE__*/React.createElement(Icon, {
      title: title,
      type: type
    });
    cached[key] = icon;
    return icon;
  }
  render() {
    const {
      type,
      title
    } = this.props;
    let className = '';
    let children = '';
    if (type == 'superscript') {
      className = (0, _classnames.default)('czi-icon', {
        [type]: true
      });
      children = /*#__PURE__*/React.createElement(SuperscriptIcon, null);
    } else if (type == 'subscript') {
      className = (0, _classnames.default)('czi-icon', {
        [type]: true
      });
      children = /*#__PURE__*/React.createElement(SubscriptIcon, null);
    } else if (!type || !VALID_CHARS.test(type)) {
      className = (0, _classnames.default)('czi-icon-unknown');
      children = title || type;
    } else {
      className = (0, _classnames.default)('czi-icon', {
        [type]: true
      });
      children = type;
    }
    return /*#__PURE__*/React.createElement("span", {
      className: className
    }, children);
  }
}
var _default = exports.default = Icon;