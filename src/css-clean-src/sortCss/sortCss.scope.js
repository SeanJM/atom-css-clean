sortCss.scope = function (settings, content, order) {
  var displace = {};
  var start = 0;
  var name;
  var i;
  var n;
  var x;
  var y;

  // Determine if a comment is the first element in the array
  while (content[start].scope.substr(0, 7) === 'comment') {
    start += 1;
  }

  for (i = 0, n = order.length; i < n; i++) {
    displace[order[i]] = [];
  }

  for (i = content.length - 1; i >= start; i--) {
    name = content[i].scope;
    // Add to displace list
    if (order.indexOf(name) > -1) {
      displace[name].unshift(content[i]);
      content.splice(i, 1);
    }
  }

  // Sort
  for (name in displace) {
    x = displace[name];
    if (Array.isArray(x) && x.length && typeof sortCss.list[name] === 'function') {
      sortCss.list[name](settings, x);
    }
  }

  for (name in sortCss.each) {
    for (i = 0, n = content.length; i < n; i++) {
      if (content[i].scope === name) {
        sortCss.each[name](settings, content[i]);
      }
    }
  }

  for (i = 0, n = order.length; i < n; i++) {
    name = order[i];
    if (displace[name].length) {
      [].splice.apply(content, [start, 0].concat(displace[name]));
      start += displace[name].length;
    }
  }
};
