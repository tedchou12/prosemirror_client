"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _SetDocAttrStep = _interopRequireDefault(require("./SetDocAttrStep"));

var _DocLayoutEditor = _interopRequireWildcard(require("./ui/DocLayoutEditor"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function setDocLayout(tr, schema, width, layout) {
  const {
    doc
  } = tr;

  if (!doc) {
    return tr;
  }

  tr = tr.step(new _SetDocAttrStep.default('width', width || null));
  tr = tr.step(new _SetDocAttrStep.default('layout', layout || null));
  return tr;
}

class DocLayoutCommand extends _UICommand.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "isEnabled", state => {
      return true;
    });

    _defineProperty(this, "isActive", state => {
      return !!this._popUp;
    });

    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      if (this._popUp) {
        return Promise.resolve(undefined);
      }

      const {
        doc
      } = state;
      return new Promise(resolve => {
        const props = {
          initialValue: doc.attrs
        };
        this._popUp = (0, _createPopUp.default)(_DocLayoutEditor.default, props, {
          modal: true,
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
        } = state; // tr = view ? hideCursorPlaceholder(view.state) : tr;

        tr = tr.setSelection(selection);

        if (inputs) {
          const {
            width,
            layout
          } = inputs;
          tr = setDocLayout(tr, schema, width, layout);
        }

        dispatch(tr);
        view && view.focus();
      }

      return false;
    });
  }

}

var _default = DocLayoutCommand;
exports.default = _default;