function sassExtend(that, element, parent) {
  return element.align && element.length > 1
    ? `${element.name}${new Array((element.align - element.name.length) + 4).join(' ')}${element.value};`
    : `${element.name} ${element.value};`;
}

module.exports = sassExtend;
