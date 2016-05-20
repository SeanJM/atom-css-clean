getValue.selector = function (settings, element, siblings) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var v = getValue.shared.nested(settings, element, parent);
  var selector = element.selector.map(function (a, i) {
    return i > 0 ? tab + a : a;
  }).join(',\n');

  if (siblings[0] !== element && element.first) {
    return '\n' + tab + selector + ' {\n' + v + tab + '}\n';
  } else if (v.length && !element.last && element.depth > 0) {
    return selector + ' {\n' + v + tab + '}\n';
  } else if (v.length && element.last && element.depth > 0) {
    return selector + ' {\n' + v + tab + '}';
  } else if (v.length && element.depth === 0) {
    return selector + ' {\n' + v + tab + '}';
  } else if (element.last) {
    return selector + ' {}';
  } else {
    return selector + ' {}\n';
  }
};
