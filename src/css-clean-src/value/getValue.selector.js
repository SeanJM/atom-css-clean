getValue.selector = function (settings, element, siblings) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var v = getValue.shared.nested(settings, element, parent);
  var selector = element.selector.map(function (a, i) {
    return i > 0 ? tab + a : a;
  }).join(',\n');

  if (element.depth > 0 && siblings[0] !== element && element.first) {
    if (!element.last) {
      return '\n' + tab + selector + ' {\n' + v + tab + '}\n';
    }
    return '\n' + tab + selector + ' {\n' + v + tab + '}';
  } else if (element.depth > 0 && v.length) {
    if (!element.last) {
      return selector + ' {\n' + v + tab + '}\n';
    }
    return selector + ' {\n' + v + tab + '}';
  } else if (v.length && element.depth === 0) {
    return selector + ' {\n' + v + tab + '}';
  } else if (element.last) {
    return selector + ' {}';
  } else {
    return selector + ' {}\n';
  }
};
