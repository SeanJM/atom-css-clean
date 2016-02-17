sortCss.scope = function (settings, elementList, opt) {
  var displace = {};
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
  for (i = 0, n = opt.displace.length; i < n; i++) {
    displace[opt.displace[i]] = [];
  }
  for (i = elementList.length - 1; i >= start; i--) {
    name = elementList[i].scope;
    // Add to displace list
    if (opt.displace.indexOf(name) !== -1) {
      displace[name].push(elementList[i]);
      elementList.splice(i, 1);
    }
  }
  // Sort
  for (name in sortCss.list) {
    if (Array.isArray(displace[name]) && displace[name].length) {
      sortCss.list[name](settings, displace[name]);
    }
  }
  for (name in sortCss.each) {
    for (var i = 0, n = elementList.length; i < n; i++) {
      if (elementList[i].scope === name) {
        sortCss.each[name](settings, elementList[i]);
      }
    }
  }
  for (i = 0, n = opt.displace.length; i < n; i++) {
    name = opt.displace[i];
    if (displace[name].length) {
      [].splice.apply(elementList, [start, 0].concat(displace[name]));
      start += displace[name].length;
    }
  }
};
