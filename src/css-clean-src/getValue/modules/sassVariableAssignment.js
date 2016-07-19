function sassVariableAssignment(that, element, parent) {
  return element.align
    ? `${element.name}${new Array(element.align - element.name.length + 2).join(' ')}: ${element.value};`
    : `${element.name} : ${element.value};`;
}

module.exports = sassVariableAssignment;
