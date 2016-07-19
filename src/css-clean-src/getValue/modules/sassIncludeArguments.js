function sassIncludeArguments(that, element, parent) {
  var args = '(' + element.arguments.join(', ') + ')';
  var align = new Array(element.align - element.name.length + 4).join(' ');

  return (
    element.depth
    && element.align
    && parent.length > 1
  ) ? `${element.name}${align}${element.value}${args};`
    : `${element.name} ${element.value}${args};`;
}

module.exports = sassIncludeArguments;
