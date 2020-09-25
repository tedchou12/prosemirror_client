"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorCollab = require("prosemirror-collab");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _EditorPlugins = _interopRequireDefault(require("../EditorPlugins"));

var _EditorSchema = _interopRequireDefault(require("../EditorSchema"));

var _uuid = _interopRequireDefault(require("../uuid"));

var _http = require("./http");

var _prosemirrorModel = require("prosemirror-model");

var _flatted = require("flatted");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function badVersion(err) {
  return err.status == 400 && /invalid version/i.test(String(err));
}

class State {
  constructor(edit, comm) {
    _defineProperty(this, "edit", void 0);

    _defineProperty(this, "comm", void 0);

    this.edit = edit;
    this.comm = comm;
  }

}

class EditorConnection {
  constructor(onReady, report, url) {
    _defineProperty(this, "backOff", void 0);

    _defineProperty(this, "onReady", void 0);

    _defineProperty(this, "ready", void 0);

    _defineProperty(this, "report", void 0);

    _defineProperty(this, "request", void 0);

    _defineProperty(this, "state", void 0);

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "view", void 0);

    _defineProperty(this, "schema", void 0);

    _defineProperty(this, "dispatch", action => {
      let newEditState = null;

      if (action.type == 'loaded') {
        const editState = _prosemirrorState.EditorState.create({
          doc: action.doc,
          plugins: _EditorPlugins.default.concat([(0, _prosemirrorCollab.collab)({
            clientID: (0, _uuid.default)(),
            version: action.version
          })])
        });

        this.state = new State(editState, 'poll');
        this.ready = true;
        this.onReady(editState);
        this.poll();
      } else if (action.type == 'restart') {
        this.state = new State(null, 'start');
        this.start();
      } else if (action.type == 'poll') {
        this.state = new State(this.state.edit, 'poll');
        this.poll();
      } else if (action.type == 'recover') {
        if (action.error.status && action.error.status < 500) {
          this.report.failure(action.error);
          this.state = new State(null, null);
        } else {
          this.state = new State(this.state.edit, 'recover');
          this.recover(action.error);
        }
      } else if (action.type == 'transaction') {
        newEditState = this.state.edit ? this.state.edit.apply(action.transaction) : null;
      }

      if (newEditState) {
        let sendable;

        if (newEditState.doc.content.size > 40000) {
          if (this.state.comm !== 'detached') {
            this.report.failure('Document too big. Detached.');
          }

          this.state = new State(newEditState, 'detached');
        } else if ((this.state.comm == 'poll' || action.requestDone) && (sendable = this.sendable(newEditState))) {
          this.closeRequest();
          this.state = new State(newEditState, 'send');
          this.send(newEditState, sendable);
        } else if (action.requestDone) {
          this.state = new State(newEditState, 'poll');
          this.poll();
        } else {
          this.state = new State(newEditState, this.state.comm);
        }
      } // Sync the editor with this.state.edit


      if (this.state.edit && this.view) {
        this.view.updateState(this.state.edit);
      }
    });

    this.schema = null;
    this.report = report;
    this.url = url;
    this.state = new State(null, 'start');
    this.request = null;
    this.backOff = 0;
    this.view = null;
    this.dispatch = this.dispatch.bind(this);
    this.ready = false;
    this.onReady = onReady;
  } // [FS] IRAD-1040 2020-09-08


  getEffectiveSchema() {
    return null != this.schema ? this.schema : _EditorSchema.default;
  } // All state changes go through this


  // Load the document from the server and start up
  start() {
    this.run((0, _http.GET)(this.url)).then(data => {
      data = JSON.parse(data);
      this.report.success();
      this.backOff = 0;
      this.dispatch({
        type: 'loaded',
        doc: this.getEffectiveSchema().nodeFromJSON(data.doc_json),
        version: data.version,
        users: data.users
      });
    }, err => {
      this.report.failure(err);
    });
  } // Send a request for events that have happened since the version
  // of the document that the client knows about. This request waits
  // for a new version of the document to be created if the client
  // is already up-to-date.


  poll() {
    const query = 'version=' + (0, _prosemirrorCollab.getVersion)(this.state.edit);
    this.run((0, _http.GET)(this.url + '/events?' + query)).then(data => {
      this.report.success();
      data = JSON.parse(data);
      this.backOff = 0;

      if (data.steps && data.steps.length) {
        const tr = (0, _prosemirrorCollab.receiveTransaction)(this.state.edit, data.steps.map(j => _prosemirrorTransform.Step.fromJSON(this.getEffectiveSchema(), j)), data.clientIDs);
        this.dispatch({
          type: 'transaction',
          transaction: tr,
          requestDone: true
        });
      } else {
        this.poll();
      }
    }, err => {
      if (err.status == 410 || badVersion(err)) {
        // Too far behind. Revert to server state
        this.report.failure(err);
        this.dispatch({
          type: 'restart'
        });
      } else if (err) {
        this.dispatch({
          type: 'recover',
          error: err
        });
      }
    });
  }

  sendable(editState) {
    const steps = (0, _prosemirrorCollab.sendableSteps)(editState);

    if (steps) {
      return {
        steps
      };
    }

    return null;
  } // Send the given steps to the server


  send(editState, sendable) {
    const {
      steps
    } = sendable;
    const json = JSON.stringify({
      version: (0, _prosemirrorCollab.getVersion)(editState),
      steps: steps ? steps.steps.map(s => s.toJSON()) : [],
      clientID: steps ? steps.clientID : 0
    });
    this.run((0, _http.POST)(this.url + '/events', json, 'application/json')).then(data => {
      this.report.success();
      this.backOff = 0;
      const tr = steps ? (0, _prosemirrorCollab.receiveTransaction)(this.state.edit, steps.steps, repeat(steps.clientID, steps.steps.length)) : this.state.edit.tr;
      this.dispatch({
        type: 'transaction',
        transaction: tr,
        requestDone: true
      });
    }, err => {
      if (err.status == 409) {
        // The client's document conflicts with the server's version.
        // Poll for changes and then try again.
        this.backOff = 0;
        this.dispatch({
          type: 'poll'
        });
      } else if (badVersion(err)) {
        this.report.failure(err);
        this.dispatch({
          type: 'restart'
        });
      } else {
        this.dispatch({
          type: 'recover',
          error: err
        });
      }
    });
  } // [FS] IRAD-1040 2020-09-02
  // Send the modified schema to server


  updateSchema(schema) {
    // to avoid cyclic reference error, use flatted string.
    const schemaFlatted = (0, _flatted.stringify)(schema);
    this.run((0, _http.POST)(this.url + '/schema/', schemaFlatted, 'text/plain')).then(data => {
      console.log("collab server's schema updated"); // [FS] IRAD-1040 2020-09-08

      this.schema = schema;
      this.start();
    }, err => {
      this.report.failure(err);
    });
  } // Try to recover from an error


  recover(err) {
    const newBackOff = this.backOff ? Math.min(this.backOff * 2, 6e4) : 200;

    if (newBackOff > 1000 && this.backOff < 1000) {
      this.report.delay(err);
    }

    this.backOff = newBackOff;
    setTimeout(() => {
      if (this.state.comm == 'recover') {
        this.dispatch({
          type: 'poll'
        });
      }
    }, this.backOff);
  }

  closeRequest() {
    if (this.request) {
      this.request.abort();
      this.request = null;
    }
  }

  run(request) {
    return this.request = request;
  }

  close() {
    this.closeRequest();
    this.setView(null);
  }

  setView(view) {
    if (this.view) {
      this.view.destroy();
    }

    this.view = window.view = view;
  }

}

function repeat(val, n) {
  const result = [];

  for (let i = 0; i < n; i++) {
    result.push(val);
  }

  return result;
}

var _default = EditorConnection;
exports.default = _default;