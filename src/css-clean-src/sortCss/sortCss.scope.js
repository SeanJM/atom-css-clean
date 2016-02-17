sortCss.scope = function (settings, elementList, opt) {
  var displace = {};
  var sort = {};
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
  for (i = 0, n = opt.sort.length; i < n; i++) {
    sort[opt.sort[i]] = [];
  }
  for (i = elementList.length - 1; i >= start; i--) {
    name = elementList[i].scope;
    // Add to sort list
    if (opt.sort.indexOf(name) !== -1) {
      sort[name].push(elementList[i]);
    }
    // Add to displace list
    if (opt.displace.indexOf(name) !== -1) {
      displace[name].push(elementList[i]);
      elementList.splice(i, 1);
    }
  }
  // Sort
  for (i = 0, n = opt.sort.length; i < n; i++) {
    name = opt.sort[i];
    if (typeof sortCss.list[name] === 'function' && sort[name].length) {
      sortCss.list[name](settings, sort[name]);
    }
    if (typeof sortCss.each[name] === 'function' && sort[name].length) {
      for (x = 0, y = sort[name].length; x < y; x++) {
        sortCss.each[name](settings, sort[name][x]);
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
