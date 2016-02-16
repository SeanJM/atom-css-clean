function forEach(array, fn) {
  for (var i = 0, n = array.length; i < n; i++) {
    fn(array[i], i, array);
  }
}
