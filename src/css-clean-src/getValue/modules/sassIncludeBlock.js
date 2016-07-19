const nested = require('./nested');

function sassIncludeBlock(that, element, parent) {
  var tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  var content = nested(that, element, parent);
  return `${element.name} ${element.value} {\n${content}${tab}}`;
}

module.exports = sassIncludeBlock;
