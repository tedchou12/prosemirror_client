"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observe = observe;
exports.unobserve = unobserve;
exports.bpfrpt_proptype_ResizeObserverEntry = exports.default = void 0;

var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));

var _nullthrows = _interopRequireDefault(require("nullthrows"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bpfrpt_proptype_ResizeObserverEntry = {
  "target": function () {
    return (typeof Element === "function" ? _propTypes.default.instanceOf(Element).isRequired : _propTypes.default.any.isRequired).apply(this, arguments);
  },
  "contentRect": _propTypes.default.shape({
    x: _propTypes.default.number.isRequired,
    y: _propTypes.default.number.isRequired,
    width: _propTypes.default.number.isRequired,
    height: _propTypes.default.number.isRequired,
    top: _propTypes.default.number.isRequired,
    right: _propTypes.default.number.isRequired,
    bottom: _propTypes.default.number.isRequired,
    left: _propTypes.default.number.isRequired
  }).isRequired
};
exports.bpfrpt_proptype_ResizeObserverEntry = bpfrpt_proptype_ResizeObserverEntry;
let instance = null;
const nodesObserving = new Map();

function onResizeObserve(entries) {
  entries.forEach(handleResizeObserverEntry);
}

function handleResizeObserverEntry(entry) {
  const node = entry.target;
  const callbacks = nodesObserving.get(node);

  const executeCallback = cb => cb(entry);

  callbacks && callbacks.forEach(executeCallback);
}

function observe(node, callback) {
  const el = node;
  const observer = instance || (instance = new _resizeObserverPolyfill.default(onResizeObserve));

  if (nodesObserving.has(el)) {
    // Already observing node.
    const callbacks = (0, _nullthrows.default)(nodesObserving.get(el));
    callbacks.push(callback);
  } else {
    const callbacks = [callback];
    nodesObserving.set(el, callbacks);
    observer.observe(el);
  }
}

function unobserve(node, callback) {
  const observer = instance;

  if (!observer) {
    return;
  }

  const el = node;
  observer.unobserve(el);

  if (callback) {
    // Remove the passed in callback from the callbacks of the observed node
    // And, if no more callbacks then stop observing the node
    const callbacks = nodesObserving.has(el) ? (0, _nullthrows.default)(nodesObserving.get(el)).filter(cb => cb !== callback) : null;

    if (callbacks && callbacks.length) {
      nodesObserving.set(el, callbacks);
    } else {
      nodesObserving.delete(el);
    }
  } else {
    // Delete all callbacks for the node.
    nodesObserving.delete(el);
  }

  if (!nodesObserving.size) {
    // We have nothing to observe. Stop observing, which stops the
    // ResizeObserver instance from receiving notifications of
    // DOM resizing. Until the observe() method is used again.
    // According to specification a ResizeObserver is deleted by the garbage
    // collector if the target element is deleted.
    observer.disconnect();
    instance = null;
  }
}

var _default = {
  observe,
  unobserve
};
exports.default = _default;