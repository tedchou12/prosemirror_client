"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformAndPreserveTextSelection;
exports.bpfrpt_proptype_SelectionMemo = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _MarkNames = require("./MarkNames");

var _NodeNames = require("./NodeNames");

var _applyMark = _interopRequireDefault(require("./applyMark"));

var _uuid = _interopRequireDefault(require("./ui/uuid"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bpfrpt_proptype_SelectionMemo = {
  "schema": function () {
    return (typeof _prosemirrorModel.Schema === "function" ? _propTypes.default.instanceOf(_prosemirrorModel.Schema).isRequired : _propTypes.default.any.isRequired).apply(this, arguments);
  },
  "tr": function () {
    return (typeof _prosemirrorTransform.Transform === "function" ? _propTypes.default.instanceOf(_prosemirrorTransform.Transform).isRequired : _propTypes.default.any.isRequired).apply(this, arguments);
  }
};
exports.bpfrpt_proptype_SelectionMemo = bpfrpt_proptype_SelectionMemo;
// Text used to create temporary selection.
// This assumes that no user could enter such string manually.
const PLACEHOLDER_TEXT = `[\u200b\u2800PLACEHOLDER_TEXT_${(0, _uuid.default)()}\u2800\u200b]`; // Perform the transform without losing the perceived text selection.
// The way it works is that this will annotate teh current selection with
// temporary marks and restores the selection with those marks after performing
// the transform.

function transformAndPreserveTextSelection(tr, schema, fn) {
  if (tr.getMeta('dryrun')) {
    // There's no need to preserve the selection in dryrun mode.
    return fn({
      tr,
      schema
    });
  }

  const {
    selection,
    doc
  } = tr;
  const markType = schema.marks[_MarkNames.MARK_TEXT_SELECTION];

  if (!markType || !selection || !doc) {
    return tr;
  }

  if (!(selection instanceof _prosemirrorState.TextSelection)) {
    return tr;
  }

  const {
    from,
    to
  } = selection; // Mark current selection so that we could resume the selection later
  // after changing the whole list.

  let fromOffset = 0;
  let toOffset = 0;
  let placeholderTextNode;

  if (from === to) {
    if (from === 0) {
      return tr;
    } // Selection is collapsed, create a temporary selection that the marks can
    // be applied to.


    const currentNode = tr.doc.nodeAt(from);
    const prevNode = tr.doc.nodeAt(from - 1);
    const nextNode = tr.doc.nodeAt(from + 1);

    if (!currentNode && prevNode && prevNode.type.name === _NodeNames.PARAGRAPH && !prevNode.firstChild) {
      // The selection is at a paragraph node which has no content.
      // Create a temporary text and move selection into that text.
      placeholderTextNode = schema.text(PLACEHOLDER_TEXT);
      tr = tr.insert(from, _prosemirrorModel.Fragment.from(placeholderTextNode));
      toOffset = 1;
    } else if (!currentNode && prevNode && prevNode.type.name === _NodeNames.TEXT) {
      // The selection is at the end of the text node. Select the last
      // character instead.
      fromOffset = -1;
    } else if (prevNode && currentNode && currentNode.type === prevNode.type) {
      // Ensure that the mark is applied to the same type of node.
      fromOffset = -1;
    } else if (nextNode && currentNode && currentNode.type === nextNode.type) {
      toOffset = 1;
    } else if (nextNode) {
      // Could not find the same type of node, assume the next node is safe to use.
      toOffset = 1;
    } else if (prevNode) {
      // Could not find the same type of node, assume the next node is safe to use.
      fromOffset = -1;
    } else {
      // Selection can't be safely preserved.
      return tr;
    }

    tr = tr.setSelection( // [FS] IRAD-1005 2020-07-29
    // Upgrade outdated packages.
    // reset selection using the latest doc.
    // This fixes IRAD-1023
    _prosemirrorState.TextSelection.create(tr.doc, from + fromOffset, to + toOffset));
  } // This is an unique ID (by reference).


  const id = {};

  const findMark = mark => mark.attrs.id === id;

  const findMarkRange = () => {
    let markFrom = 0;
    let markTo = 0;
    tr.doc.descendants((node, pos) => {
      if (node.marks && node.marks.find(findMark)) {
        markFrom = markFrom === 0 ? pos : markFrom;
        markTo = pos + node.nodeSize;
      }

      return true;
    });
    return {
      from: markFrom,
      to: markTo
    };
  }; // TODO: This has side-effect. It will cause `tr.docChanged` to be `true`.
  // No matter whether `fn({tr, schema})` did change the doc or not.


  tr = (0, _applyMark.default)(tr, schema, markType, {
    id
  });
  tr = fn({
    tr,
    schema
  });
  const markRange = findMarkRange();
  const selectionRange = {
    from: Math.max(0, markRange.from - fromOffset),
    to: Math.max(0, markRange.to - toOffset)
  };
  selectionRange.to = Math.max(0, selectionRange.from, selectionRange.to);
  tr = tr.removeMark(markRange.from, markRange.to, markType);

  if (placeholderTextNode) {
    tr.doc.descendants((node, pos) => {
      if (node.type.name === _NodeNames.TEXT && node.text === PLACEHOLDER_TEXT) {
        tr = tr.delete(pos, pos + PLACEHOLDER_TEXT.length);
        placeholderTextNode = null;
        return false;
      }

      return true;
    });
  }

  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, selectionRange.from, selectionRange.to));
  return tr;
}