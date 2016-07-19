function selector(settings, element, siblings) {
  let tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  let v = nested(settings, element, parent);

  let selector = element.selector
    .map((a, i) => i > 0 ? tab + a : a).join(',\n');

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
