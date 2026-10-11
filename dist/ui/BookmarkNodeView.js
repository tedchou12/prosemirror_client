"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _BookmarkNodeSpec = require("./../BookmarkNodeSpec");
var _CustomNodeView = _interopRequireWildcard(require("./CustomNodeView"));
var _Icon = _interopRequireDefault(require("./Icon"));
require("./czi-bookmark-view.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
class BookmarkViewBody extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "_onClick", e => {
      e.preventDefault();
      const {
        id
      } = this.props.node.attrs;
      const hash = '#' + id;
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      }
    });
  }
  render() {
    const {
      id,
      visible
    } = this.props.node.attrs;
    const icon = id && visible ? _Icon.default.get('bookmark') : null;
    return /*#__PURE__*/React.createElement("span", {
      onClick: this._onClick
    }, icon);
  }
}
class BookmarkNodeView extends _CustomNodeView.default {
  // @override
  createDOMElement() {
    const el = document.createElement('a');
    el.className = 'czi-bookmark-view';
    this._updateDOM(el);
    return el;
  }

  // @override
  update(node, decorations) {
    super.update(node, decorations);
    return true;
  }

  // @override
  renderReactComponent() {
    return /*#__PURE__*/React.createElement(BookmarkViewBody, this.props);
  }
  _updateDOM(el) {
    const {
      id,
      visible
    } = this.props.node.attrs;
    el.setAttribute('id', id);
    el.setAttribute('title', id);
    el.setAttribute(_BookmarkNodeSpec.ATTRIBUTE_BOOKMARK_ID, id);
    visible && el.setAttribute(_BookmarkNodeSpec.ATTRIBUTE_BOOKMARK_VISIBLE, 'true');
  }
}
var _default = exports.default = BookmarkNodeView;