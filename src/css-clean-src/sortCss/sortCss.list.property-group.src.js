sortCss.list['property group']['src'] = function (a, b) {
  var av = splitByComma(a.value);
  var bv = splitByComma(b.value);
  if (av.length > bv.length) {
    return 1;
  }
  return -1;
};
