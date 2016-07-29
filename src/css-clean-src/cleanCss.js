const capture = require('./capture/capture');
const sortCss = require('./sortCss/sortCss');
const index = require('./index/index');
const getValue = require('./getValue/getValue');

function CleanCss(string) {
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

CleanCss.prototype.valueOf = function () {
  var cssObject = capture(this, [], 0);

  sortCss(this, cssObject);

  index(cssObject, 0);

  return getValue(this, cssObject);
};

module.exports = function (string) {
  return new CleanCss(string);
};
