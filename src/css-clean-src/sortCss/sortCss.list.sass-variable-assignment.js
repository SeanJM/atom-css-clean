sortCss.list['sass variable assignment'] = function (settings, list) {
  list.sort(smartSort('name'));
  for (var i = 0, n = list.length; i < n; i++) {
    list[i].groupIndex = i;
    list[i].first = i === 0;
    list[i].last = i === n - 1;
  }
};
