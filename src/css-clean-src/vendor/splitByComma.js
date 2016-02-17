function splitByComma (value) {
  var sublist = lasso.between(value, '(', ')');
  var commas = lasso.indexesOf(value, ',');
  var lines = [''];
  var index = 0;
  if (sublist.length) {
    commas = commas.filter(function (comma) {
      for (var i = 0, n = sublist.length; i < n; i++) {
        if (comma.index > sublist[i].index && comma.index < sublist[i].index + sublist[i].length) {
          return false;
        }
      }
      return comma.index > sublist.slice(-1)[0].index;
    }).map((a) => a.index);
    for (var i = 0, n = value.length; i < n; i++) {
      if (commas.indexOf(i) !== -1) {
        index += 1;
        lines[index] = '';
      } else {
        lines[index] += value[i];
      }
    }
    return lines.map((a) => a.trim());
  }
  return value.split(',').map((a) => a.trim());
};
