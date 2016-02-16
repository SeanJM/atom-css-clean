cleanCss.fn.value = function (settings, string) {
  var cssObject = capture(string, [], 0);
  sortCss(settings, cssObject);
  return getValue(settings, cssObject);
};
