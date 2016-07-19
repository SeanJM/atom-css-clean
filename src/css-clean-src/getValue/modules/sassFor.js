const nested = require('./nested');

function sassFor(that, element, parent) {
  var tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  var value = nested(that, element, parent);
  return `${element.name} ${element.value} {\n${value}${tab}}`;
}

module.exports = sassFor;
