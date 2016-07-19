getValue['sass mixin'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var args = '';
  var v = getValue.shared.nested(settings, element, parent);
  var s = `${tab}${element.name} ${element.value}`;
  if (element.arguments) {
     args = '(' + element.arguments.join(', ') + ')';
     s = `${tab}${element.name} ${element.value}${args}`;
  }
  return `${s} {\n${v}}`;
};
