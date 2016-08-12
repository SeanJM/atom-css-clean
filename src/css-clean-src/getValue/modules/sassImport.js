function sassImport(that, element, parent) {
  var tab = new Array((element.depth + 1) * that.tabSize).join(that.tabChar);
  var space = '';
  var x = 0;
  var v;
  var alignSpace = element.align && element.depth > 0
    ? new Array(element.align - element.name.length + 1).join(' ')
    : '';

  if (element.depth > 0) {
    space = `${tab}${alignSpace}${new Array(element.name.length + 3).join(' ')}`;
  } else {
    space = `${tab}${alignSpace}${new Array(element.name.length + 1).join(' ')}`;
  }

  element.value = element.value.map(function (a, i) {
    return i > 0
      ? `${space}"${a}"`
      : element.depth > 0 && parent.length > 1
        ? `  "${a}"`
        : `"${a}"`;
  });

  v = element.value.join(',\n');

  return element.align
    ? `${element.name}${alignSpace} ${v};`
    : `${element.name} ${v};`;
}

module.exports = sassImport;
