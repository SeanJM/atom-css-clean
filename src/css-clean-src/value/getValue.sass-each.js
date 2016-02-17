getValue['sass each'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var nested = getValue.shared.nested(settings, element, parent);
  var value = splitByComma(element.value);
  var each;
  if (settings.align) {
    for (var i = 0, n = value.length; i < n; i++) {
      if (i === 0) {
        value[i] = element.name + ' ' + value[i];
      } else {
        value[i] = tab + new Array(value[0].substr(0, value[0].indexOf('(')).length + 1).join(' ') + value[i];
      }
    }
    each = value.join(', \n');
  } else {
    for (var i = 0, n = value.length; i < n; i++) {
      if (i === 0) {
        value[i] = element.name + ' ' + value[i];
      } else {
        value[i] = tab + value[i];
      }
    }
    each = value.join(',\n');
  }
  return `${each} {\n${nested}${tab}}`;
};
