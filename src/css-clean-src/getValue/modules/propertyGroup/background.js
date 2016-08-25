const l = require('lasso-string');
const splitByComma = require('../../../vendor/splitByComma');

function isGradient(value) {
  return /^(-(webkit|moz|o|ms)-|)(linear|radial)-gradient/.test(value);
}

function formatLinearGradient(that, element, siblings) {
  const singleTab = that.getTab(1);
  const tab = that.getTab(element.depth);
  let value = splitByComma(element.value);
  let align = tab + new Array(element.align + 4).join(' ');
  let padding;

  if (element.align) {
    value = value
      .map(function (a, line) {
        let between = l.between(a, '(', ')');
        let gradient = a.substr(0, between.start);
        let split = splitByComma(between[1]);
        let format = split.map((b, x) => align + singleTab + b.trim()).join(',\n');
        return line === 0
          ? gradient + '(\n' + format + '\n' + align + ')'
          : align + gradient + '(\n' + format + '\n' + align + ')';
      })
      .join(',\n');

    padding = new Array(element.align - element.name.length + 2).join(' ');

    return `${element.name}${padding}: ${value};`;
  }

  return element.name + ': ' + element.value + ';';
}

module.exports = function (that, element, siblings) {
  if (isGradient(element.value)) {
    return formatLinearGradient(that, element, siblings);
  }
  return require('./default')(that, element, siblings);
};
