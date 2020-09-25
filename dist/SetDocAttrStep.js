"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTransform = require("prosemirror-transform");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  } // [FS] IRAD-1010 2020-07-27
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
    if (other instanceof SetDocAttrStep && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from) {
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

} // [FS-AFQ][13-MAR-2020][IRAD-899]
// Register this step so that capcomode can be dealt collaboratively.


_prosemirrorTransform.Step.jsonID("SetDocAttr", SetDocAttrStep);

var _default = SetDocAttrStep;
exports.default = _default;