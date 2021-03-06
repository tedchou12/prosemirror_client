"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorCommands = require("prosemirror-commands");

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorView = require("prosemirror-view");

var _applyMark = _interopRequireDefault(require("./applyMark"));

var _MarkNames = require("./MarkNames");

var _NodeNames = require("./NodeNames");

var _noop = _interopRequireDefault(require("./noop"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// [FS] IRAD-1042 2020-09-14
// Fix: To display selected style.
function toggleCustomStyle(markType, attrs, state, tr, dispatch) {
  var ref = state.selection;
  var empty = ref.empty;
  var $cursor = ref.$cursor;
  var ranges = ref.ranges;

  if (empty && !$cursor || !markApplies(state.doc, ranges, markType)) {
    return false;
  }

  if (dispatch) {
    if ($cursor) {
      if (markType.isInSet(state.storedMarks || $cursor.marks())) {
        dispatch(tr.removeStoredMark(markType));
      } else {
        dispatch(tr.addStoredMark(markType.create(attrs)));
      }
    } else {
      // var has = false;
      // for (var i = 0; !has && i < ranges.length; i++) {
      //   var ref$1 = ranges[i];
      //   var $from = ref$1.$from;
      //   var $to = ref$1.$to;
      //   has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
      // }
      for (var i$1 = 0; i$1 < ranges.length; i$1++) {
        var ref$2 = ranges[i$1];
        var $from$1 = ref$2.$from;
        var $to$1 = ref$2.$to; // if (has) {
        //   tr.removeMark($from$1.pos, $to$1.pos, markType);
        // } else {

        tr.addMark($from$1.pos, $to$1.pos, markType.create(attrs)); // }
      }

      return tr;
    }
  }

  return true;
}

function markApplies(doc, ranges, type) {
  var loop = function (i) {
    var ref = ranges[i];
    var $from = ref.$from;
    var $to = ref.$to;
    var can = $from.depth == 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, function (node) {
      if (can) {
        return false;
      }

      can = node.inlineContent && node.type.allowsMarkType(type);
    });

    if (can) {
      return {
        v: true
      };
    }
  };

  for (var i = 0; i < ranges.length; i++) {
    var returned = loop(i);
    if (returned) return returned.v;
  }

  return false;
}

function setCustomInlineStyle(tr, schema, customStyles) {
  const markType = schema.marks[_MarkNames.MARK_CUSTOMSTYLES];

  if (!markType) {
    return tr;
  }

  const {
    selection
  } = tr;

  if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    return tr;
  }

  var attrs = customStyles;
  tr = (0, _applyMark.default)(tr, schema, markType, attrs);
  return tr;
}

class CustomStyleCommand extends _UICommand.default {
  constructor(customStyle, customStyleName) {
    super();

    _defineProperty(this, "_customStyleName", void 0);

    _defineProperty(this, "_customStyle", []);

    _defineProperty(this, "getTheInlineStyles", isInline => {
      var attrs = {};
      var propsCopy = [];
      propsCopy = Object.assign(propsCopy, this._customStyle);
      propsCopy.forEach(style => {
        attrs = Object.assign(attrs, style);
        Object.entries(style).forEach((_ref) => {
          let [key, value] = _ref;

          if (isInline && typeof value === 'boolean') {
            delete attrs[key];
          } else if (!isInline && typeof value != 'boolean') {
            delete attrs[key];
          }
        });
      });
      return attrs;
    });

    _defineProperty(this, "isEmpty", obj => {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }

      return true;
    });

    _defineProperty(this, "isEnabled", state => {
      return true;
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      var {
        schema,
        selection,
        tr
      } = state;

      if (this._customStyle) {
        var inlineStyles = this.getTheInlineStyles(true);

        if (!this.isEmpty(inlineStyles)) {
          tr = setCustomInlineStyle(tr.setSelection(selection), schema, inlineStyles);
        }

        var commonStyle = this.getTheInlineStyles(false);

        for (let key in commonStyle) {
          let markType = schema.marks[key];
          tr = toggleCustomStyle(markType, undefined, state, tr, dispatch);
        }
      }

      if (tr.docChanged || tr.storedMarksSet) {
        // If selection is empty, the color is added to `storedMarks`, which
        // works like `toggleMark`
        // (see https://prosemirror.net/docs/ref/#commands.toggleMark).
        dispatch && dispatch(tr);
        return true;
      }

      return false;
    });

    this._customStyle = customStyle;
    this._customStyleName = customStyleName;
  }

  _findHeading(state) {
    const heading = state.schema.nodes[_NodeNames.HEADING];
    const fn = heading ? (0, _prosemirrorUtils.findParentNodeOfType)(heading) : _noop.default;
    return fn(state.selection);
  }

}

var _default = CustomStyleCommand;
exports.default = _default;