function fnChain(target, source, args) {
  for (var k in source) {
    if (typeof source[k] === 'function') {
      target[k] = function (k) {
        return function () {
          var b = source[k].apply(null, args.concat([].slice.call(arguments)));
          return typeof b === 'undefined' ? target : b;
        }
      }(k);
    }
  }
  return target;
}
