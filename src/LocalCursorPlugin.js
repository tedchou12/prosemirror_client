// @flow

import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import './ui/czi-cursor-placeholder.css';

const localCursorPluginKey = new PluginKey('LocalCursorPlugin');

function createLocalCursor(): HTMLElement {
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

class LocalCursorPlugin extends Plugin {
  constructor() {
    super({
      key: localCursorPluginKey,
      props: {
        decorations(state) {
          const cursor = Decoration.widget(
            state.selection.head,
            createLocalCursor,
            { key: 'local-cursor', side: 1 },
          );
          return DecorationSet.create(state.doc, [cursor]);
        },
      },
    });
  }
}

export default LocalCursorPlugin;
