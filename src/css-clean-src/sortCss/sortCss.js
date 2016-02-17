function sortCss(settings, cssObject) {
  function sortDeep(array) {
    sortCss.scope(settings, array, [
      'sass function',
      'sass import',
      'sass include',
      'sass include block',
      'sass mixin',
      'selector',
    ]);
    if (Array.isArray(array.content)) {
      sortDeep(array.content);
    }
  }
  sortCss.scope(settings, cssObject, [
    'sass import',
    'sass include block',
    'sass variable assignment',
    'sass function',
    'sass mixin',
    'sass placeholder',
    'sass selector'
  ]);
  if (settings.sortBlockScope) {
    for (var i = 0, n = cssObject.length; i < n; i++) {
      if (Array.isArray(cssObject[i].content)) {
        sortDeep(cssObject[i].content);
      }
    }
  }
}

sortCss.shared = {};
sortCss.list = {};
sortCss.each = {};
