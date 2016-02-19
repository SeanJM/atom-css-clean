getValue['media query'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var align = new Array(element.name.length + 2).join(' ');
  var value = element.value.map((a, i) => i > 0 ? `${tab}${align}${a}` : a).join(',\n');
  var nested = getValue.shared.nested(settings, element, parent);
  return `${element.name} ${value} {\n${nested}${tab}}`;
};
