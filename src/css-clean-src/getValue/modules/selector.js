function selector(settings, element, siblings) {
  const nested = require('./nested');

  let tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  let v = nested(settings, element, siblings);

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

  console.log(element.selector);

  return element.depth > 0
    ? siblings[0] === element
      ? selector + content
      : '\n' + tab + selector + content
    : selector + content;
}

module.exports = selector;
