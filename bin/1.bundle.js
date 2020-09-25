/*! For license information please see 1.bundle.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{"./node_modules/prosemirror-dev-tools/dist/esm/state/idle-scheduler.js":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IdleScheduler", function() { return IdleScheduler; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar IdleScheduler = /*#__PURE__*/function () {\n  function IdleScheduler() {\n    _classCallCheck(this, IdleScheduler);\n\n    _defineProperty(this, "task", undefined);\n  }\n\n  _createClass(IdleScheduler, [{\n    key: "request",\n    value: function request() {\n      this.cancel();\n      var request = window.requestIdleCallback || window.requestAnimationFrame;\n      return new Promise(function (resolve) {\n        return request(resolve);\n      });\n    }\n  }, {\n    key: "cancel",\n    value: function cancel() {\n      var cancel = window.cancelIdleCallack || window.cancelAnimationFrame;\n\n      if (this.task) {\n        cancel(this.task);\n      }\n    }\n  }]);\n\n  return IdleScheduler;\n}();\n\n//# sourceURL=webpack:///./node_modules/prosemirror-dev-tools/dist/esm/state/idle-scheduler.js?')},"./node_modules/prosemirror-dev-tools/dist/esm/state/json-diff-worker.js":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JsonDiffWorker", function() { return JsonDiffWorker; });\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");\n/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nanoid */ "./node_modules/nanoid/index.browser.js");\n/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nanoid__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _idle_scheduler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./idle-scheduler */ "./node_modules/prosemirror-dev-tools/dist/esm/state/idle-scheduler.js");\n\n\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\nvar JsonDiffWorker = /*#__PURE__*/function () {\n  function JsonDiffWorker(worker) {\n    var _this = this;\n\n    _classCallCheck(this, JsonDiffWorker);\n\n    _defineProperty(this, "queue", new Map());\n\n    _defineProperty(this, "scheduler", new _idle_scheduler__WEBPACK_IMPORTED_MODULE_2__["IdleScheduler"]());\n\n    this.worker = worker;\n    this.worker.addEventListener("message", function (e) {\n      var deferred = _this.queue.get(e.data.id);\n\n      if (deferred) {\n        _this.queue["delete"](e.data.id);\n\n        deferred.resolve(e.data.returns);\n      }\n    });\n  }\n\n  _createClass(JsonDiffWorker, [{\n    key: "diff",\n    value: function () {\n      var _diff = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(input) {\n        var id, deferred;\n        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {\n          while (1) {\n            switch (_context.prev = _context.next) {\n              case 0:\n                _context.next = 2;\n                return this.scheduler.request();\n\n              case 2:\n                id = nanoid__WEBPACK_IMPORTED_MODULE_1___default()();\n                deferred = createDeferrable();\n                this.queue.set(id, deferred);\n                this.worker.postMessage({\n                  method: "diff",\n                  id: id,\n                  args: [input]\n                });\n                return _context.abrupt("return", deferred);\n\n              case 7:\n              case "end":\n                return _context.stop();\n            }\n          }\n        }, _callee, this);\n      }));\n\n      function diff(_x) {\n        return _diff.apply(this, arguments);\n      }\n\n      return diff;\n    }()\n  }]);\n\n  return JsonDiffWorker;\n}();\n\nfunction createDeferrable() {\n  var r;\n  var p = new Promise(function (resolve) {\n    r = resolve;\n  });\n\n  p.resolve = function () {\n    return r.apply(void 0, arguments);\n  };\n\n  return p;\n}\n\n//# sourceURL=webpack:///./node_modules/prosemirror-dev-tools/dist/esm/state/json-diff-worker.js?')}}]);