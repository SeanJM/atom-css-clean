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
    for (var i = 0, n = array.length; i < n; i++) {
      if (Array.isArray(array[i].content) && array[i].content.length) {
        sortDeep(array[i].content);
      }
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
