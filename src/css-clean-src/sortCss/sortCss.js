function sortCss(settings, cssObject) {
  if (settings.sortMainScope) {
    sortCss.scope.main(settings, cssObject);
  }
  if (settings.sortBlockScope) {
    sortCss.scope.block(settings, cssObject);
  }
}

sortCss.scope = {};
sortCss.shared = {};
sortCss.list = {};
sortCss.each = {};
