getValue['selector'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var selector = element.selector.map((a, i) => i > 0 ? `${tab}${a}` : a).join(',\n');
  var v = getValue.shared.nested(settings, element, parent);
  return `${selector} {\n${v}${tab}}`;
};
