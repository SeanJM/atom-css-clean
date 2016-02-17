sortCss.scope = function (settings, cssObject, sortList) {
  var scope = {};
  var start = 0;
  var name;
  var i;
  var n;
  var x;
  var y;
  // Determine if a comment is the first element in the array
  while (cssObject[start].scope.substr(0, 7) === 'comment') {
    start += 1;
  }
  for (i = 0, n = sortList.length; i < n; i++) {
    scope[sortList[i]] = [];
  }
  for (i = cssObject.length - 1; i >= start; i -= 1) {
    if (sortList.indexOf(cssObject[i].scope) !== -1) {
      scope[cssObject[i].scope].push(cssObject[i]);
      cssObject.splice(i, 1);
    }
  }
  for (i = 0, n = sortList.length; i < n; i++) {
    name = sortList[i];
    if (typeof sortCss.list[name] === 'function') {
      sortCss.list[name](settings, scope[name]);
    }
    if (typeof sortCss.each[name] === 'function') {
      for (x = 0, y = scope[name].length; x < y; x++) {
        sortCss.each[name](settings, scope[name][x]);
      }
    }
    if (scope[name].length) {
      [].splice.apply(cssObject, [start, 0].concat(scope[name]));
      start += scope[name].length;
    }
  }
};
