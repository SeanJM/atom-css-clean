(function () {
  function alignProperties(array) {
    array.forEach(function (cssObject, i) {
      cssObject.content = cssObject.content.map(function (value) {
        var length     = cssObject.longestProperty - value.propertyLength;
        value.property = value.property + new Array(length + 2).join(' ');
        return value;
      });
      if (Array.isArray(cssObject.child)) {
        alignProperties(cssObject.child);
      }
    });
  }
  cleanCss.fn.alignProperties = function () {
    alignProperties(this);
    return this;
  };
})();
