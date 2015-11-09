cleanCss.microdash = {};

cleanCss.microdash.chain = function (array, functionList) {
  for (var k in functionList) {
    array[k] = (function (k) {
      return function () {
        var _arguments_ = [array].concat([].slice.call(arguments));
        return functionList[k].apply(null, _arguments_);
      };
    }(k));
  }
  return array;
};

cleanCss.microdash.indexesOf = function (array, value) {
  var index = [];
  while (array.indexOf(value) > -1) {
    index.push(array.indexOf(value));
    array = array.slice(array.indexOf(value) + 1, array.length);
  }
  return index;
};

cleanCss.microdash.chunk = function (array, chunkN) {
  var chunk  = [];
  for (var i = 0, n = array.length; i < n; i += chunkN) {
    chunk.push(array.slice(i, i + chunkN));
  }
  return cleanCss.microdash.chain(chunk, cleanCss.microdash);
};

cleanCss.microdash.sum = function (array) {
  return array.reduce(function (a, b) {
  	return a + b;
  });
};

cleanCss.microdash.average = function (array) {
  return cleanCss.microdash.sum(array) / array.length;
};
