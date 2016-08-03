function sassMixin(that, element, siblings) {
  const nested = require('./nested');

  let tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  let v = nested(that, element, siblings);

  let args = element.arguments
    ? `(${element.arguments.join(', ')})`
    : '';

  let content = v.length
    ? `{\n${v}${tab}}`
    : '{}';

  return `${tab}${element.name} ${element.value}${args} ${content}`;
}

module.exports = sassMixin;
