"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorView = require("prosemirror-view");
var React = _interopRequireWildcard(require("react"));
var _findActionableCell = _interopRequireDefault(require("./findActionableCell"));
var _PopUpPosition = require("./ui/PopUpPosition");
var _TableCellMenu = _interopRequireDefault(require("./ui/TableCellMenu"));
var _bindScrollHandler = _interopRequireDefault(require("./ui/bindScrollHandler"));
var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));
var _isElementFullyVisible = _interopRequireDefault(require("./ui/isElementFullyVisible"));
require("./ui/czi-pop-up.css");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); } /* eslint-disable-next-line */
class TableCellTooltipView {
  constructor(editorView) {
    _defineProperty(this, "_cellElement", void 0);
    _defineProperty(this, "_popUp", null);
    _defineProperty(this, "_scrollHandle", null);
    _defineProperty(this, "destroy", () => {
      this._popUp && this._popUp.close();
      this._popUp = null;
    });
    _defineProperty(this, "_onOpen", () => {
      const cellEl = this._cellElement;
      if (!cellEl) {
        return;
      }
      this._scrollHandle = (0, _bindScrollHandler.default)(cellEl, this._onScroll);
    });
    _defineProperty(this, "_onClose", () => {
      this._popUp = null;
      this._scrollHandle && this._scrollHandle.dispose();
      this._scrollHandle = null;
    });
    _defineProperty(this, "_onScroll", () => {
      const popUp = this._popUp;
      const cellEl = this._cellElement;
      if (!popUp || !cellEl) {
        return;
      }
      if (!(0, _isElementFullyVisible.default)(cellEl)) {
        popUp.close();
      }
    });
    this.update(editorView, null);
  }
  update(view, lastState) {
    const {
      state,
      readOnly
    } = view;
    const result = (0, _findActionableCell.default)(state);
    if (!result || readOnly) {
      this.destroy();
      return;
    }

    // These is screen coordinate.
    const domFound = view.domAtPos(result.pos + 1);
    if (!domFound) {
      this.destroy();
      return;
    }
    let cellEl = domFound.node;
    const popUp = this._popUp;
    const viewPops = {
      editorState: state,
      editorView: view
    };
    if (cellEl && !(0, _isElementFullyVisible.default)(cellEl)) {
      cellEl = null;
    }
    if (!cellEl) {
      // Closes the popup.
      popUp && popUp.close();
      this._cellElement = null;
    } else if (popUp && cellEl === this._cellElement) {
      // Updates the popup.
      popUp.update(viewPops);
    } else {
      // Creates a new popup.
      popUp && popUp.close();
      this._cellElement = cellEl;
      // [FS] IRAD-1009 2020-07-16
      // Does not allow Table Menu Popuup button in disable mode
      if (!view.disabled) {
        this._popUp = (0, _createPopUp.default)(_TableCellMenu.default, viewPops, {
          anchor: cellEl,
          autoDismiss: false,
          onClose: this._onClose,
          position: _PopUpPosition.atAnchorTopRight
        });
        this._onOpen();
      }
    }
  }
}

// https://prosemirror.net/examples/tooltip/
const SPEC = {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  key: new _prosemirrorState.PluginKey('TableCellMenuPlugin'),
  view(editorView) {
    return new TableCellTooltipView(editorView);
  }
};
class TableCellMenuPlugin extends _prosemirrorState.Plugin {
  constructor() {
    super(SPEC);
  }
}
var _default = exports.default = TableCellMenuPlugin;