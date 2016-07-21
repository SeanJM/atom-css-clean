const capture = require('./capture/capture');
const sortCss = require('./sortCss/sortCss');
const index = require('./index/index');

function CleanCss(string) {
  this.alignTogether = [
    'property group',
    'sass import',
    'sass include',
    'sass include arguments',
    'sass extend',
    'sass variable assignment',
  ];

  this.blockScopeOrder = [
    'sass import',
    'sass variable assignment',
    'sass extend',
    'sass include',
    'sass include arguments',
    'property group',
    'sass include block',
    'selector',
    'sass return'
  ];

  this.lineBreak = 80;
  this.isAlign = false;
  this.tabSize = 2;
  // This is wrapped this way so that when the object is passed, the string
  // can be mutated -- yes, I want mutation in this case.
  this.value = { string : string.trim() };
}

CleanCss.prototype.align = function () {
  this.isAlign = true;
  return this;
};

CleanCss.prototype.indent = function (length, type) {
  this.tabChar = type === 'space'
    ? ' '
    : type === 'tab'
      ? '\t'
      : undefined;
  return this;
};

CleanCss.prototype.setLineBreak = function (length) {
  this.lineBreak = length;
  return this;
};

CleanCss.prototype.value = function () {
  var cssObject = capture(this, [], 0);

  sortCss(this, cssObject);

  index(cssObject, 0);

  return getValue(this, cssObject);
};

module.exports = function (string) {
  return new CleanCss(string);
};
