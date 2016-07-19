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
  this.align = false;
  this.sortMainScope = false;
  this.sortBlockScope = true;
  this.propertyGroupOrder = list.properties;
  this.tabSize = 2;
  // This is wrapped this way so that when the object is passed, the string
  // can be mutated -- yes, I want mutation in this case.
  this.value = { string : string.trim() };
}

CleanCss.prototype.align = function () {
  this.align = true;
};

CleanCss.prototype.indent = function (length, type) {
  this.tabChar = type === 'space'
    ? ' '
    : type === 'tab'
      ? '\t'
      : undefined;
};

CleanCss.prototype.setLineBreak = function (length) {
  this.lineBreak = length;
};

CleanCss.prototype.sortBlockScope = function () {
  this.sortBlockScope = true;
};

CleanCss.prototype.sortMainScope = function () {
  this.sortMainScope = true;
};

CleanCss.prototype.value = function () {
  var cssObject = capture(this, [], 0);

  sortCss(this, cssObject);

  return getValue(this, cssObject);
};

module.exports = function (string) {
  return CleanCss(string);
};
