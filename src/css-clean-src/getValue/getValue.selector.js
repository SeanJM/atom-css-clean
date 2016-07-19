getValue.selector = function (settings, element, siblings) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var v = getValue.shared.nested(settings, element, parent);

  var selector = element.selector
    .map((a, i) => i > 0 ? tab + a : a)
    .join(',\n');

  var content = v.length
    ? ' {\n' + v + tab + '}'
    : ' {}';


  if (element.depth > 0) {
    // is First
    if (siblings[0] === element) {
      return selector + content;
    }

    return '\n' + tab + selector + content;
  }

  return selector + content;
};
