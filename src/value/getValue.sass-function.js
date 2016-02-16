getValue['sass function'] = function (settings, element, parent) {
  var args = '(' + element.arguments.join(', ') + ')';
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var selector = `${element.name} ${element.value}${args}`;
  var v = getValue.shared.nested(settings, element, parent);
  return `${tab}${selector} {\n${v}${tab}}`;
};
