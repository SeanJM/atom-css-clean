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
