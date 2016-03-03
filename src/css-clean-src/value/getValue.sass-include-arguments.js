getValue['sass include arguments'] = function (settings, element, parent) {
  var args = '(' + element.arguments.join(', ') + ')';
  var align;
  if (element.depth === 0) {
    align = new Array(element.align - element.name.length + 2).join(' ');
  } else {
    align = new Array(element.align - element.name.length + 4).join(' ');
  }
  if (element.align && parent.length > 1) {
    return `${element.name}${align}${element.value}${args};`;
  }
  return `${element.name} ${element.value}${args};`;
};
