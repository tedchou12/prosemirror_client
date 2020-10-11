// @flow

import {
  collab,
  getVersion,
  receiveTransaction,
  sendableSteps,
} from 'prosemirror-collab';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';
import EditorPlugins from '../EditorPlugins';
import EditorSchema from '../EditorSchema';
import uuid from '../uuid';
// [FS] IRAD-1040 2020-09-02

// deprecated with websocket
// import { GET, POST } from './http';
// import { stringify } from 'flatted';

function badVersion(err: Object) {
  return err.status == 400 && /invalid version/i.test(String(err));
}

var connection = null;
var retry_count = 0;
var retry_timer = 0;
var retry_time = [15, 30, 60, 90, 180, 360, 720];

class State {
  edit: EditorState;
  comm: ?string;

  constructor(edit: ?EditorState, comm: ?string) {
    this.edit = edit;
    this.comm = comm;
  }
}

class EditorConnection {
  backOff: number;
  onReady: Function;
  ready: boolean;
  report: any;
  request: any;
  state: State;
  ws_url: string;
  view: ?EditorView;
  schema: Schema;
  socket: any;

  constructor(onReady: Function, report: any, ws_url: string, session_hash: string, user_id: string, doc_id: string) {
    this.schema = null;
    this.report = report;
    this.ws_url = ws_url;
    this.doc_id = doc_id;
    this.user_id = user_id;
    this.client_id = user_id + '#' + uuid();
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
  getEffectiveSchema(): Schema {
    return (null != this.schema) ? this.schema : EditorSchema;
  }

  // All state changes go through this
  dispatch = (action: Object): void => {
    let newEditState = null;
    if (action.type == 'loaded') {
      const editState = EditorState.create({
        doc: action.doc,
        plugins: EditorPlugins.concat([
          collab({
            clientID: this.client_id,
            version: action.version,
          }),
        ]),
      });
      this.state = new State(editState, 'poll');
      this.ready = true;
      this.onReady(editState);
      // this.poll();
      // this.cursor_poll();
    } else if (action.type == 'start') {
      this.state = new State(null, 'start');
      this.ws_start();
    } else if (action.type == 'restart') {
      this.state = new State(null, 'recover');
      this.ws_start();
    } else if (action.type == 'poll') {
      this.state = new State(this.state.edit, 'poll');
    } else if (action.type == 'recover') {
      this.report.failure('error');
      if (typeof(show_message) === typeof(Function)) {
        show_message('error');
      }
      this.state = new State(null, 'recover');
      this.ws_recover();
    } else if (action.type == 'transaction') {
      newEditState = this.state.edit ? this.state.edit.apply(action.transaction) : null;
    }

    if (newEditState) {
      let sendable;
      if (newEditState.doc.content.size > 40000) {
        if (this.state.comm !== 'detached') {
          this.report.failure('Document too big. Detached.');
          if (typeof(show_message) === typeof(Function)) {
            show_message('size_limit');
          }
        }
        this.state = new State(newEditState, 'detached');
      } else if (action.requestDone) {
        this.state = new State(newEditState, 'poll');
        // this.poll();
      } else if (
        (this.state.comm == 'poll') &&
        (sendable = this.sendable(newEditState))
      ) {
        // this.closeRequest();
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
  };

  // Send cursor updates to the server
  cursor_send(selection: Object): void {
    const content = {
                      selection: selection,
                      clientID: this.client_id
                    };
    const json = JSON.stringify({type: 'selection', data: content});
    this.socket.send(json);
  }

  ws_start(): void {
    const ws_url = this.ws_url + '?user_id=' + this.user_id + '&session_hash=' + this.session_hash + '&doc_id=' + this.doc_id;
    this.socket = new WebSocket(ws_url);

    this.socket.onopen = function(e) {
      //does something when socket opens
      if (typeof(add_user) === typeof(Function)) {
        add_user(connection.user_id, window.user_name);
      }
      connection.state.comm = 'start';
      retry_count = 0;
      retry_timer = 0;
      if (typeof(hide_message) === typeof(Function)) {
        hide_message();
      }
    }

    // replaces poll
    this.socket.onmessage = function(e) {
      connection.report.success();
      var data = JSON.parse(e.data);
      var json = data.data;

      if (data.type == 'init') {
        connection.temp = json.doc_json;
        connection.recursive_unquote(connection.temp);
        connection.dispatch({
          type: 'loaded',
          doc: connection.getEffectiveSchema().nodeFromJSON(connection.temp),
          version: json.version,
          users: json.users,
        });
      } else if (data.type == 'step') {
        if (json.steps && json.steps.length) {
          connection.temp = json.steps;
          connection.recursive_unquote(connection.temp);
          const tr = receiveTransaction(
            connection.state.edit,
            connection.temp.map(j => Step.fromJSON(connection.getEffectiveSchema(), j)),
            json.clientIDs
          );
          connection.dispatch({
            type: 'transaction',
            transaction: tr,
            requestDone: false,
          });
        }
      } else if (data.type == 'users') {
        if ('add' in json && json.add.user_id.length) {
          if (typeof(add_user) === typeof(Function)) {
            for (var i in json['add']['user_id']) {
              add_user(json['add']['user_id'][i], json['add']['user_name'][i]);
            }
          }
        }
        if ('delete' in json && json.delete.user_id.length) {
          if (typeof(delete_user) === typeof(Function)) {
            for (var i in json['delete']['user_id']) {
              delete_user(json['delete']['user_id'][i]);
            }
          }
        }
      } else {
        console.log(json);
      }
    }

    //try reconnects
    this.socket.onclose = function(e) {
      // Too far behind. Revert to server state
      if (true) {
        connection.report.failure('error');
        if (typeof(show_message) === typeof(Function)) {
          show_message('error');
        }
        if (retry_count == 0 && retry_timer == 0) {
          connection.dispatch({ type: 'recover' });
        }
      } else {
        connection.closeRequest();
        connection.setView(null);
      }
    }
  }

  ws_send(editState: EditorState, sendable: Object) {
    let { steps } = sendable;
    this.temp = steps ? steps.steps.map(s => s.toJSON()) : [];
    this.recursive_enquote(this.temp);
    const content = {version: getVersion(editState),
                   steps: this.temp,
                   clientID: steps ? steps.clientID : 0};
    let json = JSON.stringify({type: 'content', data: content});
    this.socket.send(json);
    this.report.success();
    const tr = steps
      ? receiveTransaction(
        this.state.edit,
        steps.steps,
        repeat(steps.clientID, steps.steps.length)
      )
      : this.state.edit.tr;

    this.dispatch({
      type: 'transaction',
      transaction: tr,
      requestDone: true,
    });
  }

  ws_recover(): void {
    if (connection.state.comm == 'recover') {
      recover();
    }
  }

  sendable(editState: EditorState): ?{ steps: Array<Step> } {
    const steps = sendableSteps(editState);
    if (steps) {
      return { steps };
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

  closeRequest(): void {
    if (this.request) {
      this.request.abort();
      this.request = null;
    }
  }

  run(request: any): Promise<any> {
    return (this.request = request);
  }

  close(): void {
    this.closeRequest();
    this.setView(null);
  }

  setView(view: EditorView): void {
    if (this.view) {
      this.view.destroy();
    }
    this.view = window.view = view;
  }

  recursive_enquote(arr) {
    for (var i in arr) {
      if (typeof(arr[i]) == 'string') {
        // arr[i] = arr[i].replace('\\', '^@$!^%*@^#%#*@$!!');
        arr[i] = arr[i].replace(/"/g, '龘');
        arr[i] = arr[i].replace(/\\/g, '靐');
      }
      if (typeof(arr[i]) == 'object') {
        this.recursive_enquote(arr[i]);
      }
    }
  }

  recursive_unquote(arr) {
    for (var i in arr) {
      if (typeof(arr[i]) == 'string') {
        // arr[i] = arr[i].replace('^@$!^%*@^#%#*@$!!', '\\');
        arr[i] = arr[i].replace(/靐/g, '\\');
        arr[i] = arr[i].replace(/龘/g, '"');
      }
      if (typeof(arr[i]) == 'object') {
        this.recursive_unquote(arr[i]);
      }
    }
  }
}

function repeat(val: any, n: number): Array<any> {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(val);
  }
  return result;
}

function recover() {
  clearTimeout(recover);
  if (connection.state.comm == 'recover') {
    if (retry_timer <= 0 && retry_count <= retry_time.length) {
      connection.dispatch({ type: 'restart' });
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

export default EditorConnection;
