getValue.selector = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var v = getValue.shared.nested(settings, element, parent);
  var selector = element.selector.map(function (a, i) {
    return i > 0 ? tab + a : a;
  }).join(',\n');

  return selector + ' {\n' + v + tab + '}';
};
