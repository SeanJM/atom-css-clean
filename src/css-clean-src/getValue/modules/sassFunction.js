const nested = require('./nested');

function sassFunction(that, element, parent) {
  var args = `(${element.arguments.join(', ')})`;
  var tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  var content = nested(that, element, parent);
  return `${tab}${element.name} ${element.value}${args} {\n${content}${tab}}`;
}

module.exports = sassFunction;
