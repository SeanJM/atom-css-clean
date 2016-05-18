getValue['media query'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var align = new Array(element.name.length + 2).join(' ');
  var nested = getValue.shared.nested(settings, element, parent);
  var value;

  function joinLines(a) {
    return a.map(function (b, i) {
      if (i > 0) {
        return tab + align + b;
      }
      return b;
    }).join('\n');
  }

  value = element.value.map(function (a, i) {
    a = joinLines(a);

    if (i > 0) {
      return tab + align + a;
    }

    return a;
  }).join(',\n\n');

  return element.name + ' ' + value + ' {\n' + nested + tab + '}';
};
