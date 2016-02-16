getValue['sass each'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var s = `${element.name} ${element.value}`;
  var v = getValue.shared.nested(settings, element, parent);
  var sublist = lasso.between(element.value, '(', ')');
  var commas = lasso.indexesOf(element.value, ',');
  var lines = [''];
  var index = 0;
  if (sublist.length) {
    commas = commas.filter(function (comma) {
      for (var i = 0, n = sublist.length; i < n; i++) {
        if (comma.index > sublist[i].index && comma.index < sublist[i].index + sublist[i].length) {
          return false;
        }
      }
      return comma.index > sublist.slice(-1)[0].index;
    }).map((a) => a.index);
    for (var i = 0, n = element.value.length; i < n; i++) {
      if (commas.indexOf(i) !== -1) {
        index += 1;
        lines[index] = '';
      } else {
        lines[index] += element.value[i];
      }
    }
    lines = lines.map((a) => a.trim());
    if (settings.align) {
      for (var i = 0, n = lines.length; i < n; i++) {
        if (i === 0) {
          lines[i] = element.name + ' ' + lines[i];
        } else {
          lines[i] = tab + new Array(lines[0].substr(0, lines[0].indexOf('(')).length + 1).join(' ') + lines[i];
        }
      }
      s = lines.join(', \n');
    } else {
      for (var i = 0, n = lines.length; i < n; i++) {
        if (i === 0) {
          lines[i] = element.name + ' ' + lines[i];
        } else {
          lines[i] = tab + lines[i];
        }
      }
      s = lines.join(', \n');
    }
  }
  return `${s} {\n${v}${tab}}`;
};
