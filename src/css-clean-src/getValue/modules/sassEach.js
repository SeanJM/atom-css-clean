const nested = require('./nested');

function align(element, value, tab) {
  var i = 1;
  var n = value.length;
  var nameSpacing = new Array(element.name.length + 2).join(' ');
  var spacing = new Array(value[0].substr(0, value[0].indexOf('(')).length + 1).join(' ');

  value[0] = element.name + ' ' + value[0];

  for (; i < n; i++) {
    value[i] = tab + nameSpacing + spacing + value[i];
  }

  return value.join(', \n');
}

function notAlign(element, value, tab) {
  var i = 1;
  var n = value.length;

  value[0] = element.name + ' ' + value[0];

  for (; i < n; i++) {
    value[i] = tab + value[i];
  }

  return value.join(',\n');
}

function sassEach(that, element, parent) {
  const tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);

  let content = nested(that, element, parent);
  let value = splitByComma(element.value);

  let each = that.isAligned
    ? align(element, value, tab)
    : notAlign(element, value, tab);

  return `${each} {\n${value}${tab}}`;
}

module.exports = sassEach;
