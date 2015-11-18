(function () {
  var sortOrder = [
    '@extend',
    '@include',
    'z-index',
    'content',
    'display',
    '*display',
    'visibility',
    'zoom',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'height',
    'float',
    'clear',
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
    'list-style',
    'list-style-image',
    'list-style-position',
    'list-style-type',
    'counter-increment',
    'counter-reset',
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-color',
    'border-image',
    'border-image-source',
    'border-image-repeat',
    'border-image-width',
    'border-image-outset',
    'border-image-slice',
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
    'border-collapse',
    'border-spacing',
    'outline',
    'outline-color',
    'outline-offset',
    'outline-style',
    'outline-width',
    'caption-side',
    'empty-cells',
    'table-layout',
    'text-align',
    'text-decoration',
    'text-decoration-color',
    'text-decoration-line',
    'text-decoration-style',
    'text-underline-position',
    'text-transform',
    'text-shadow',
    'text-overflow',
    'vertical-align',
    'font',
    'font-family',
    'font-size',
    'font-size-adjust',
    'font-style',
    'font-weight',
    'font-kerning',
    'font-stretch',
    'line-height',
    'letter-spacing',
    'word-spacing',
    'line-break',
    'hyphens',
    'overflow-wrap',
    'tab-size',
    'white-space',
    'word-break',
    'word-wrap',
    'box-shadow',
    'box-decoration-break',
    'opacity',
    'filter',
    'overflow',
    'overflow-x',
    'overflow-y',
    'background',
    'background-image',
    'background-color',
    'background-blend-mode',
    'background-repeat',
    'background-attachment',
    'background-origin',
    'background-position',
    'background-size',
    'background-clip',
    'user-select',
    '-moz-user-select',
    '-ms-user-select',
    '-webkit-user-select',
    'pointer-events',
    'animation',
    'animation-delay',
    'animation-direction',
    'animation-duration',
    'animation-fill-mode',
    'animation-iteration-count',
    'animation-name',
    'animation-play-state',
    'animation-timing-function',
    'transition',
    '-moz-transition',
    '-ms-transition',
    '-webkit-transition',
    'transition-property',
    'transition-duration',
    'transition-timing-function',
    'transition-delay',
    'transform',
    '-moz-transform',
    '-ms-transform',
    '-webkit-transform',
    'cursor',
    'resize',
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
