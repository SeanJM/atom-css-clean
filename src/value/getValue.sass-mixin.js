getValue['sass mixin'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var args = '(' + element.arguments.join(', ') + ')';
  var s = `${tab}${element.name} ${element.value}${args}`;
  var v = getValue.shared.nested(settings, element, parent);
  return `${s} {\n${v}}`;
};
