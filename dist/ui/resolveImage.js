"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_ImageResult = void 0;
exports.default = resolveImage;
var _url = _interopRequireDefault(require("url"));
var _isOffline = _interopRequireDefault(require("./isOffline"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
var bpfrpt_proptype_ImageResult = exports.bpfrpt_proptype_ImageResult = {
  "complete": _propTypes.default.bool.isRequired,
  "height": _propTypes.default.number.isRequired,
  "naturalHeight": _propTypes.default.number.isRequired,
  "naturalWidth": _propTypes.default.number.isRequired,
  "src": _propTypes.default.string.isRequired,
  "width": _propTypes.default.number.isRequired
};
const cache = {};
const queue = [];
function resolveImage(src) {
  return new Promise((resolve, reject) => {
    const bag = {
      src,
      resolve,
      reject
    };
    queue.push(bag);
    processQueue();
  });
}
function processQueue() {
  const bag = queue.shift();
  if (bag) {
    processPromise(bag.src, bag.resolve, bag.reject);
  }
}
function processPromise(src, resolve, reject) {
  const result = {
    complete: false,
    height: 0,
    naturalHeight: 0,
    naturalWidth: 0,
    src: src || '',
    width: 0
  };
  if ((0, _isOffline.default)()) {
    resolve(result);
    return;
  }
  const srcStr = src || '';
  if (!srcStr) {
    resolve(result);
    return;
  } else if (cache[srcStr]) {
    const cachedResult = Object.assign({}, cache[srcStr]);
    resolve(cachedResult);
    return;
  }
  const parsedURL = _url.default.parse(srcStr);
  // [FS] IRAD-1007 2020-07-13
  // Removed the port validation from here
  const {
    protocol
  } = parsedURL;
  if (!/(http:|https:|data:)/.test(protocol || window.location.protocol)) {
    resolve(result);
    return;
  }
  let img;
  const onLoad = () => {
    if (img) {
      result.width = img.width;
      result.height = img.height;
      result.naturalWidth = img.width;
      result.naturalHeight = img.height;
      result.complete = true;
    }
    resolve(result);
    dispose();
    // [FS] IRAD-1006 2020-07-17
    // Fix: Inconsistent behavior on image load
    // Avoid image caching remove the below line
    cache[srcStr] = _objectSpread({}, result);
  };
  const onError = () => {
    resolve(result);
    dispose();
  };
  const dispose = () => {
    if (img) {
      if (img instanceof HTMLElement) {
        const pe = img.parentNode;
        pe && pe.removeChild(img);
      }
      img.onload = null;
      img.onerror = null;
      img = null;
    }
    processQueue();
  };
  const {
    body
  } = document;
  if (body) {
    img = document.createElement('img');
    img.style.cssText = 'position:fixed;left:-10000000000px;width:auto;height:auto;';
    img.onload = onLoad;
    img.onerror = onError;
    img.src = srcStr;
    body.appendChild(img);
  } else {
    img = new Image();
    img.onload = onLoad;
    img.onerror = onError;
    img.src = srcStr;
  }
}