const nested = require('./nested');

function fontFace(that, element, parent) {
  var tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  var selector = element.selector.join(',\n');
  var v = nested(that, element, parent);

  return `${selector} {\n${v}${tab}}`;
}

module.exports = fontFace;
