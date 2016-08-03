function selector(that, element, siblings) {
  const nested = require('./nested');

  let tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  let v = nested(that, element, siblings);

  let selector = element.selector
    .map(
      (a, i) => i > 0
        ? tab + a
        : a
    )
    .join(',\n');

  let content = v.length
    ? ' {\n' + v + tab + '}'
    : ' {}';

  return element.depth > 0
    ? siblings[0] === element
      ? selector + content
      : '\n' + tab + selector + content
    : selector + content;
}

module.exports = selector;
