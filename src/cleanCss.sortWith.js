cleanCss.sortWith = function (array, sourceArray) {
  return array.sort(function (a, b) {
    var bOut = sourceArray.indexOf(b) < 0;
    var aOut = sourceArray.indexOf(a) < 0;
    if (!aOut && !bOut) {
      return sourceArray.indexOf(a) - sourceArray.indexOf(b);
    } else if (!aOut && bOut) {
      return -1;
    }
    return 1;
  });
};
