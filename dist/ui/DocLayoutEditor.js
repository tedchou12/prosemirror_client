"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_DocLayoutEditorValue = exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _DocNodeSpec = require("../DocNodeSpec");

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _CustomRadioButton = _interopRequireDefault(require("./CustomRadioButton"));

var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));

require("./czi-body-layout-editor.css");

require("./czi-form.css");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bpfrpt_proptype_DocLayoutEditorValue = {
  "layout": _propTypes.default.string,
  "width": _propTypes.default.number
};
exports.bpfrpt_proptype_DocLayoutEditorValue = bpfrpt_proptype_DocLayoutEditorValue;

class DocLayoutEditor extends React.PureComponent {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  // To take care of the property type declaration.
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "_unmounted", false);

    _defineProperty(this, "state", void 0);

    _defineProperty(this, "_onSelect", selectedValue => {
      this.setState({
        selectedValue
      });
    });

    _defineProperty(this, "_cancel", () => {
      this.props.close();
    });

    _defineProperty(this, "_apply", () => {
      const {
        selectedValue
      } = this.state;

      if (typeof selectedValue === 'string') {
        this.props.close({
          width: null,
          layout: selectedValue
        });
      } else {
        this.props.close({
          width: selectedValue,
          layout: null
        });
      }
    });

    const {
      width,
      layout
    } = this.props.initialValue || {};
    this.state = {
      width,
      layout,
      selectedValue: width || layout || _DocNodeSpec.LAYOUT.US_LETTER_PORTRAIT
    };
  }

  render() {
    const {
      width,
      selectedValue
    } = this.state;
    const customOption = width ? /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === width,
      key: "c",
      label: `Custom width: ${width}pt`,
      onSelect: this._onSelect,
      value: width
    }) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-body-layout-editor"
    }, /*#__PURE__*/React.createElement("form", {
      className: "czi-form",
      onSubmit: _preventEventDefault.default
    }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "Page Layout"), /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === _DocNodeSpec.LAYOUT.US_LETTER_PORTRAIT,
      label: "US Letter - Portrait",
      onSelect: this._onSelect,
      value: _DocNodeSpec.LAYOUT.US_LETTER_PORTRAIT
    }), /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === _DocNodeSpec.LAYOUT.US_LETTER_LANDSCAPE,
      label: "US Letter - Landscape",
      onSelect: this._onSelect,
      value: _DocNodeSpec.LAYOUT.US_LETTER_LANDSCAPE
    }), /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === _DocNodeSpec.LAYOUT.DESKTOP_SCREEN_4_3,
      label: "4:3 Desktop Screen",
      onSelect: this._onSelect,
      value: _DocNodeSpec.LAYOUT.DESKTOP_SCREEN_4_3
    }), /*#__PURE__*/React.createElement(_CustomRadioButton.default, {
      checked: selectedValue === _DocNodeSpec.LAYOUT.DESKTOP_SCREEN_16_9,
      label: "16:9 Desktop Screen",
      onSelect: this._onSelect,
      value: _DocNodeSpec.LAYOUT.DESKTOP_SCREEN_16_9
    }), customOption), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
      className: "czi-form-buttons"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: "Cancel",
      onClick: this._cancel
    }), /*#__PURE__*/React.createElement(_CustomButton.default, {
      active: true,
      label: "Apply",
      onClick: this._apply
    }))));
  }

}

_defineProperty(DocLayoutEditor, "propsTypes", {
  // initialValue: PropTypes.shape({
  //   layout: PropTypes.string,
  //   width: PropTypes.number,
  // }),
  close: function (props, propName) {
    var fn = props[propName];

    if (!fn.prototype || typeof fn.prototype.constructor !== 'function' && fn.prototype.constructor.length !== 1) {
      return new Error(propName + 'must be a function with 1 arg of type DocLayoutEditorValue');
    }
  }
});

var _default = DocLayoutEditor;
exports.default = _default;