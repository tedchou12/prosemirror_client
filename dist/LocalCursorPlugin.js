"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorView = require("prosemirror-view");
require("./ui/czi-cursor-placeholder.css");
const localCursorPluginKey = new _prosemirrorState.PluginKey('LocalCursorPlugin');
function createLocalCursor() {
  const cursor = document.createElement('span');
  cursor.className = 'czi-local-cursor';
  cursor.setAttribute('contenteditable', 'false');
  cursor.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'czi-local-cursor__label';
  label.textContent = editor.user_name;
  cursor.appendChild(label);
  return cursor;
}
class LocalCursorPlugin extends _prosemirrorState.Plugin {
  constructor() {
    super({
      key: localCursorPluginKey,
      props: {
        decorations(state) {
          const cursor = _prosemirrorView.Decoration.widget(state.selection.head, createLocalCursor, {
            key: 'local-cursor',
            side: 1
          });
          return _prosemirrorView.DecorationSet.create(state.doc, [cursor]);
        }
      }
    });
  }
}
var _default = exports.default = LocalCursorPlugin;