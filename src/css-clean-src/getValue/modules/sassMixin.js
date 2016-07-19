function sassMixin(that, element, parent) {
  let tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  let args = element.arguments
    ? '(' + element.arguments.join(', ') + ')'
    : '';

  return `${tab}${element.name} ${element.value}${args}`;
}

module.exports = sassMixin;
