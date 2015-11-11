# css-clean package

A package which sorts and aligns CSS and SASS.

![Package screenshot](https://raw.githubusercontent.com/SeanJM/css-clean/master/screenshot-01.png)

- Shortcut is **CMD/CTRL+ALT+C**

Uses a plugin architecture for extending core functionality

## Extending / Contributing

To create a new function in `exports.js`, you will have to create a `cleanCss.fn.myFunctionName.js` file with a function with an identical name placed in the `src/` folder.

Example:

```javascript
(function () {
  function myRecursiveFunction(cssGroupList) {
    cssGroupList.forEach(function (cssGroup) {
      cssGroup.content.forEach(function (propertyValueObject) {
        // propertyValueObject.property returns the CSS property
        // propertyValueObject.propertyLength returns the CSS property length
        // propertyValueObject.value returns the CSS value
        // You can manipulate any of these properties as long as the type stays
        // the same: 'STRING'
      });
      // If a group has a nested group it will be accessible as 'cssGroup.child'
      // 'cssGroup.child' will contain an array conainting a 'CSS group list'
      if (Array.isArray(cssGroup.child)) {
        myRecursiveFunction(cssGroup.child);
      }
    });
  }
  cleanCss.fn.myFunctionName = function () {
    // I would recommend using a recursive function to transform the nested
    // children
    // This is an array containing every cssGroup
    myRecursiveFunction(this);
  };
}());
```

Then you will need to install and run [**Grunt**](http://gruntjs.com/installing-grunt) to concatenate your plugin into `lib/css-clean.js`

Then you will need to reload Atom (CMD/CTRL+SPECIAL+ALT+L) to see your changes and additions.

Here is the array which is used to determine sort order, feel free to contribute to this (and any part of this project):

```javascript
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
    'line-height',
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
```
