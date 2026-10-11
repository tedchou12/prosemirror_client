"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_SymbolDefination = exports.bpfrpt_proptype_MathQuillEditorSymbol = exports.VERT = exports.VDASH = exports.UNION = exports.UNDERLINE = exports.TRIG = exports.TRIANGLE = exports.TIMES = exports.THETA = exports.TAN = exports.SYMBOLS = exports.SUPERSETEQ = exports.SUPERSET = exports.SUM = exports.SUBSETEQ = exports.SUBSET = exports.SUBSCRIPT = exports.STRUCTURE = exports.SQRT2 = exports.SQRT = exports.SQR = exports.SMALLE = exports.SIN = exports.SIMEQ = exports.SIM = exports.POWER = exports.PM = exports.PLUS = exports.PI = exports.PHI = exports.PERP = exports.PARENS = exports.OVERLINE = exports.OPERATORS = exports.NEQ = exports.MINUS = exports.LTE = exports.LT = exports.LOG_E = exports.INTXY = exports.INTERSECT = exports.INT = exports.INFINITY = exports.IMAGINARY = exports.GTE = exports.GT = exports.FRAC = exports.EQUAL = exports.DOTM = exports.DOLLAR = exports.DIVIDE = exports.DEGREES = exports.CTIMES = exports.COS = exports.CONG = exports.CENT = exports.BRACKETS = exports.ARROWRL = exports.ARROWLLR = exports.ARROWLL = exports.ARCTAN = exports.ARCSIN = exports.ARCCOS = exports.APPROX = exports.ANGLE = exports.ABSOLUTE = void 0;
var _i18n = _interopRequireDefault(require("../i18n"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var bpfrpt_proptype_MathQuillEditorSymbol = exports.bpfrpt_proptype_MathQuillEditorSymbol = {
  "label": _propTypes.default.string.isRequired,
  "latex": _propTypes.default.string.isRequired,
  "description": _propTypes.default.string.isRequired,
  "cmd": _propTypes.default.string.isRequired
};
var bpfrpt_proptype_SymbolDefination = exports.bpfrpt_proptype_SymbolDefination = {
  // The label shown at the command button.
  "label": _propTypes.default.string.isRequired,
  // The latex to use
  "latex": _propTypes.default.string.isRequired,
  // The mathquill command to perform.
  // http://docs.mathquill.com/en/latest/Api_Methods/#writelatex_string
  // "write": Write the given LaTeX at the current cursor position. If the
  //   cursor does not have focus, writes to last position the cursor occupied
  //   in the editable field.
  // "cmd": Enter a LaTeX command at the current cursor position or with the
  //   current selection. If the cursor does not have focus, it writes it to
  //   last position the cursor occupied in the editable field.
  "cmd": _propTypes.default.oneOf(["cmd", "write"]).isRequired,
  // the description of the command.
  "description": _propTypes.default.string.isRequired
};
// It's hard to find a full list of latex symbols that we could use.
// Here's are some references that might be helpful.
// https://github.com/mathquill/mathquill/blob/23a0e88c80c79514ffc30ead490bd880306bce2a/src/commands/math/basicSymbols.js
// http://math.chapman.edu/~jipsen/mathquill/test/MathQuillsymbolsMathJax.html
// https://inspera.atlassian.net/wiki/spaces/KB/pages/62062830/MathQuill+symbols
// https://www.rapidtables.com/math/symbols/Basic_Math_Symbols.html
// https://www.math.uci.edu/~xiangwen/pdf/LaTeX-Math-Symbols.pdf

const ABSOLUTE = exports.ABSOLUTE = {
  label: '|x|',
  latex: '|',
  description: 'Absolute Value',
  cmd: 'cmd'
};
const ANGLE = exports.ANGLE = {
  label: '\\angle',
  latex: '\\angle',
  description: 'Angle',
  cmd: 'write'
};
const APPROX = exports.APPROX = {
  label: '\\approx',
  latex: '\\approx',
  description: 'Approximation',
  cmd: 'cmd'
};
const ARCCOS = exports.ARCCOS = {
  label: '\\arccos',
  latex: '\\arccos',
  description: 'Arc Cos',
  cmd: 'write'
};
const ARCSIN = exports.ARCSIN = {
  label: '\\arcsin',
  latex: '\\arcsin',
  description: 'Arc Sin',
  cmd: 'write'
};
const ARCTAN = exports.ARCTAN = {
  label: '\\arctan',
  latex: '\\arctan',
  description: 'Arc Tan',
  cmd: 'write'
};
const ARROWLL = exports.ARROWLL = {
  label: '\\Longleftarrow',
  latex: '\\Longleftarrow',
  description: 'Long Left Arrow',
  cmd: 'write'
};
const ARROWRL = exports.ARROWRL = {
  label: '\\Longrightarrow',
  latex: '\\Longrightarrow',
  description: 'Long Right Arrow',
  cmd: 'write'
};
const ARROWLLR = exports.ARROWLLR = {
  label: '\\Longleftrightarrow',
  latex: '\\Longleftrightarrow',
  description: 'Long Left Right Arrow',
  cmd: 'write'
};
const BRACKETS = exports.BRACKETS = {
  label: '[x]',
  latex: '[',
  description: 'Brackets',
  cmd: 'cmd'
};
const CENT = exports.CENT = {
  label: '¢',
  latex: '¢',
  description: 'Cent',
  cmd: 'write'
};
const COS = exports.COS = {
  label: '\\cos',
  latex: '\\cos',
  description: 'Cos',
  cmd: 'write'
};
const CONG = exports.CONG = {
  label: '\\cong',
  latex: '\\cong',
  description: 'Congruent To',
  cmd: 'write'
};
const CTIMES = exports.CTIMES = {
  label: '\\otimes',
  latex: '\\otimes',
  description: 'Tensor Product',
  cmd: 'write'
};
const DEGREES = exports.DEGREES = {
  label: '\\deg',
  latex: '\\deg',
  description: 'Degrees',
  cmd: 'write'
};
const DIVIDE = exports.DIVIDE = {
  label: '\u00F7',
  latex: '\\divide',
  description: 'Division',
  cmd: 'cmd'
};
const DOLLAR = exports.DOLLAR = {
  label: '$',
  latex: '$',
  description: 'Dollar',
  cmd: 'write'
};
const DOTM = exports.DOTM = {
  label: '\\cdot',
  latex: '\\cdot',
  description: 'Dot for Multiplication',
  cmd: 'write'
};
const EQUAL = exports.EQUAL = {
  label: '=',
  latex: '=',
  description: 'Equal',
  cmd: 'cmd'
};
const FRAC = exports.FRAC = {
  label: '\\frac {x}{y}',
  latex: '\\frac',
  description: 'Fraction',
  cmd: 'cmd'
};
const GT = exports.GT = {
  label: '>',
  latex: '>',
  description: 'Greater Than',
  cmd: 'cmd'
};
const GTE = exports.GTE = {
  label: '\\ge',
  latex: '\\ge',
  description: 'Greater Than or Equal To',
  cmd: 'cmd'
};
const IMAGINARY = exports.IMAGINARY = {
  label: 'i',
  latex: 'i',
  description: 'Imaginary Number',
  cmd: 'write'
};
const INFINITY = exports.INFINITY = {
  label: '\\infty',
  latex: '\\infty',
  description: 'Infinity',
  cmd: 'write'
};
const INT = exports.INT = {
  label: '\\int',
  latex: '\\int',
  description: 'Integral',
  cmd: 'cmd'
};
const INTERSECT = exports.INTERSECT = {
  label: '\\cap',
  latex: '\\cap',
  description: 'Intersection',
  cmd: 'write'
};
const INTXY = exports.INTXY = {
  label: '\\int_{x}^{y}',
  latex: '\\int_{x}^{y}',
  description: 'Integral',
  cmd: 'write'
};
const LOG_E = exports.LOG_E = {
  label: '\\log',
  latex: '\\log',
  description: 'Log',
  cmd: 'cmd'
};
const LT = exports.LT = {
  label: '<',
  latex: '<',
  description: 'Less Than',
  cmd: 'cmd'
};
const LTE = exports.LTE = {
  label: '\\le',
  latex: 'le',
  description: 'Less Than or Equal To',
  cmd: 'cmd'
};
const MINUS = exports.MINUS = {
  label: '-',
  latex: '-',
  description: 'Subtraction',
  cmd: 'cmd'
};
const NEQ = exports.NEQ = {
  label: '\\neq',
  latex: '\\neq',
  description: 'Not Equal',
  cmd: 'write'
};
const OVERLINE = exports.OVERLINE = {
  label: '\\overline\u3000',
  latex: '\\overline',
  description: 'Overline',
  cmd: 'cmd'
};
const PARENS = exports.PARENS = {
  label: '(x)',
  latex: '(',
  description: 'Parentheses',
  cmd: 'cmd'
};
const PERP = exports.PERP = {
  label: '\\perp',
  latex: '\\perp',
  description: 'Perpendicular Lines',
  cmd: 'write'
};
const PHI = exports.PHI = {
  label: '\\phi',
  latex: '\\phi',
  description: 'Phi',
  cmd: 'write'
};
const PI = exports.PI = {
  label: '\\pi',
  latex: '\\pi',
  description: 'Pi',
  cmd: 'write'
};
const PLUS = exports.PLUS = {
  label: '+',
  latex: '+',
  description: 'Addition',
  cmd: 'cmd'
};
const PM = exports.PM = {
  label: '\\pm',
  latex: '\\pm',
  description: 'Plus-Minus',
  cmd: 'cmd'
};
const POWER = exports.POWER = {
  label: 'x^{y}',
  latex: '^',
  description: 'Power',
  cmd: 'cmd'
};
const SIMEQ = exports.SIMEQ = {
  label: '\\simeq',
  latex: '\\simeq',
  description: 'Approximately Equal',
  cmd: 'write'
};
const SIM = exports.SIM = {
  label: '\\sim',
  latex: '\\sim',
  description: 'Similarity',
  cmd: 'write'
};
const SIN = exports.SIN = {
  label: '\\sin',
  latex: '\\sin',
  description: 'Sin',
  cmd: 'write'
};
const SMALLE = exports.SMALLE = {
  label: '\u212F',
  latex: '\u212F',
  description: 'Script Small E',
  cmd: 'write'
};
const SQR = exports.SQR = {
  label: 'x^{2}',
  latex: '^{2}',
  description: 'Square',
  cmd: 'write'
};
const SQRT2 = exports.SQRT2 = {
  label: '\\sqrt[x]{y}',
  latex: '\\sqrt[x]{y}',
  description: 'Square Root Alt',
  cmd: 'write'
};
const SQRT = exports.SQRT = {
  label: '\\sqrt x',
  latex: '\\sqrt',
  description: 'Square Root',
  cmd: 'cmd'
};
const SUBSCRIPT = exports.SUBSCRIPT = {
  label: 'x_{2}',
  latex: '_{2}',
  description: 'Subscript',
  cmd: 'write'
};
const SUBSET = exports.SUBSET = {
  label: '\\sub',
  latex: '\\sub',
  description: 'Subset',
  cmd: 'write'
};
const SUBSETEQ = exports.SUBSETEQ = {
  label: '\\sube',
  latex: '\\sube',
  description: 'Subset or Equal',
  cmd: 'write'
};
const SUM = exports.SUM = {
  label: '\\sum',
  latex: '\\sum',
  description: 'Summation',
  cmd: 'cmd'
};
const SUPERSET = exports.SUPERSET = {
  label: '\\supset',
  latex: '\\supset',
  description: 'Superset',
  cmd: 'write'
};
const SUPERSETEQ = exports.SUPERSETEQ = {
  label: '\\supe',
  latex: '\\supe',
  description: 'Superset or Equal',
  cmd: 'write'
};
const TAN = exports.TAN = {
  label: '\\tan',
  latex: '\\tan',
  description: 'Tan',
  cmd: 'write'
};
const THETA = exports.THETA = {
  label: '\\theta',
  latex: '\\theta',
  description: 'Theta',
  cmd: 'write'
};
const TIMES = exports.TIMES = {
  label: '\\times',
  latex: '\\times',
  description: 'Multiplication',
  cmd: 'cmd'
};
const TRIANGLE = exports.TRIANGLE = {
  label: '\\bigtriangleup',
  latex: '\\bigtriangleup',
  description: 'Triangle',
  cmd: 'write'
};
const UNDERLINE = exports.UNDERLINE = {
  label: '\\underline\u3000',
  latex: '\\underline',
  description: 'Underline',
  cmd: 'cmd'
};
const UNION = exports.UNION = {
  label: '\\cup',
  latex: '\\cup',
  description: 'Union',
  cmd: 'write'
};
const VDASH = exports.VDASH = {
  label: '\\vdash',
  latex: '\\vdash',
  description: 'Vertical and Dash Line',
  cmd: 'write'
};
const VERT = exports.VERT = {
  label: '\\vert',
  latex: '\\vert',
  description: 'Vertical Line',
  cmd: 'write'
};
const OPERATORS = exports.OPERATORS = {
  title: [(0, _i18n.default)('Operators')],
  symbols: [PLUS, MINUS, TIMES, DOTM, DIVIDE, EQUAL, APPROX, SIM, SIMEQ, CONG, NEQ, PM, LT, GT, LTE, GTE, UNION, INTERSECT, SUBSET, SUBSETEQ, SUPERSET, SUPERSETEQ, VERT, CTIMES]
};
const STRUCTURE = exports.STRUCTURE = {
  title: [(0, _i18n.default)('Structure')],
  symbols: [SUM, FRAC, PARENS, BRACKETS, SQR, SUBSCRIPT, ABSOLUTE, INTXY, OVERLINE, UNDERLINE, POWER, INT, SQRT, SQRT2, LOG_E]
};
const SYMBOLS = exports.SYMBOLS = {
  title: [(0, _i18n.default)('Symbols')],
  symbols: [SMALLE, ANGLE, PI, IMAGINARY, DEGREES, THETA, PHI, TRIANGLE, INFINITY, DOLLAR, CENT, VDASH, PERP, ARROWLL, ARROWRL, ARROWLLR]
};
const TRIG = exports.TRIG = {
  title: [(0, _i18n.default)('Trigonometry')],
  symbols: [SIN, COS, TAN, ARCSIN, ARCCOS, ARCTAN]
};