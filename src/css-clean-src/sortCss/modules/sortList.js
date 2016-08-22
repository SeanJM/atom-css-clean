const smartSort = require('../../vendor/smartSort');
const splitByComma = require('../../vendor/splitByComma');

let sortList = {};

sortList['property group'] = function (that, list) {
  var order = require('../../PROPERTIES_LIST');

  list.sort(function (a, b) {
    var ai = order.indexOf(a.name);
    var bi = order.indexOf(b.name);

    if (
      a.name === b.name
      && typeof sortList['property group'][a.name] === 'function'
    ) {
      return sortList['property group'][a.name](a, b);
    }

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

sortList['property group']['background-color'] = sortList['property group'].background;

sortList['property group'].background = function (a, b) {
  if (/\(/.test(a.value) && !/\(/.test(b.value)) {
    return 1;
  } else if (/\(/.test(a.value) && /\(/.test(b.value)) {
    if (a.value > b.value) {
      return 1;
    }
    return -1;
  }
  return -1;
};

sortList['property group'].src = function (a, b) {
  var av = splitByComma(a.value);
  var bv = splitByComma(b.value);

  if (av.length > bv.length) {
    return 1;
  }
  return -1;
};

sortList['sass function'] = function (that, list) {
  list.sort(smartSort('value'));
};

sortList['sass import'] = function (that, list) {
  for (var i = list.length - 1; i > 0; i--) {
    [].push.apply(list[0].value, list[i].value);
    list.splice(i, 1);
  }
};

sortList['sass include'] = function (that, list) {
  list.sort(smartSort('value'));
};

sortList['sass mixin'] = function (settings, list) {
  list.sort(smartSort('value'));
};

module.exports = sortList;
