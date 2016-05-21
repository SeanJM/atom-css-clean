function capture(string, group, depth) {
  var scope;
  var i = 0;
  var n;
  var c;
  var stackOverFlowIntMax = 10000;

  function getScope(string) {
    if (string.substr(0, 2) === '//') {
      return 'comment inline';
    }
    if (string.substr(0, 2) === '/*') {
      return 'comment block';
    }
    if (/^\$[^:]+?:[^;]+?;/.test(string)) {
      return 'sass variable assignment';
    }
    if (string.substring(0, 7) === '@extend') {
      return 'sass extend';
    }
    if (string.substring(0, 7) === '@import') {
      return 'sass import';
    }
    if (string.substring(0, 8) === '@include') {
      if (/^@include\s+[a-zA-Z0-9\-\_\s]+\{/.test(string)) {
        return 'sass include block';
      }
      if (/^@include\s+[a-zA-Z0-9\-\_\s]+\(/.test(string)) {
        return 'sass include arguments';
      }
      return 'sass include';
    }
    if (string.substring(0, 6) === '@mixin') {
      return 'sass mixin';
    }
    if (string.substring(0, 9) === '@function') {
      return 'sass function';
    }
    if (string.substring(0, 7) === '@return') {
      return 'sass return';
    }
    if (string.substring(0, 3) === '@if') {
      return 'sass if';
    }
    if (string.substring(0, 4) === '@for') {
      return 'sass for';
    }
    if (string.substring(0, 5) === '@each') {
      return 'sass each';
    }
    if (/^@else[ ]+if/.test(string)) {
      return 'sass if';
    }
    if (string.substring(0, 5) === '@else') {
      return 'sass if';
    }
    if (string.substring(0, 10) === '@font-face') {
      return 'font face';
    }
    if (is.selector(string) && /^%|^[^\%^{]+?%[^\{]+?\{/.test(string)) {
      return 'sass placeholder';
    }
    if (string.substring(0, 6) === '@media') {
      return 'media query';
    }
    if (string.substring(0, 8) === '@charset') {
      return 'character set';
    }
    if (is.propertyGroup(string)) {
      return 'property group';
    }
    if (is.selector(string)) {
      return 'selector';
    }
    // In the future return 'unknown'
    return false;
  }

  string = string.trim();
  scope = getScope(string);

  while (i++ < stackOverFlowIntMax && scope) {
    if (typeof capture[scope] === 'undefined') {
      throw 'Missing \'' + scope + '\' method for \'capture\' function.';
    }

    c = capture[scope](string, {
      group : group,
      scope : scope
    });

    group.push(c);
    string = string.slice(c.strlen).trim();
    scope = getScope(string);
  }

  if (i === stackOverFlowIntMax) {
    throw 'CSS Clean has stopped: There must be a problem with your CSS.';
  }

  return group;
}

capture.shared = {};
