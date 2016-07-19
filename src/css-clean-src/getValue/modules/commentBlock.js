function commentBlock(that, element, parent) {
  /*
  Titling support
  http://cssguidelin.es/#titling
  */

  const tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  const isSpecialComment = element.value[0] === '!';
  const isTitle = (
    /^[\-]+(\s+|)\*\\$/.test(element.value[0].trim())
    && /^\\\*(\s+|)[\-]+$/.test(element.value.slice(-1)[0].trim())
  );

  let value;

  function lineBreak() {
    let lines = [[]];
    let $tab = new Array(that.tabSize + 1).join(that.tabChar);
    let x = 0;
    let v = element.value.join('\n').split(' ').filter(a => a.length);
    let tabLength = tab.length + $tab.length;
    let i;
    let n;

    for (i = v.length - 1; i >= 0; i--) {
      if (v[i].length > 1 && v[i].substr(-1) === '\n') {
        v[i] = lasso.trimEnd(v[i]);
        v.splice(i + 1, 0, '\n');
      }
    }

    for (i = 0, n = v.length; i < n; i++) {
      if (v[i] === '\n') {
        x = 0;
      } else {
        x += v[i].length + 1;
        if (x >= that.lineBreak) {
          x = 0;
          v.splice(i, 0, '\n');
        }
      }
    }

    if (v.length) {
      element.value = v.reduce(function (a, b) {
        if (b === '\n') {
          return a += '\n';
        } else if (a.substr(-1) === '\n') {
          return a + b;
        }
        return a += ' ' + b;
      }).split('\n');
    }
  }

  if (that.lineBreak) {
    lineBreak();
  }

  if (element.value.length > 1) {
    if (isTitle) {
      value = element.value.map(function (line, i) {
        let $tab = '';

        if (i > 0) {
          $tab = new Array(that.tabSize + 1).join(that.tabChar);
        }

        return i < element.value.length - 1
          ? $tab + line + '\n'
          : $tab + line;
      });
      return '/*' + value.join('') + '*/\n';
    } else if (isSpecialComment) {
      value = element.value.map(function (line, i) {
        let $tab = '';
        if (i > 0) {
          $tab = tab + new Array(that.tabSize + 1).join(that.tabChar);
        }
        return $tab + line;
      });
      return '/*' + value.join('\n') + '\n' + tab + '*/';
    }

    value = element.value.map(function (line) {
      let $tab = new Array(that.tabSize + 1).join(that.tabChar);
      return $tab + line;
    }).join('\n');

    return '/*\n' + value + '\n' + tab + '*/';
  }

  return '/* ' + element.value.join('\n') + ' */';
}

module.exports = commentBlock;
