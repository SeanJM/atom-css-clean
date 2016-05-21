function sortCss(settings, cssObject) {
  var displaceDeep = [
    'sass function',
    'sass import',
    'sass include',
    'sass include arguments',
    'sass mixin',
    'sass include block',
    'sass extend',
    'property group',
  ];

  var displaceZeroDepth = [
    'sass import',
    'sass include',
    'sass variable assignment',
    'font face',
    'sass function',
    'sass mixin',
    'sass include block',
    'sass placeholder',
  ];

  function sortDeep(array) {
    sortCss.scope(settings, array, {
      displace : displaceDeep
    });

    for (var i = 0, n = array.length; i < n; i++) {
      if (Array.isArray(array[i].content) && array[i].content.length) {
        sortDeep(array[i].content);
      }
    }
  }

  sortCss.scope(settings, cssObject, {
    displace : displaceZeroDepth
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
