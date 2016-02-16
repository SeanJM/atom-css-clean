getValue['comment inline'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  return tab + '// ' + element.value;
};
