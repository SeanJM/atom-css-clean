is.propertyGroup = function (value) {
  var startsWith = /^(\*|)[a-z\- ]+:/.test(value);
  var property = value.split(':')[0].trim();
  var inIndexed = list.properties.indexOf(property) > -1;
  var braceBeforeSemiColon = false;
  var n = value.length;
  var i;

  if (startsWith && inIndexed) {
    return true;
  }

  while (value[i] !== ';' && i < n) {
    // Protect is from mismatching SASS eval
    if (value[i] === '{' && value[i - 1] !== '#') {
      return false;
    }
    i++;
  }
  return value[i] === ';';
};
