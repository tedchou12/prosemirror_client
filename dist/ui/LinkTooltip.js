"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _smoothScrollIntoViewIfNeeded = _interopRequireDefault(require("smooth-scroll-into-view-if-needed"));
var _sanitizeURL = _interopRequireDefault(require("../sanitizeURL"));
var _CustomButton = _interopRequireDefault(require("./CustomButton"));
var _i18n = _interopRequireDefault(require("./i18n"));
require("./czi-link-tooltip.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function isBookMarkHref(href) {
  return !!href && href.indexOf('#') === 0 && href.length >= 2;
}
class LinkTooltip extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_unmounted", false);
    _defineProperty(this, "state", {
      hidden: false
    });
    _defineProperty(this, "_openLink", href => {
      if (isBookMarkHref(href)) {
        const id = href.substr(1);
        const el = document.getElementById(id);
        if (el) {
          const {
            onCancel,
            editorView
          } = this.props;
          onCancel(editorView);
          (async () => {
            // https://www.npmjs.com/package/smooth-scroll-into-view-if-needed
            await (0, _smoothScrollIntoViewIfNeeded.default)(el, {
              scrollMode: 'if-needed',
              // block: 'nearest',
              // inline: 'nearest',
              behavior: 'smooth'
            });
          })();
        }
        return;
      }
      if (href) {
        window.open((0, _sanitizeURL.default)(href));
      }
    });
  }
  render() {
    const {
      href,
      editorView,
      onEdit,
      onRemove
    } = this.props;
    // [FS] IRAD-1013 2020-07-09
    // Change button in "Apply Link" missing in LICIT.

    return /*#__PURE__*/React.createElement("div", {
      className: "czi-link-tooltip"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-link-tooltip-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-link-tooltip-row"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      className: "czi-link-tooltip-href",
      label: href,
      onClick: this._openLink,
      target: "new",
      title: href,
      value: href
    }), /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: (0, _i18n.default)('Change'),
      onClick: onEdit,
      value: editorView
    }), /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: (0, _i18n.default)('Remove'),
      onClick: onRemove,
      value: editorView
    }))));
  }
}
var _default = exports.default = LinkTooltip;