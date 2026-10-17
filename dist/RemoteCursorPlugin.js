"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.receiveRemoteCursor = receiveRemoteCursor;
exports.removeRemoteCursorsForUser = removeRemoteCursorsForUser;
var _prosemirrorState = require("prosemirror-state");
var _prosemirrorTransform = require("prosemirror-transform");
var _prosemirrorView = require("prosemirror-view");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, e) { if ("object" != typeof t || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
const remoteCursorPluginKey = new _prosemirrorState.PluginKey('RemoteCursorPlugin');
function createRemoteCursor(cursor) {
  // const color = cursorColor(cursor.clientID);
  const color = cursor.color;
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
function clampPosition(position, maxPosition) {
  return Math.max(0, Math.min(position, maxPosition));
}
function decorationsFor(state, cursors) {
  const decorations = [];
  const maxPosition = state.doc.content.size;
  cursors.forEach(cursor => {
    const anchor = clampPosition(cursor.anchor, maxPosition);
    const head = clampPosition(cursor.head, maxPosition);
    decorations.push(_prosemirrorView.Decoration.widget(head, () => createRemoteCursor(cursor), {
      key: `remote-cursor-${cursor.clientID}`,
      side: 1
    }));
    const from = Math.min(anchor, head);
    const to = Math.max(anchor, head);
    if (from < to) {
      decorations.push(_prosemirrorView.Decoration.inline(from, to, {
        style: `background-color: ${cursor.color}`
      }, {
        inclusiveEnd: true,
        inclusiveStart: true
      }));
    }
  });
  return _prosemirrorView.DecorationSet.create(state.doc, decorations);
}
function isRemoteCursor(value) {
  return value && typeof value.clientID === 'string' && typeof value.userId === 'string' && typeof value.anchor === 'number' && Number.isInteger(value.anchor) && typeof value.head === 'number' && Number.isInteger(value.head) && typeof value.color === 'string';
}
function receiveRemoteCursor(state, data) {
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
    color: String(data.color)
  };
  if (!isRemoteCursor(cursor)) {
    return null;
  }
  return state.tr.setMeta(remoteCursorPluginKey, {
    cursor
  });
}
function removeRemoteCursorsForUser(state, userId) {
  return state.tr.setMeta(remoteCursorPluginKey, {
    removeUserId: userId
  });
}
class RemoteCursorPlugin extends _prosemirrorState.Plugin {
  constructor() {
    super({
      key: remoteCursorPluginKey,
      state: {
        init() {
          return [];
        },
        apply(tr, previous, oldState, newState) {
          const maxPosition = newState.doc.content.size;
          let cursors = previous.map(cursor => _objectSpread(_objectSpread({}, cursor), {}, {
            anchor: clampPosition(tr.mapping.map(cursor.anchor, -1), maxPosition),
            head: clampPosition(tr.mapping.map(cursor.head, 1), maxPosition)
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
        }
      },
      props: {
        decorations(state) {
          return decorationsFor(state, remoteCursorPluginKey.getState(state));
        }
      }
    });
  }
}
var _default = exports.default = RemoteCursorPlugin;