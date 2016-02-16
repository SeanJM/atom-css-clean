sortCss.scope.block = function (settings, cssObject) {
  var name;
  for (var i = 0, n = cssObject.length; i < n; i++) {
    name = cssObject[i].scope;
    if (sortCss.scope.main.list.indexOf(name) === -1 && typeof sortCss.each[name] === 'function') {
      sortCss.each[name](settings, cssObject[i]);
    }
  }
};
