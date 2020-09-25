"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_PopUpHandle = exports.bpfrpt_proptype_PopUpProps = exports.bpfrpt_proptype_PopUpParams = exports.bpfrpt_proptype_ViewProps = exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _PopUpManager = _interopRequireWildcard(require("./PopUpManager"));

var _PopUpPosition = require("./PopUpPosition");

var _uuid = _interopRequireDefault(require("./uuid"));

var _rects = require("./rects");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bpfrpt_proptype_ViewProps = _propTypes.default.object;
exports.bpfrpt_proptype_ViewProps = bpfrpt_proptype_ViewProps;
var bpfrpt_proptype_PopUpParams = {
  "anchor": _propTypes.default.any,
  "autoDismiss": _propTypes.default.bool,
  "container": function () {
    return (typeof Element === "function" ? _propTypes.default.instanceOf(Element) : _propTypes.default.any).apply(this, arguments);
  },
  "modal": _propTypes.default.bool,
  "onClose": _propTypes.default.func,
  "position": _propTypes.default.func
};
exports.bpfrpt_proptype_PopUpParams = bpfrpt_proptype_PopUpParams;
var bpfrpt_proptype_PopUpProps = {
  "View": _propTypes.default.func.isRequired,
  "close": _propTypes.default.func.isRequired,
  "popUpParams": _propTypes.default.shape({
    anchor: _propTypes.default.any,
    autoDismiss: _propTypes.default.bool,
    container: function () {
      return (typeof Element === "function" ? _propTypes.default.instanceOf(Element) : _propTypes.default.any).apply(this, arguments);
    },
    modal: _propTypes.default.bool,
    onClose: _propTypes.default.func,
    position: _propTypes.default.func
  }).isRequired,
  "viewProps": _propTypes.default.object.isRequired
};
exports.bpfrpt_proptype_PopUpProps = bpfrpt_proptype_PopUpProps;
var bpfrpt_proptype_PopUpHandle = {
  "close": _propTypes.default.func.isRequired,
  "update": _propTypes.default.func.isRequired
};
exports.bpfrpt_proptype_PopUpHandle = bpfrpt_proptype_PopUpHandle;

class PopUp extends React.PureComponent {
  constructor() {
    super(...arguments);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_bridge", null);

    _defineProperty(this, "_id", (0, _uuid.default)());

    _defineProperty(this, "_getDetails", () => {
      const {
        close,
        popUpParams
      } = this.props;
      const {
        anchor,
        autoDismiss,
        position,
        modal
      } = popUpParams;
      return {
        anchor,
        autoDismiss: autoDismiss === false ? false : true,
        body: document.getElementById(this._id),
        close,
        modal: modal === true,
        position: position || (modal ? _PopUpPosition.atViewportCenter : _PopUpPosition.atAnchorBottomLeft)
      };
    });
  }

  render() {
    const dummy = {};
    const {
      View,
      viewProps,
      close
    } = this.props;
    return /*#__PURE__*/React.createElement("div", {
      "data-pop-up-id": this._id,
      id: this._id
    }, /*#__PURE__*/React.createElement(View, _extends({}, viewProps || dummy, {
      close: close
    })));
  }

  componentDidMount() {
    this._bridge = {
      getDetails: this._getDetails
    };

    _PopUpManager.default.register(this._bridge);
  }

  componentWillUnmount() {
    this._bridge && _PopUpManager.default.unregister(this._bridge);
  }

}

var _default = PopUp;
exports.default = _default;