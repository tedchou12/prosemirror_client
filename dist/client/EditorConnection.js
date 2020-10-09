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

var connection = null;

class State {
  constructor(edit, comm) {
    _defineProperty(this, "edit", void 0);

    _defineProperty(this, "comm", void 0);

    this.edit = edit;
    this.comm = comm;
  }

}

class EditorConnection {
  constructor(onReady, report, ws_url, session_hash, user_id, doc_id) {
    _defineProperty(this, "backOff", void 0);

    _defineProperty(this, "onReady", void 0);

    _defineProperty(this, "ready", void 0);

    _defineProperty(this, "report", void 0);

    _defineProperty(this, "request", void 0);

    _defineProperty(this, "state", void 0);

    _defineProperty(this, "ws_url", void 0);

    _defineProperty(this, "view", void 0);

    _defineProperty(this, "schema", void 0);

    _defineProperty(this, "socket", void 0);

    _defineProperty(this, "dispatch", action => {
      let newEditState = null;

      if (action.type == 'loaded') {
        const editState = _prosemirrorState.EditorState.create({
          doc: action.doc,
          plugins: _EditorPlugins.default.concat([(0, _prosemirrorCollab.collab)({
            clientID: this.client_id,
            version: action.version
          })])
        });

        this.state = new State(editState, 'poll');
        this.ready = true;
        this.onReady(editState); // this.poll();
        // this.cursor_poll();
      } else if (action.type == 'restart') {
        this.state = new State(null, 'start');
        this.ws_start();
      } else if (action.type == 'poll') {
        this.state = new State(this.state.edit, 'poll'); // this.poll();
      } else if (action.type == 'recover') {
        if (action.error.status && action.error.status < 500) {
          this.report.failure('error');
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
        } else if (action.requestDone) {
          this.state = new State(newEditState, 'poll'); // this.poll();
        } else if (this.state.comm == 'poll' && (sendable = this.sendable(newEditState))) {
          // this.closeRequest();
          this.state = new State(newEditState, 'send');
          this.ws_send(newEditState, sendable);
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
    this.ws_url = ws_url;
    this.doc_id = doc_id;
    this.user_id = user_id;
    this.client_id = user_id + '#' + (0, _uuid.default)();
    this.session_hash = session_hash;
    this.state = new State(null, 'start');
    this.request = null;
    this.backOff = 0;
    this.view = null;
    this.dispatch = this.dispatch.bind(this);
    this.ready = false;
    this.onReady = onReady;
    this.socket = null; // for websocket onmessage

    connection = this;
  } // [FS] IRAD-1040 2020-09-08


  getEffectiveSchema() {
    return null != this.schema ? this.schema : _EditorSchema.default;
  } // All state changes go through this


  // Send cursor updates to the server
  cursor_send(selection) {
    const content = {
      selection: selection,
      clientID: this.client_id
    };
    const json = JSON.stringify({
      type: 'selection',
      data: content
    });
    this.socket.send(json);
  }

  ws_start() {
    const ws_url = this.ws_url + '?user_id=' + this.user_id + '&session_hash=' + this.session_hash + '&doc_id=' + this.doc_id;
    this.socket = new WebSocket(ws_url);

    this.socket.onopen = function (e) {
      //does something when socket opens
      if (typeof add_user === typeof Function) {
        add_user(connection.user_id);
      }
    }; // replaces poll


    this.socket.onmessage = function (e) {
      connection.report.success();
      var data = JSON.parse(e.data);
      var json = data.data;

      if (data.type == 'init') {
        connection.dispatch({
          type: 'loaded',
          doc: connection.getEffectiveSchema().nodeFromJSON(json.doc_json),
          version: json.version,
          users: json.users
        });
      } else if (data.type == 'step') {
        connection.backOff = 0;

        if (json.steps && json.steps.length) {
          const tr = (0, _prosemirrorCollab.receiveTransaction)(connection.state.edit, json.steps.map(j => _prosemirrorTransform.Step.fromJSON(connection.getEffectiveSchema(), j)), json.clientIDs);
          connection.dispatch({
            type: 'transaction',
            transaction: tr,
            requestDone: false
          });
        }
      } else if (data.type == 'users') {
        if ('add' in json && json.add.length) {
          if (typeof add_user === typeof Function) {
            for (var i in json['add']) {
              add_user(json['add'][i]);
            }
          }
        }

        if ('delete' in json && json.delete.length) {
          if (typeof delete_user === typeof Function) {
            for (var i in json['delete']) {
              delete_user(json['delete'][i]);
            }
          }
        }
      } else {
        console.log(json);
      }
    }; //try reconnects


    this.socket.onclose = function (e) {
      // Too far behind. Revert to server state
      if (true) {
        connection.report.failure('error');
        connection.dispatch({
          type: 'restart'
        });
      } else {
        connection.closeRequest();
        connection.setView(null);
      }
    };
  }

  ws_send(editState, sendable) {
    const {
      steps
    } = sendable;
    const content = {
      version: (0, _prosemirrorCollab.getVersion)(editState),
      steps: steps ? steps.steps.map(s => s.toJSON()) : [],
      clientID: steps ? steps.clientID : 0
    };
    const json = JSON.stringify({
      type: 'content',
      data: content
    });
    this.socket.send(json);
    this.report.success();
    this.backOff = 0;
    const tr = steps ? (0, _prosemirrorCollab.receiveTransaction)(this.state.edit, steps.steps, repeat(steps.clientID, steps.steps.length)) : this.state.edit.tr;
    this.dispatch({
      type: 'transaction',
      transaction: tr,
      requestDone: true
    });
  }

  ws_recover() {
    const newBackOff = this.backOff ? Math.min(this.backOff * 2, 6e4) : 200;

    if (newBackOff > 1000 && this.backOff < 1000) {
      this.report.delay('error');
    }

    this.backOff = newBackOff;
    setTimeout(() => {
      if (this.state.comm == 'recover') {
        this.dispatch({
          type: 'restart'
        });
      }
    }, this.backOff);
  }

  sendable(editState) {
    const steps = (0, _prosemirrorCollab.sendableSteps)(editState);

    if (steps) {
      return {
        steps
      };
    }

    return null;
  } // [FS] IRAD-1040 2020-09-02
  // Send the modified schema to server


  updateSchema(schema) {
    // to avoid cyclic reference error, use flatted string.
    const schemaFlatted = (0, _flatted.stringify)(schema);
    this.run((0, _http.POST)(this.ws_url + '/schema/', schemaFlatted, 'text/plain')).then(data => {
      console.log("collab server's schema updated"); // [FS] IRAD-1040 2020-09-08

      this.schema = schema;
      this.start();
    }, err => {
      this.report.failure('error');
    });
  } // Try to recover from an error


  recover(err) {
    const newBackOff = this.backOff ? Math.min(this.backOff * 2, 6e4) : 200;

    if (newBackOff > 1000 && this.backOff < 1000) {
      this.report.delay('error');
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