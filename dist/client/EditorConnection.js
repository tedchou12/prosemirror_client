"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorCollab = require("prosemirror-collab");
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorView = require("prosemirror-view");
var _prosemirrorModel = require("prosemirror-model");
var _prosemirrorTransform = require("prosemirror-transform");
var _EditorPlugins = _interopRequireDefault(require("../EditorPlugins"));
var _EditorSchema = _interopRequireDefault(require("../EditorSchema"));
var _RemoteCursorPlugin = require("../RemoteCursorPlugin");
var _uuid = _interopRequireDefault(require("../uuid"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
// [FS] IRAD-1040 2020-09-02

var connection = null;
var retry_count = 0;
var retry_timer = 0;
var retry_time = [15, 30, 60, 90, 180, 360, 720];
var last_connection = null;
var unauthorized = false;
class State {
  constructor(edit, comm) {
    _defineProperty(this, "edit", void 0);
    _defineProperty(this, "comm", void 0);
    this.edit = edit;
    this.comm = comm;
  }
}
class EditorConnection {
  constructor(onReady, ws_url, session_hash, user_id, doc_id) {
    _defineProperty(this, "backOff", void 0);
    _defineProperty(this, "onReady", void 0);
    _defineProperty(this, "ready", void 0);
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
        this.onReady(editState);
      } else if (action.type == 'start') {
        this.state = new State(null, 'start');
        this.ws_start();
      } else if (action.type == 'restart') {
        this.state = new State(null, 'recover');
        this.ws_start();
      } else if (action.type == 'poll') {
        this.state = new State(this.state.edit, 'poll');
      } else if (action.type == 'recover') {
        if (typeof show_message === typeof Function) {
          show_message('error');
        }
        this.state = new State(null, 'recover');
        this.ws_recover();
      } else if (action.type == 'transaction') {
        newEditState = this.state.edit ? this.state.edit.apply(action.transaction) : null;
      }
      if (newEditState) {
        let sendable;
        if (newEditState.doc.content.size > 1000000) {
          if (this.state.comm !== 'detached') {
            if (typeof show_message === typeof Function) {
              show_message('size_limit');
            }
          }
          this.state = new State(newEditState, 'detached');
        } else if (action.requestDone) {
          this.state = new State(newEditState, 'poll');
        } else if (this.state.comm == 'poll' && (sendable = this.sendable(newEditState))) {
          this.state = new State(newEditState, 'send');
          this.ws_send(newEditState, sendable);
        } else {
          this.state = new State(newEditState, this.state.comm);
        }
      }

      // Sync the editor with this.state.edit
      if (this.state.edit && this.view) {
        this.view.updateState(this.state.edit);
      }
    });
    this.schema = null;
    this.service = 'doc_editor';
    this.ws_url = ws_url;
    this.doc_id = doc_id;
    this.user_id = user_id;
    this.client_id = user_id + '#' + (0, _uuid.default)();
    this.session_hash = session_hash;
    this.state = new State(null, 'start');
    this.request = null;
    this.view = null;
    this.dispatch = this.dispatch.bind(this);
    this.ready = false;
    this.onReady = onReady;
    this.socket = null;
    this.temp = null;

    // for websocket onmessage
    connection = this;
  }

  // [FS] IRAD-1040 2020-09-08
  getEffectiveSchema() {
    return null != this.schema ? this.schema : _EditorSchema.default;
  }

  // All state changes go through this

  // Send cursor updates to the server
  cursor_send(selection) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    const content = {
      selection: {
        anchor: selection.anchor,
        head: selection.head
      },
      clientID: this.client_id
    };
    const json = JSON.stringify({
      type: 'selection',
      data: content
    });
    this.socket.send(json);
  }
  ws_start() {
    const ws_url = this.ws_url + '?service=' + this.service + '&user_id=' + this.user_id + '&session_hash=' + this.session_hash + '&doc_id=' + this.doc_id + '&client_id=' + encodeURIComponent(btoa(this.client_id));
    this.socket = new WebSocket(ws_url);
    this.socket.onopen = function (e) {
      //does something when socket opens
      if (typeof add_user === typeof Function) {
        add_user(connection.user_id, window.user_name);
      }
      connection.state.comm = 'start';
      retry_count = 0;
      retry_timer = 0;
      if (typeof hide_message === typeof Function) {
        hide_message();
      }
      last_connection = Date.now();
    };

    // replaces poll
    this.socket.onmessage = function (e) {
      unauthorized = false;
      var data = JSON.parse(e.data);
      var json = data.data;
      if (data.type == 'init') {
        connection.temp = json.doc_json;
        connection.recursive_unquote(connection.temp);
        connection.dispatch({
          type: 'loaded',
          doc: connection.getEffectiveSchema().nodeFromJSON(connection.temp),
          version: json.version,
          users: json.users
        });
      } else if (data.type == 'step') {
        if (json.steps && json.steps.length) {
          connection.temp = json.steps;
          connection.recursive_unquote(connection.temp);
          const tr = (0, _prosemirrorCollab.receiveTransaction)(connection.state.edit, connection.temp.map(j => _prosemirrorTransform.Step.fromJSON(connection.getEffectiveSchema(), j)), json.clientIDs);
          connection.dispatch({
            type: 'transaction',
            transaction: tr,
            requestDone: false
          });
        }
      } else if (data.type == 'selection' || data.type == 'cursor') {
        const cursorData = json;
        if (connection.state.edit && cursorData && cursorData.clientID !== connection.client_id) {
          const transaction = (0, _RemoteCursorPlugin.receiveRemoteCursor)(connection.state.edit, cursorData);
          if (transaction) {
            connection.dispatch({
              type: 'transaction',
              transaction
            });
          }
        }
      } else if (data.type == 'cursor_leave') {
        if (connection.state.edit && json && json.userId) {
          connection.dispatch({
            type: 'transaction',
            transaction: (0, _RemoteCursorPlugin.removeRemoteCursorsForUser)(connection.state.edit, String(json.userId))
          });
        }
      } else if (data.type == 'users') {
        if ('add' in json && 'user_id' in json['add'] && (Object.keys(json['add']['user_id']).length || json.add.user_id.length)) {
          if (typeof add_user === typeof Function) {
            for (var addIndex in json['add']['user_id']) {
              add_user(json['add']['user_id'][addIndex], json['add']['user_name'][addIndex]);
            }
          }
        }
        if ('delete' in json && 'user_id' in json['delete'] && (Object.keys(json['delete']['user_id']).length || json.delete.user_id.length)) {
          for (var deleteIndex in json['delete']['user_id']) {
            if (typeof delete_user === typeof Function) {
              delete_user(json['delete']['user_id'][deleteIndex]);
            }
            if (connection.state.edit) {
              connection.dispatch({
                type: 'transaction',
                transaction: (0, _RemoteCursorPlugin.removeRemoteCursorsForUser)(connection.state.edit, String(json['delete']['user_id'][deleteIndex]))
              });
            }
          }
        }
      } else {
        console.log(json);
      }
    };

    //try reconnects
    this.socket.onclose = function (e) {
      // Too far behind. Revert to server state
      if (typeof show_message === typeof Function) {
        show_message('error');
      }
      if (last_connection != null && last_connection - Date.now() < 3000) {
        connection.state.comm = 'recover';
        retry_count = 1;
        retry_timer = 15;
        if (unauthorized == false) {
          connection.dispatch({
            type: 'recover'
          });
          unauthorized = true;
        }
      } else if (retry_count == 0 && retry_timer == 0) {
        connection.dispatch({
          type: 'recover'
        });
      }
    };
  }
  ws_send(editState, sendable) {
    let {
      steps
    } = sendable;
    this.temp = steps ? steps.steps.map(s => s.toJSON()) : [];
    this.recursive_enquote(this.temp);
    const content = {
      version: (0, _prosemirrorCollab.getVersion)(editState),
      steps: this.temp,
      clientID: steps ? steps.clientID : 0
    };
    let json = JSON.stringify({
      type: 'content',
      data: content
    });
    this.socket.send(json);
    const tr = steps ? (0, _prosemirrorCollab.receiveTransaction)(this.state.edit, steps.steps, repeat(steps.clientID, steps.steps.length)) : this.state.edit.tr;
    this.dispatch({
      type: 'transaction',
      transaction: tr,
      requestDone: true
    });
  }
  ws_recover() {
    if (connection.state.comm == 'recover') {
      recover();
    }
  }
  sendable(editState) {
    const steps = (0, _prosemirrorCollab.sendableSteps)(editState);
    if (steps) {
      return {
        steps
      };
    }
    return null;
  }

  // [FS] IRAD-1040 2020-09-02
  // Send the modified schema to server
  // updateSchema(schema: Schema) {
  //   // to avoid cyclic reference error, use flatted string.
  //   const schemaFlatted = stringify(schema);
  //   this.run(POST(this.ws_url + '/schema/', schemaFlatted, 'text/plain')).then(
  //     data => {
  //       console.log("collab server's schema updated");
  //       // [FS] IRAD-1040 2020-09-08
  //       this.schema = schema;
  //       this.start();
  //     },
  //     err => {
  //       this.report.failure('error');
  //     }
  //   );
  // }

  setView(view) {
    if (this.view) {
      this.view.destroy();
    }
    this.view = window.view = view;
  }
  recursive_enquote(arr) {
    for (var i in arr) {
      if (typeof arr[i] == 'string') {
        // arr[i] = arr[i].replace('\\', '^@$!^%*@^#%#*@$!!');
        arr[i] = arr[i].replace(/"/g, '龘');
        arr[i] = arr[i].replace(/\\/g, '靐');
      }
      if (typeof arr[i] == 'object') {
        this.recursive_enquote(arr[i]);
      }
    }
  }
  recursive_unquote(arr) {
    for (var i in arr) {
      if (typeof arr[i] == 'string') {
        // arr[i] = arr[i].replace('^@$!^%*@^#%#*@$!!', '\\');
        arr[i] = arr[i].replace(/靐/g, '\\');
        arr[i] = arr[i].replace(/龘/g, '"');
      }
      if (typeof arr[i] == 'object') {
        this.recursive_unquote(arr[i]);
      }
    }
  }
}
function recover() {
  clearTimeout(recover);
  if (connection.state.comm == 'recover') {
    if (retry_timer <= 0 && retry_count <= retry_time.length) {
      connection.dispatch({
        type: 'restart'
      });
      if (retry_count < retry_time.length) {
        retry_timer = retry_time[retry_count];
        retry_count = retry_count + 1;
        setTimeout(recover, 1000);
      }
    } else {
      retry_timer = retry_timer - 1;
      setTimeout(recover, 1000);
    }
  } else {
    retry_count = 0;
    retry_timer = 0;
    clearTimeout(recover);
  }
}
function repeat(val, n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(val);
  }
  return result;
}
var _default = exports.default = EditorConnection;