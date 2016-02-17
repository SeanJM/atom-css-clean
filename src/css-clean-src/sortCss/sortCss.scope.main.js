sortCss.scope.main = function (settings, cssObject) {
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
  for (i = 0, n = sortCss.scope.main.list.length; i < n; i++) {
    scope[sortCss.scope.main.list[i]] = [];
  }
  for (i = cssObject.length - 1; i >= start; i -= 1) {
    if (sortCss.scope.main.list.indexOf(cssObject[i].scope) !== -1) {
      scope[cssObject[i].scope].push(cssObject[i]);
      cssObject.splice(i, 1);
    }
  }
  for (i = 0, n = sortCss.scope.main.list.length; i < n; i++) {
    name = sortCss.scope.main.list[i];
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

sortCss.scope.main.list = [
  'sass import',
  'sass variable assignment',
  'sass function',
  'sass mixin',
  'sass placeholder',
];
