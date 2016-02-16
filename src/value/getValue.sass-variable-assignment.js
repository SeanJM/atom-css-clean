getValue['sass variable assignment'] = function (settings, element, parent) {
  if (element.align) {
    return `${element.name}${new Array(element.align - element.name.length + 2).join(' ')}: ${element.value};`;
  }
  return `${element.name} : ${element.value};`;
};
