function sortCss(settings, cssObject) {
  function sortDeep(array) {
    sortCss.scope(settings, array, {
      displace : [
        'sass function',
        'sass import',
        'sass include',
        'sass include arguments',
        'sass mixin',
        'sass include block',
        'sass extend',
        'property group',
        'selector',
      ]
    });
    if (Array.isArray(array.content) && array.content.length) {
      sortDeep(array.content);
    }
  }
  sortCss.scope(settings, cssObject, {
    displace : [
      'sass import',
      'sass include',
      'sass variable assignment',
      'sass function',
      'sass mixin',
      'sass include block',
      'sass placeholder',
      'font face',
    ]
  });
  if (settings.sortBlockScope) {
    for (var i = 0, n = cssObject.length; i < n; i++) {
      if (Array.isArray(cssObject[i].content) && cssObject[i].content.length) {
        sortDeep(cssObject[i].content);
      }
    }
  }
}

sortCss.list = {};
sortCss.each = {};
