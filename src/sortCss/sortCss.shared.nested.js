sortCss.shared.nested = function (settings, element) {
  var alignScope = [0, 1, 2, 3, 4, 5];
  var scopeGroup = {};
  var start = 0;
  var t;
  var containNest = [
    'sass function',
    'sass if',
    'sass include block',
    'sass mixin',
    'selector',
  ];
  // Increase the start position as long as there are comments
  while (element.content[start].scope.substr(0, 7) === 'comment') {
    start += 1;
  }
  // Fill the scopeGroup collection
  for (var i = 0, n = settings.blockScopeOrder.length; i < n; i++) {
    scopeGroup[settings.blockScopeOrder[i]] = [];
  }
  for (var i = element.content.length - 1; i >= start; i--) {
    // The content scope that we are looping through exists inside 'scopeGroup'
    if (Array.isArray(scopeGroup[element.content[i].scope])) {
      if (typeof sortCss.each[element.content[i].scope] === 'function') {
        sortCss.each[element.content[i].scope](settings, element.content[i]);
      }
      if (containNest.indexOf(element.content[i].scope) !== -1) {
        sortCss.shared.nested(settings, element.content[i]);
      }
      //console.log(element.content[i]);
      scopeGroup[element.content[i].scope].push(element.content[i]);
      element.content.splice(i, 1);
    }
  }
  // Iterate through the scopeGroup
  for (var name in scopeGroup) {
    if (typeof sortCss.list[name] === 'function' && scopeGroup[name].length) {
      sortCss.list[name](settings, scopeGroup[name]);
    }
    [].splice.apply(element.content, [start, 0].concat(scopeGroup[name]));
    start += scopeGroup[name].length;
  }
};
