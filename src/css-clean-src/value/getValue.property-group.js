getValue['property group'] = function (settings, element, parent) {
  var value = splitByComma(element.value);
  var commas = lasso.indexesOf(element.value, ',');
  var captures;
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  if (element.align) {
    value = value.map(function (a, i) {
      var align = new Array(element.align + 4).join(' ');
      if (i === 0) {
        return a;
      }
      return tab + align + a;
    }).join(',\n');
    return element.name + new Array(element.align - element.name.length + 2).join(' ') + ': ' + value + ';';
  }
  return element.name + ': ' + element.value + ';';
};
