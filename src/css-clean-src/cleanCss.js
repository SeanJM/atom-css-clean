const capture = require('./capture/capture');
const sortCss = require('./sortCss/sortCss');
const index = require('./index/index');
const getValue = require('./getValue/getValue');

function CleanCss(string) {
  this.buffer = { string : string.trim() };
  this.lineBreak = 80;
  this.tabSize = 2;
  this.tabChar = ' ';
}

CleanCss.prototype.indent = function (length, char) {
  this.tabSize = length;
  this.tabChar = char;
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

CleanCss.prototype.getTab = function (depth) {
  return new Array((depth * this.tabSize) + 1).join(this.tabChar);
};

module.exports = function (string) {
  return new CleanCss(string);
};
