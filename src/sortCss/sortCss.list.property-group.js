sortCss.list['property group'] = function (settings, list) {
  var order = settings.propertyGroupOrder;
  list.sort(function (a, b) {
    var ai = order.indexOf(a.name);
    var bi = order.indexOf(b.name);
    if (ai > -1 && bi > -1) {
      return ai - bi;
    }
    if (ai > -1 && bi === -1) {
      return -1;
    }
    if (bi > -1 && ai === -1) {
      return 1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });
};
