function partial(fn) {
  var a = [].slice(fn, 1);
  return function () {
    var b = a.concat([].slice(arguments));
    fn.apply(null, a);
  }
}
