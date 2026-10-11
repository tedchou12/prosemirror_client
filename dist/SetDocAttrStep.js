"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorTransform = require("prosemirror-transform");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
// https://discuss.prosemirror.net/t/changing-doc-attrs/784/17
class SetDocAttrStep extends _prosemirrorTransform.Step {
  constructor(key, value) {
    let stepType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'SetDocAttr';
    super();
    _defineProperty(this, "key", void 0);
    _defineProperty(this, "stepType", void 0);
    _defineProperty(this, "value", void 0);
    this.stepType = stepType;
    this.key = key;
    this.value = value;
  }
  apply(doc) {
    this.prevValue = doc.attrs[this.key];
    const attrs = _objectSpread(_objectSpread({}, doc.attrs), {}, {
      [this.key]: this.value
    });
    const docNew = doc.type.create(attrs, doc.content, doc.marks);
    return _prosemirrorTransform.StepResult.ok(docNew);
  }
  invert() {
    return new SetDocAttrStep(this.key, this.prevValue, 'revertSetDocAttr');
  }

  // [FS] IRAD-1010 2020-07-27
  // Handle map properly so that undo works correctly for document attritube changes.
  map(mapping) {
    var from = mapping.mapResult(this.from, 1),
      to = mapping.mapResult(this.to, -1);
    if (from.deleted && to.deleted) {
      return null;
    }
    return new SetDocAttrStep(this.key, this.value, 'SetDocAttr');
  }
  merge(other) {
    if (other instanceof SetDocAttrStep && other.mark && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from) {
      return new SetDocAttrStep(this.key, this.value, 'SetDocAttr');
    }
  }
  toJSON() {
    return {
      stepType: this.stepType,
      key: this.key,
      value: this.value
    };
  }
  static fromJSON(schema, json) {
    return new SetDocAttrStep(json.key, json.value, json.stepType);
  }
}

// [FS-AFQ][13-MAR-2020][IRAD-899]
// Register this step so that document attrbute changes can be dealt collaboratively.
_prosemirrorTransform.Step.jsonID("SetDocAttr", SetDocAttrStep);
var _default = exports.default = SetDocAttrStep;