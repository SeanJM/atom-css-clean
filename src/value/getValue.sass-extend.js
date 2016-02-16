getValue['sass extend'] = function (settings, element, parent) {
  if (element.align && element.length > 1) {
    return `${element.name}${new Array((element.align - element.name.length) + 4).join(' ')}${element.value};`;
  }
  return `${element.name} ${element.value};`;
};
