"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_MathInlineEditorValue = exports.default = void 0;

require("./czi-inline-editor.css");

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _CustomEditorView = _interopRequireDefault(require("./CustomEditorView"));

var _MathEditor = _interopRequireDefault(require("./MathEditor"));

var React = _interopRequireWildcard(require("react"));

var _createPopUp = _interopRequireDefault(require("./createPopUp"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const MathAlignValues = {
  NONE: {
    value: null,
    text: 'Inline'
  },
  CENTER: {
    value: 'center',
    text: 'Break text'
  }
};
var bpfrpt_proptype_MathInlineEditorValue = {
  "align": _propTypes.default.string,
  "latex": _propTypes.default.string.isRequired
};
exports.bpfrpt_proptype_MathInlineEditorValue = bpfrpt_proptype_MathInlineEditorValue;

class MathInlineEditor extends React.PureComponent {
  constructor() {
    super(...arguments);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "_onClick", align => {
      const value = this.props.value || {};
      this.props.onSelect(_objectSpread(_objectSpread({}, value), {}, {
        align
      }));
    });

    _defineProperty(this, "_editLatex", latex => {
      if (this._popUp) {
        return;
      }

      const {
        editorView,
        value
      } = this.props;
      const props = {
        runtime: editorView ? editorView.runtime : null,
        initialValue: value && value.latex || ''
      };
      this._popUp = (0, _createPopUp.default)(_MathEditor.default, props, {
        autoDismiss: false,
        modal: true,
        onClose: latex => {
          if (this._popUp) {
            this._popUp = null;

            if (latex !== undefined) {
              const value = this.props.value || {};
              this.props.onSelect(_objectSpread(_objectSpread({}, value), {}, {
                latex
              }));
            }

            this.props.onEditEnd();
          }
        }
      });
      this.props.onEditStart();
    });
  }

  componentWillUnmount() {
    this._popUp && this._popUp.close();
  }

  render() {
    const {
      align,
      latex
    } = this.props.value || {};
    const onClick = this._onClick;
    const buttons = Object.keys(MathAlignValues).map(key => {
      const {
        value,
        text
      } = MathAlignValues[key];
      return /*#__PURE__*/React.createElement(_CustomButton.default, {
        active: align === value,
        key: key,
        label: text,
        onClick: onClick,
        value: value
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-inline-editor"
    }, buttons, /*#__PURE__*/React.createElement(_CustomButton.default, {
      key: "edit",
      label: "Edit",
      onClick: this._editLatex,
      value: latex || ''
    }));
  }

}

var _default = MathInlineEditor;
exports.default = _default;