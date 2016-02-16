getValue['sass include'] = function (settings, element, parent) {
  var align = new Array(element.align - element.name.length + 4).join(' ');
  if (element.align && parent.length > 1) {
    return `${element.name}${align}${element.value};`;
  }
  return `${element.name} ${element.value};`;
};
