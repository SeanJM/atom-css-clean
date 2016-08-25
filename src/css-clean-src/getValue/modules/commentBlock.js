const lasso = require('lasso-string');

function splitByLineBreak(that, element) {
  let raw = element.value.join(' ').trim().split(' ');
  let lines = [];
  let lineIndex = 0;
  let tabLength = that.getTab(element.depth + 2).length;

  raw.forEach(function (word) {
    if (!lines[lineIndex]) {
      lines[lineIndex] = [];
    } else if (
      tabLength + lines[lineIndex].join(' ').length + word.length
      > that.lineBreak
    ) {
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
      $tab = that.getTab(element.depth + 1);
    }

    return i < element.value.length - 1
      ? $tab + line + '\n'
      : $tab + line;
  });
  return '/*' + value.join('') + '*/\n';
}

function formatSpecialComment(that, element) {
  const tab = that.getTab(element.depth);
  let value = element.value.map(function (line, i) {
    let $tab = '';
    if (i > 0) {
      $tab = tab + that.getTab(element.depth + 1);
    }
    return $tab + line;
  });
  return '/*' + value.join('\n') + '\n' + tab + '*/';
}

function formatDefault(that, element) {
  const tab = that.getTab(element.depth);
  splitByLineBreak(that, element);

  return (
    '/*\n' +

    element.value.map(function (line, i) {
      let $tab = that.getTab(element.depth + 1);
      line = line.trim();
      return $tab + line;
    }).join('\n') +

    '\n' + tab + '*/'
  );
}

function isSpecialComment(element) {
  return element.value[0] === '!';
}

function isSectionTitle(element) {
  /*------------------------------------*\
    #SECTION-TITLE
  \*------------------------------------*/
  return (
    /^[\-]+(\s+|)\*\\$/.test(element.value[0])
    && /^\\\*(\s+|)[\-]+$/.test(element.value.slice(-1)[0])
  );
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
