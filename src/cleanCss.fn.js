cleanCss.fn = function (array) {
  for (var k in cleanCss.fn) {
    array[k] = (function (k) {
      return function () {
        return cleanCss.fn[k].apply(array, arguments);
      };
    }(k));
  }
  return array;
};
