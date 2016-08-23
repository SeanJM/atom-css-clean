function unzip(list) {
  let vendors = ['-moz-', '-ms-', '-o-', '-webkit-', ''];
  let unzipped = [];
  let i;

  list.forEach(function (a) {
    if (a.indexOf('-prefix-') !== -1) {
      [].push.apply(unzipped, vendors.map(p => a.replace('-prefix-', p)));
    } else {
      unzipped.push(a);
    }
  });

  return unzipped;
}

let PROPERTIES_LIST = unzip([
  'z-index',
  'content',
  'icon',
  'display',
  '*display',
  '-prefix-device-pixel-ratio',
  '-prefix-box-sizing',
  '-prefix-box-align',
  '-prefix-box-direction',
  '-prefix-box-orient',
  '-prefix-box-pack',
  'visibility',
  '-prefix-appearance',
  'zoom',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'width',
  'min-width',
  'max-width',
  'height',
  'min-height',
  'max-height',
  'float',
  'clear',
  'clip',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  '-prefix-margin-before',
  '-prefix-margin-after',
  '-prefix-margin-end',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'color',
  'opacity',
  'overflow',
  'overflow-x',
  'overflow-y',
  'overflow-wrap',
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
  'border-width',
  'border-style',
  '-prefix-border-radius',
  '-prefix-border-top-left-radius',
  '-prefix-border-top-right-radius',
  '-prefix-border-bottom-right-radius',
  '-prefix-border-bottom-left-radius',
  'border-top-width',
  'border-top-style',
  'border-right-width',
  'border-right-style',
  'border-bottom-width',
  'border-bottom-style',
  'border-left-width',
  'border-left-style',
  'border-collapse',
  'border-spacing',
  'background',
  'background-image',
  'background-color',
  '-prefix-background-blend-mode',
  'background-repeat',
  'background-attachment',
  'background-origin',
  'background-position',
  'background-size',
  'background-clip',
  'fill',
  'stroke',
  'stroke-miterlimit',
  'filter',
  'outline',
  'outline-color',
  'outline-offset',
  'outline-style',
  'outline-width',
  'caption-side',
  'empty-cells',
  'table-layout',
  '-prefix-box-shadow',
  'box-decoration-break',
  'text-align',
  'text-decoration',
  'text-decoration-color',
  'text-decoration-line',
  'text-decoration-style',
  'text-underline-position',
  'text-transform',
  'text-shadow',
  'text-align-last',
  'text-combine-upright',
  'text-indent',
  'text-justify',
  'text-orientation',
  'text-combine-upright',
  'text-overflow',
  '-prefix-text-size-adjust',
  'vertical-align',
  '-prefix-align-content',
  '-prefix-align-items',
  '-prefix-align-self',
  '@font-feature-values',
  'font-feature-settings',
  'font',
  'font-family',
  'font-display',
  'font-size',
  'font-size-adjust',
  'font-style',
  'font-weight',
  'font-kerning',
  'font-stretch',
  '-prefix-font-smoothing',
  '-prefix-osx-font-smoothing',
  'font-synthesis',
  'font-variant',
  'font-variant-alternates',
  'font-variant-caps',
  'font-variant-east-asian',
  'font-variant-ligatures',
  'font-variant-numeric',
  'font-variant-position',
  'font-language-override',
  'src',
  'flex',
  'flex-basis',
  '-prefix-flex-align',
  '-prefix-flex-direction',
  '-prefix-flex-line-pack',
  '-prefix-flex-pack',
  'flex-flow',
  'flex-grow',
  'flex-shrink',
  '-prefix-flex-wrap',
  '-prefix-justify-content',
  'order',
  'hanging-punctuation',
  'line-break',
  'hyphens',
  'line-height',
  'letter-spacing',
  'tab-size',
  'white-space',
  'word-break',
  'word-spacing',
  'word-wrap',
  'direction',
  'unicode-bidi',
  'writing-mode',
  'list-style',
  'list-style-image',
  'list-style-position',
  'list-style-type',
  'counter-increment',
  'counter-reset',
  '@-prefix-keyframes',
  '-prefix-animation',
  '-prefix-animation-delay',
  '-prefix-animation-direction',
  '-prefix-animation-duration',
  '-prefix-animation-fill-mode',
  '-prefix-animation-iteration-count',
  '-prefix-animation-name',
  '-prefix-animation-play-state',
  '-prefix-animation-timing-function',
  'backface-visibility',
  'perspective',
  'perspective-origin',
  '-prefix-transform',
  '-prefix-transform-origin',
  '-prefix-transform-style',
  '-prefix-transition',
  '-prefix-transition-property',
  '-prefix-transition-duration',
  '-prefix-transition-timing-function',
  '-prefix-transition-delay',
  '-prefix-interpolation-mode',
  'ime-mode',
  'Multi-column',
  'break-after',
  'break-before',
  'break-inside',
  '-prefix-column-count',
  '-prefix-column-fill',
  '-prefix-column-gap',
  '-prefix-column-rule',
  '-prefix-column-rule-color',
  '-prefix-column-rule-style',
  '-prefix-column-rule-width',
  '-prefix-column-span',
  '-prefix-column-width',
  '-prefix-columns',
  'widows',
  'orphans',
  'page-break-after',
  'page-break-before',
  'page-break-inside',
  'marks',
  'quotes',
  'image-orientation',
  'image-rendering',
  'image-resolution',
  'object-fit',
  'object-position',
  'mask',
  'mask-type',
  'mark',
  'mark-after',
  'mark-before',
  'phonemes',
  'rest',
  'rest-after',
  'rest-before',
  'voice-balance',
  'voice-duration',
  'voice-pitch',
  'voice-pitch-range',
  'voice-rate',
  'voice-stress',
  'voice-volume',
  'marquee-direction',
  'marquee-play-count',
  'marquee-speed',
  'marquee-style',
  'nav-index',
  'nav-up',
  'nav-right',
  'nav-down',
  'nav-left',
  'resize',
  '-prefix-touch-action',
  '-prefix-tap-highlight-color',
  '-prefix-user-select',
  '-prefix-pointer-events',
  'cursor',
]);

module.exports = PROPERTIES_LIST;
