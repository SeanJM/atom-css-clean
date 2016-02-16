sortCss.each.selector = function (settings, element) {
  element.selector.sort(smartSort());
  sortCss.shared.nested(settings, element);
};
