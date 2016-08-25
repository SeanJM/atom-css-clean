const lasso = require('lasso-string');

function isSpecialComment(element) {
  return /(\s+|)!/.test(element.value[0]);
}

function isSectionTitle(element) {
  /*------------------------------------*\
    #SECTION-TITLE
  \*------------------------------------*/
  return (
    /^[\-]+(\s+|)\*\\$/.test(element.value[0])
    && /^(\s+|)\\\*(\s+|)[\-]+$/.test(element.value.slice(-1)[0])
  );
}

function isEmptyLine(wordList) {
  return (
    wordList
    && wordList.length === 1
    && wordList[0].length === 0
  );
}

function splitByLineBreak(that, element) {
  let lines = [];
  let lineIndex = 0;
  let tabLength = that.getTab(element.depth + 2).length;

  let raw = element.value
    .map(a => a
      .replace(/^(\s+|)\*/g, '')
      .replace(/^(\s+)([^\s])/, '$2')
      .replace(/([^\s])(\s+)$/, '$1')
    )
    .reduce(function (a, b) {
      var o = [a];

      if (Array.isArray(a)) {
        o = a;
      } else if (!a.length) {
        o = [];
      }

      if ('- ' === b.substr(0, 2)) {
        o.push('');
      }

      o.push(b);
      return o;
    });

  // Single line
  if (typeof raw === 'string') {
    raw = [raw];
  }

  raw = raw
    .join(' ')
    .trim()
    .split(' ');

  raw.forEach(function (word, i) {
    let nextWord = raw[i + 1];

    if (!lines[lineIndex]) {
      lines[lineIndex] = [];
    } else if (
      tabLength + lines[lineIndex].join(' ').length + word.length
      > that.lineBreak
    ) {
      lineIndex++;
      lines[lineIndex] = [];
    } else if (!word.length && !isEmptyLine(lines[lineIndex])) {
      // is a list
      if (nextWord !== '-') {
        lineIndex++;
        lines[lineIndex] = [];
      }
      lineIndex++;
      lines[lineIndex] = [];
    }
    lines[lineIndex].push(word);
  });

  element.value = lines.map(a => a.join(' ').replace(/\s+/g, ' '));
}

function formatSectionTitle(that, element) {
  const tab = that.getTab(element.depth);
  let value = element.value.map(function (line, i) {
    let $tab = '';

    if (i > 0) {
      $tab = tab + that.getTab(1);
    }

    line = line.trim();

    return i < element.value.length - 1
      ? $tab + line + '\n'
      : tab + line;
  });
  return '/*' + value.join('') + '*/';
}

function formatSpecialComment(that, element) {
  const tab = that.getTab(element.depth);

  if (element.value.length === 1) {
    return '/*' + element.value.join('\n') + ' */';
  }

  return '/*' + element.value.map(function (line, i) {
    let $tab = '';
    if (i > 0) {
      $tab = tab + that.getTab(1);
    }
    return $tab + line.trim();
  }).join('\n') + '\n' + tab + ' */';
}

function formatDefault(that, element) {
  const tab = that.getTab(element.depth);

  splitByLineBreak(that, element);

  return element.value.length > 1
    ? '/**\n' +

    element.value.map(function (line, i) {
      let $tab = that.getTab(element.depth);
      line = ' * ' + line.trim();
      return $tab + line;
    }).join('\n') +

    '\n' + tab + ' */'
  : '/* ' + element.value.join('') + ' */';
}

function commentBlock(that, element) {
  /*
  Titling support
  http://cssguidelin.es/#titling
  */

  if (isSectionTitle(element)) {
    return formatSectionTitle(that, element);
  } else if (isSpecialComment(element)) {
    return formatSpecialComment(that, element);
  }

  return formatDefault(that, element);
}

module.exports = commentBlock;
