"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nullthrows = _interopRequireDefault(require("nullthrows"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _insertTable = _interopRequireDefault(require("./insertTable"));

var _PopUpPosition = require("./ui/PopUpPosition");

var _TableGridSizeEditor = _interopRequireWildcard(require("./ui/TableGridSizeEditor"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TableInsertCommand extends _UICommand.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "shouldRespondToUIEvent", e => {
      return e.type === _UICommand.default.EventType.MOUSEENTER;
    });

    _defineProperty(this, "isEnabled", state => {
      const tr = state;
      let bOK = false;
      const {
        selection
      } = tr;

      if (selection instanceof _prosemirrorState.TextSelection) {
        bOK = selection.from === selection.to; // [FS] IRAD-1065 2020-09-18
        // Disable create table menu if the selection is inside a table.

        if (bOK) {
          let $head = selection.$head;

          for (let d = $head.depth; d > 0; d--) {
            if ($head.node(d).type.spec.tableRole == "row") {
              return false;
            }
          }
        }

        return bOK;
      }

      return bOK;
    });

    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      if (this._popUp) {
        return Promise.resolve(undefined);
      }

      const target = (0, _nullthrows.default)(event).currentTarget;

      if (!(target instanceof HTMLElement)) {
        return Promise.resolve(undefined);
      }

      const anchor = event ? event.currentTarget : null;
      return new Promise(resolve => {
        this._popUp = (0, _createPopUp.default)(_TableGridSizeEditor.default, null, {
          anchor,
          position: _PopUpPosition.atAnchorRight,
          onClose: val => {
            if (this._popUp) {
              this._popUp = null;
              resolve(val);
            }
          }
        });
      });
    });

    _defineProperty(this, "executeWithUserInput", (state, dispatch, view, inputs) => {
      if (dispatch) {
        const {
          selection,
          schema
        } = state;
        let {
          tr
        } = state;

        if (inputs) {
          const {
            rows,
            cols
          } = inputs;
          tr = tr.setSelection(selection);
          tr = (0, _insertTable.default)(tr, schema, rows, cols);
        }

        dispatch(tr);
      }

      return false;
    });
  }

}

var _default = TableInsertCommand;
exports.default = _default;