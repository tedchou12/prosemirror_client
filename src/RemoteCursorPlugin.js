// @flow

import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { Decoration, DecorationSet } from 'prosemirror-view';

type RemoteCursor = {
  clientID: string,
  userId: string,
  userName: string,
  anchor: number,
  head: number,
};

const remoteCursorPluginKey = new PluginKey('RemoteCursorPlugin');

function cursorColor(clientID: string): string {
  return `hsl(${colorHue(clientID)}, 72%, 42%)`;
}

function colorHue(clientID: string): number {
  let hash = 0;
  for (let i = 0; i < clientID.length; i += 1) {
    hash = (hash * 31 + clientID.charCodeAt(i)) | 0;
  }
  return (hash >>> 0) % 360;
}

function createRemoteCursor(cursor: RemoteCursor): HTMLElement {
  const color = cursorColor(cursor.clientID);
  // const color = cursorColor(window.doc_id + cursor.userId);
  const marker = document.createElement('span');
  marker.className = 'czi-remote-cursor';
  marker.setAttribute('contenteditable', 'false');
  marker.setAttribute('aria-hidden', 'true');
  marker.style.borderLeftColor = color;

  const label = document.createElement('span');
  label.className = 'czi-remote-cursor__label';
  label.textContent = cursor.userName;
  label.style.backgroundColor = color;
  marker.appendChild(label);

  return marker;
}

function clampPosition(position: number, maxPosition: number): number {
  return Math.max(0, Math.min(position, maxPosition));
}

function decorationsFor(state: EditorState, cursors: Array<RemoteCursor>): DecorationSet {
  const decorations = [];
  const maxPosition = state.doc.content.size;

  cursors.forEach(cursor => {
    const anchor = clampPosition(cursor.anchor, maxPosition);
    const head = clampPosition(cursor.head, maxPosition);

    decorations.push(Decoration.widget(
      head,
      () => createRemoteCursor(cursor),
      { key: `remote-cursor-${cursor.clientID}`, side: 1 },
    ));

    const from = Math.min(anchor, head);
    const to = Math.max(anchor, head);
    if (from < to) {
      decorations.push(Decoration.inline(from, to, {
        style: `background-color: hsla(${colorHue(cursor.clientID)}, 72%, 58%, 0.25)`,
      }, {
        inclusiveEnd: true,
        inclusiveStart: true,
      }));
    }
  });

  return DecorationSet.create(state.doc, decorations);
}

function isRemoteCursor(value: any): boolean {
  return value &&
    typeof value.clientID === 'string' &&
    typeof value.userId === 'string' &&
    typeof value.anchor === 'number' &&
    Number.isInteger(value.anchor) &&
    typeof value.head === 'number' &&
    Number.isInteger(value.head);
}

export function receiveRemoteCursor(state: EditorState, data: any): ?Transform {
  if (!data || typeof data !== 'object') {
    return null;
  }
  const selection = data.selection || data;
  const cursor = {
    clientID: data.clientID,
    userId: String(data.userId),
    userName: String(data.userName),
    anchor: selection.anchor,
    head: selection.head,
  };
  if (!isRemoteCursor(cursor)) {
    return null;
  }
  return state.tr.setMeta(remoteCursorPluginKey, { cursor });
}

export function removeRemoteCursorsForUser(
  state: EditorState,
  userId: string,
): Transform {
  return state.tr.setMeta(remoteCursorPluginKey, { removeUserId: userId });
}

class RemoteCursorPlugin extends Plugin {
  constructor() {
    super({
      key: remoteCursorPluginKey,
      state: {
        init() {
          return [];
        },
        apply(tr, previous: Array<RemoteCursor>, oldState, newState): Array<RemoteCursor> {
          const maxPosition = newState.doc.content.size;
          let cursors = previous.map(cursor => ({
            ...cursor,
            anchor: clampPosition(tr.mapping.map(cursor.anchor, -1), maxPosition),
            head: clampPosition(tr.mapping.map(cursor.head, 1), maxPosition),
          }));

          const action = tr.getMeta(remoteCursorPluginKey);
          if (action && action.removeUserId) {
            cursors = cursors.filter(cursor => cursor.userId !== action.removeUserId);
          }
          if (action && action.cursor) {
            const index = cursors.findIndex(cursor => cursor.clientID === action.cursor.clientID);
            if (index === -1) {
              cursors.push(action.cursor);
            } else {
              cursors[index] = action.cursor;
            }
          }
          return cursors;
        },
      },
      props: {
        decorations(state) {
          return decorationsFor(state, remoteCursorPluginKey.getState(state));
        },
      },
    });
  }
}

export default RemoteCursorPlugin;
