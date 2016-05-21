cleanCss.fn.indent = function (settings, string, length, type) {
  if (type === 'space') {
    settings.tabChar = ' ';
  } else if (type === 'tab') {
    settings.tabChar = '\t';
  }
};
