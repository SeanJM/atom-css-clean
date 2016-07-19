let sortEach = {};

sortEach['sass import'] = function (that, element) {
  element.value.sort(smartSort());
};

sortEach.selector = function (that, element) {
  element.selector.sort(smartSort());
};

module.exports = sortEach;
