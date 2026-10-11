"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bpfrpt_proptype_ViewProps = exports.bpfrpt_proptype_PopUpProps = exports.bpfrpt_proptype_PopUpParams = exports.bpfrpt_proptype_PopUpHandle = void 0;
var React = _interopRequireWildcard(require("react"));
var _PopUpManager = _interopRequireWildcard(require("./PopUpManager"));
var _PopUpPosition = require("./PopUpPosition");
var _uuid = _interopRequireDefault(require("./uuid"));
var _rects = require("./rects");
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var cache;
function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var r, c, a = Object.defineProperty, n = { __proto__: null, default: e }; if (Object(e) !== e) return n; if (cache || "function" != typeof WeakMap || (cache = new WeakMap()), cache) { if (cache.has(e)) return cache.get(e); cache.set(e, n); } for (c in e) "default" !== c && {}.hasOwnProperty.call(e, c) && ((r = a && Object.getOwnPropertyDescriptor(e, c)) && (r.get || r.set) ? a(n, c, r) : n[c] = e[c]); return n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
var bpfrpt_proptype_ViewProps = exports.bpfrpt_proptype_ViewProps = _propTypes.default.object;
var bpfrpt_proptype_PopUpParams = exports.bpfrpt_proptype_PopUpParams = {
  "anchor": _propTypes.default.any,
  "autoDismiss": _propTypes.default.bool,
  "container": function () {
    return (typeof Element === "function" ? _propTypes.default.instanceOf(Element) : _propTypes.default.any).apply(this, arguments);
  },
  "modal": _propTypes.default.bool,
  "onClose": _propTypes.default.func,
  "position": _propTypes.default.func
};
var bpfrpt_proptype_PopUpProps = exports.bpfrpt_proptype_PopUpProps = {
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
var bpfrpt_proptype_PopUpHandle = exports.bpfrpt_proptype_PopUpHandle = {
  "close": _propTypes.default.func.isRequired,
  "update": _propTypes.default.func.isRequired
};
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
var _default = exports.default = PopUp;