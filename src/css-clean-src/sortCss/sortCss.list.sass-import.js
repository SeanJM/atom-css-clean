sortCss.list['sass import'] = function (settings, list) {
  for (var i = list.length - 1; i > 0; i--) {
    [].push.apply(list[0].value, list[i].value);
    list.splice(i, 1);
  }
};
