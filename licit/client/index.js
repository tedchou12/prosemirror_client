// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';

import Licit from '../../src/client/Licit';
import CustomLicitRuntime from './CustomLicitRuntime';

function main(): void {
  let el = null;
  if (window.lang) {
    el = document.getElementById('doc_editor');
  } else {
    el = document.createElement('div');
    el.id = 'licit-app';
    el.style.setProperty('width', '100vw');
    el.style.setProperty('height', '100vh');
    const { body } = document;
    body && body.appendChild(el);
  }

  const docJSON = {"type":"doc","attrs":{"layout":null,"padding":null,"width":null},"content":[{"type":"paragraph","attrs":{"align":null,"color":null,"id":null,"indent":null,"lineSpacing":null,"paddingBottom":null,"paddingTop":null,"objectId":null},"content":[{"type":"text","text":" "}]}]};
  // Use this (set to null) if need a empty editor.
  // docJSON = null;
  // [FS] IRAD-982 2020-06-10
  // Use the licit component for demo.

  // To pass runtime to handle the upload image from angular App
  // null means it will take licit EditorRuntime
  const runTime = new CustomLicitRuntime();

  const service = 'doc_editor';
  const ws_url = (window.ws_url) ? window.ws_url : 'ws://192.168.1.2:8800';
  const doc_id = (window.doc_id) ? window.doc_id : 2045;
  const session_hash = (window.session_hash) ? window.session_hash : 'NWY3YjBkOTg0MDI2YQ==';
  const read_only = (window.read_only) ? window.read_only : false;
  const user_id = window.user_id ? window.user_id : 5;
  const width = '100vw';
  const height = '100vh';

  // To pass prosemirror plugins to editor pass it to plugins property which accept array of plugin object.
  // null means no custom plugins to pass
  // the plugin object must contain a method getEffectiveSchema() which accept schema and returns schema.
  const plugins = null;
  ReactDOM.render(<Licit ws_url={ws_url} session_hash={session_hash} docID={doc_id} debug={false} user_id={user_id}
    width={width} height={height} onChange={onChangeCB} onReady={onReadyCB} data={docJSON} embedded={false}
    readOnly={read_only} runtime={null} plugins={plugins} />, el);
}

function onChangeCB(data) {
  // console.log('data: ' + JSON.stringify(data));
}

function onReadyCB(ref) {
  // console.log('ref: ' + ref);
}

window.onload = main;
