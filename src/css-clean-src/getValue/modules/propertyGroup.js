const splitByComma = require('src/vendor/splitByComma');

function properyGroup(that, element, parent) {
  const tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);

  let value = splitByComma(element.value);
  let padding;

  if (element.align) {
    value = value
      .map(function (a, i) {
        let align = new Array(element.align + 4).join(' ');
        return i === 0 ? a : tab + align + a;
      })
      .join(',\n');

    padding = new Array(element.align - element.name.length + 2).join(' ');

    return `${element.name} ${padding} : ${value};`;
  }

  return element.name + ': ' + element.value + ';';
}

module.exports = propertyGroup;
