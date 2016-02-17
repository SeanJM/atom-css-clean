sortCss.scope = function (settings, elementList, sortList) {
  var scope = {};
  var start = 0;
  var name;
  var i;
  var n;
  var x;
  var y;
  // Determine if a comment is the first element in the array
  while (elementList[start].scope.substr(0, 7) === 'comment') {
    start += 1;
  }
  for (i = 0, n = sortList.length; i < n; i++) {
    scope[sortList[i]] = [];
  }
  for (i = elementList.length - 1; i >= start; i--) {
    if (sortList.indexOf(elementList[i].scope) !== -1) {
      scope[elementList[i].scope].push(elementList[i]);
      elementList.splice(i, 1);
    }
  }
  for (i = 0, n = sortList.length; i < n; i++) {
    name = sortList[i];
    if (typeof sortCss.list[name] === 'function' && scope[name].length) {
      sortCss.list[name](settings, scope[name]);
    }
    if (typeof sortCss.each[name] === 'function') {
      for (x = 0, y = scope[name].length; x < y; x++) {
        sortCss.each[name](settings, scope[name][x]);
      }
    }
    if (scope[name].length) {
      [].splice.apply(elementList, [start, 0].concat(scope[name]));
      start += scope[name].length;
    }
  }
};
