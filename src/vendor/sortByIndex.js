function sortByIndex(array, index, property) {
  function sortProperty(a, b) {
    var bI = index.indexOf(b[property]) !== -1;
    var aI = index.indexOf(a[property]) !== -1;
    if (aI && aI) {
      return index.indexOf(a[property]) - index.indexOf(b[property]);
    } else if (aI && !bI) {
      return -1;
    }
    return 1;
  }
  function sortNormal(a, b) {
    var bOut = index.indexOf(b) < 0;
    var aOut = index.indexOf(a) < 0;
    if (!aOut && !bOut) {
      return index.indexOf(a) - index.indexOf(b);
    } else if (!aOut && bOut) {
      return -1;
    }
    return 1;
  }
  if (typeof property === 'string') {
    return array.sort(sortProperty);
  }
  return array.sort(sortNormal);
};
