function splitByComma (value) {
  var open = 0;
  var index = 0;
  var i = 0;
  var n = value.length;
  var lines = [''];

  for (; i < n; i++) {
    if (value[i] === '(') {
      open += 1;
      lines[index] += value[i];
    } else if (value[i] === ')') {
      open -= 1;
      lines[index] += value[i];
    } else if (value[i] === ',' && open === 0) {
      index += 1;
      lines[index] = '';
    } else {
      lines[index] += value[i];
    }
  }

  return lines.map(function (a) { return a.trim(); });
}

module.exports = splitByComma;
