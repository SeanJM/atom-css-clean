(function () {
  function isSelector(value) {
    var selector = /^([\>\@\.\%\#\*a-zA-Z0-9\[\]\+\~\=\"\'\_\-\:\&\n,\(\) ]+)/.test(value);
    var braceIndex = value.indexOf('{');
    var semiIndex = value.indexOf(';');
    var braceBefore = semiIndex > braceIndex && braceIndex !== -1 || semiIndex === -1 && braceIndex !== -1;

    return selector && braceBefore;
  }

  function isPropertyGroup(value) {
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
  }

  function getScope(value) {
    if (value.substr(0, 2) === '//') {
      return 'comment inline';
    }

    if (value.substr(0, 2) === '/*') {
      return 'comment block';
    }

    if (/^\$[^:]+?:[^;]+?;/.test(value)) {
      return 'sass variable assignment';
    }

    if (value.substring(0, 7) === '@extend') {
      return 'sass extend';
    }

    if (value.substring(0, 7) === '@import') {
      return 'sass import';
    }

    if (value.substring(0, 8) === '@include') {
      if (/^@include\s+[a-zA-Z0-9\-\_\s]+\{/.test(value)) {
        return 'sass include block';
      }
      if (/^@include\s+[a-zA-Z0-9\-\_\s]+\(/.test(value)) {
        return 'sass include arguments';
      }
      return 'sass include';
    }

    if (value.substring(0, 6) === '@mixin') {
      return 'sass mixin';
    }

    if (value.substring(0, 9) === '@function') {
      return 'sass function';
    }

    if (value.substring(0, 7) === '@return') {
      return 'sass return';
    }

    if (value.substring(0, 3) === '@if') {
      return 'sass if';
    }

    if (value.substring(0, 4) === '@for') {
      return 'sass for';
    }

    if (value.substring(0, 5) === '@each') {
      return 'sass each';
    }

    if (/^@else[ ]+if/.test(value)) {
      return 'sass if';
    }

    if (value.substring(0, 5) === '@else') {
      return 'sass if';
    }

    if (value.substring(0, 10) === '@font-face') {
      return 'font face';
    }

    if (isSelector(value) && /^%|^[^\%^{]+?%[^\{]+?\{/.test(value)) {
      return 'sass placeholder';
    }

    if (value.substring(0, 6) === '@media') {
      return 'media query';
    }

    if (value.substring(0, 8) === '@charset') {
      return 'character set';
    }

    if (isPropertyGroup(value)) {
      return 'property group';
    }

    if (isSelector(value)) {
      return 'selector';
    }

    // In the future return 'unknown'
    return false;
  }

  function capture(that, group, depth) {
    var scope = getScope(that.value);
    var i = 0;
    var c;
    var stackOverFlowIntMax = 10000;

    while (i++ < stackOverFlowIntMax && scope) {
      if (typeof capture[scope] === 'undefined') {
        throw 'Missing \'' + scope + '\' method for \'capture\' function.';
      }

      c = capture[scope](value, {
        group : group,
        scope : scope
      });

      group.push(c);
      value = value.slice(c.strlen).trim();
      scope = getScope(value);
    }

    if (i === stackOverFlowIntMax) {
      throw 'CSS Clean has stopped: There must be a problem with your CSS.';
    }

    return group;
  }

  capture.shared = {};

  if (module) {
    module.exports = capture;
  }
}());
