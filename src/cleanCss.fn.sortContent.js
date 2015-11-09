(function () {
  var sortOrder = [
    '@extend',
    '@include',
    'z-index',
    'display',
    '*display',
    'zoom',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'height',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'max-width',
    'max-height',
    'min-width',
    'min-height',
    'color',
    'line-height',
    'list-style',
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-size',
    'border-style',
    'border-radius',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'text-align',
    'font',
    'font-family',
    'font-size',
    'font-style',
    'font-weight',
    'vertical-align',
    'text-shadow',
    'box-shadow',
    'opacity',
    'filter',
    'background',
    'background-image',
    'background-color',
    'background-repeat',
    'background-attachment',
    'background-position',
    'background-size',
    'user-select',
    '-moz-user-select',
    '-ms-user-select',
    '-webkit-user-select',
    'pointer-events',
    'animation',
    'transition',
    '-moz-transition',
    '-ms-transition',
    '-webkit-transition',
    'transform',
    '-moz-transform',
    '-ms-transform',
    '-webkit-transform',
  ];
  function sortContent(array) {
    array.forEach(function (cssObject, i) {
      cssObject.content = cssObject.content.sort(function (a, b) {
        var bI = sortOrder.indexOf(b.property) < 0;
        var aI = sortOrder.indexOf(a.property) < 0;
        if (!aI && !bI) {
          return sortOrder.indexOf(a.property) - sortOrder.indexOf(b.property);
        } else if (!aI && bI) {
          return -1;
        }
        return 1;
      });
      if (Array.isArray(cssObject.child)) {
        sortContent(cssObject.child);
      }
    });
    return array;
  }
  cleanCss.fn.sortContent = function () {
    return sortContent(this);
  };
})();
