const NEW_LINE = [
  'selector',
  'sass function',
  'sass mixin',
  'sass include block',
  'sass for'
];

function nested(that, element, parent) {
  const tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  const $tab = new Array(that.tabSize + 1).join(that.tabChar);
  const scopeList = element.content.map(a => a.scope);
  const mapValue = require('./mapValue');

  let newGroupIndex = [];
  let i = 0;
  let n = scopeList.length;
  let temp;

  for (; i < n; i++) {
    newGroupIndex[i] = (
      i > 0
      && temp !== scopeList[i]
      && NEW_LINE.indexOf(scopeList[i]) !== -1
    );
    temp = scopeList[i];
  }

  return mapValue(that, element.content).map(function (value, i) {

    if (element.content[i].name === '@else if') {
      return ' ' + value;
    }

    if (element.content[i].name === '@else') {
      return ' ' + value;
    }

    if (element.content[i].index > 1 && element.content[i].name === '@if') {
      return tab + $tab + value;
    }

    if (element.content[i].name === '@if') {
      return tab + $tab + value;
    }

    return tab + $tab + value + '\n';

  }).join('');
}

module.exports = nested;
