getValue.map = function (settings, parent) {
  return parent.map(function (element) {
    if (typeof getValue[element.scope] === 'undefined') {
      throw `There is no 'getValue' method for: '${element.scope}'`;
    }
    return getValue[element.scope](settings, element, parent);
  });
};
