const splitByComma = require('../../vendor/splitByComma');
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

function sassEach(that, element, siblings) {
  const tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);

  let content = nested(that, element, siblings);
  let value = splitByComma(element.value);

  let each = align(element, value, tab);

  return `${each} {\n${content}${tab}}`;
}

module.exports = sassEach;
