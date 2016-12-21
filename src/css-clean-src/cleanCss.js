const capture = require('./capture/capture');
const sortCss = require('./sortCss/sortCss');
const index = require('./index/index');
const getValue = require('./getValue/getValue');

function CleanCss(string) {
  let tabs = string.match(/^\s+/m);
  this.buffer = { string : string.trim() };
  this.lineBreak = 80;
  this.tabSize = tabs
    ? tabs[0].length
    : 2;
}

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

CleanCss.prototype.getTab = function (depth) {
  return new Array((depth * this.tabSize) + 1).join(this.tabChar);
};

module.exports = function (string) {
  return new CleanCss(string);
};
