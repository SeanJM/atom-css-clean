function sassInclude(that, element, parent) {
  var align = new Array(element.align - element.name.length + 4).join(' ');
  return element.align && parent.length > 1
    ? `${element.name}${align}${element.value};`
    : `${element.name} ${element.value};`;
}

module.exports = sassInclude;
