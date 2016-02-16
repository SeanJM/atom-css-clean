function getValue(settings, cssObject) {
  return getValue.map(settings, cssObject).map(function (value, i) {
    var element = cssObject[i];
    if (element.scope === 'sass variable assignment' && !element.last) {
      return value;
    }
    return value + '\n';
  }).join('\n');
}

getValue.shared = {};
