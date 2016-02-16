getValue['sass import'] = function (settings, element, parent) {
  var lines = [[]];
  var tab = new Array((element.depth + 1) * settings.tabSize).join(settings.tabChar);
  var space = '';
  var x = 0;
  var v;
  function alignLineBreak() {
    var length;
    for (var i = 0, n = element.value.length; i < n; i++) {
      length = space.length + lines[x].concat(element.value[i]).join(', ').length;
      if (length >= settings.lineBreak) {
        x += 1;
        lines[x] = [];
      }
      lines[x].push(element.value[i]);
    }
  }
  element.value = element.value.map((a) => `"${a}"`);
  if (settings.align && settings.lineBreak) {
    space = `\n${tab}${new Array(element.name.length + 1).join(' ')}`;
    alignLineBreak();
  } else if (settings.lineBreak) {
    space = '\n';
    alignLineBreak();
  } else {
    for (var i = 0, n = element.value.length; i < n; i++) {
      lines[x].push(element.value[i]);
    }
  }
  lines = lines.map(function (collection, i) {
    if (i > 0) {
      return space + collection.join(', ');
    }
    return collection.join(', ');
  });
  v = lines.join(', ');
  if (element.align) {
    return `${element.name}${new Array(element.align - element.name.length + 1).join(' ')} ${v};`;
  }
  return `${element.name} ${v};`;
};
