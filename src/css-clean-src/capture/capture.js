const PROPERTIES_LIST = require('../PROPERTIES_LIST');

function isSelector(value) {
  var braceIndex = value.indexOf('{');
  var semiIndex = value.indexOf(';');
  return (
    /^([\>\@\.\%\#\*a-zA-Z0-9\[\]\+\~\=\"\'\_\-\:\&\n,\(\) ]+)/.test(value)
    && ((
      semiIndex > braceIndex
      && braceIndex !== -1
    ) || (
      semiIndex === -1
      && braceIndex !== -1
    ))
  );
}

function isPropertyGroup(value) {
  var startsWith = /^(\*|)[a-z\- ]+:/.test(value);
  var property = value.split(':')[0].trim();
  var inIndexed = PROPERTIES_LIST.indexOf(property) > -1;
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
  var s = value.string;

  if (s.substr(0, 2) === '//') {
    return 'comment inline';
  }

  if (s.substr(0, 2) === '/*')
    return 'comment block';

  if (/^\$[^:]+?:[^;]+?;/.test(value)) {
    return 'sass variable assignment';
  }

  if (s.substring(0, 7) === '@extend') {
    return 'sass extend';
  }

  if (s.substring(0, 7) === '@import') {
    return 'sass import';
  }

  if (s.substring(0, 8) === '@include') {
    if (/^@include\s+[a-zA-Z0-9\-\_\s]+\{/.test(value)) {
      return 'sass include block';
    }
    if (/^@include\s+[a-zA-Z0-9\-\_\s]+\(/.test(value)) {
      return 'sass include arguments';
    }
    return 'sass include';
  }

  if (s.substring(0, 6) === '@mixin') {
    return 'sass mixin';
  }

  if (s.substring(0, 9) === '@function') {
    return 'sass function';
  }

  if (s.substring(0, 7) === '@return') {
    return 'sass return';
  }

  if (s.substring(0, 3) === '@if') {
    return 'sass if';
  }

  if (s.substring(0, 4) === '@for') {
    return 'sass for';
  }

  if (s.substring(0, 5) === '@each') {
    return 'sass each';
  }

  if (/^@else[ ]+if/.test(s)) {
    return 'sass if';
  }

  if (s.substring(0, 5) === '@else') {
    return 'sass if';
  }

  if (s.substring(0, 10) === '@font-face') {
    return 'font face';
  }

  if (isSelector(s) && /^%|^[^\%^{]+?%[^\{]+?\{/.test(s)) {
    return 'sass placeholder';
  }

  if (s.substring(0, 6) === '@media') {
    return 'media query';
  }

  if (s.substring(0, 8) === '@charset') {
    return 'character set';
  }

  if (isPropertyGroup(s)) {
    return 'property group';
  }

  if (isSelector(s)) {
    return 'selector';
  }

  // In the future return 'unknown'
  return false;
}

function capture(that, group, depth) {
  var scope = getScope(that.value);
  var i = 0;
  var stackOverFlowIntMax = 10000;

  while (i++ < stackOverFlowIntMax && scope) {
    /*
      The return {
        scope : scope,
        name : m[1],
        value : m[2].trim(),
        depth : opt.depth,
        strlen : m[0].length
      }
    */
    group.push(
      Object.assign(
        {
          scope : scope,
          depth : depth
        },
        capture[scope](that.value)
      )
    );
    scope = getScope(that.value);
    i++;
  }

  if (i === stackOverFlowIntMax) {
    throw 'CSS Clean has stopped: There must be a problem with your CSS.';
  }

  return group;
}

// CSS
capture['character set'] = require('./modules/characterSet');
capture['comment block'] = require('./modules/commentBlock');
capture['comment inline'] = require('./modules/commentInline');
capture['font face'] = require('./modules/fontFace');
capture['media query'] = require('./modules/mediaQuery');
capture['property group'] = require('./modules/propertyGroup');
capture.selector = require('./modules/selector');

// SASS
capture['sass each'] = require('./modules/sassEach');
capture['sass extend'] = require('./modules/sassExtend');
capture['sass for'] = require('./modules/sassFor');
capture['sass function'] = require('./modules/sassFunction');
capture['sass if'] = require('./modules/sassIf');
capture['sass import'] = require('./modules/sassImport');
capture['sass include arguments'] = require('./modules/sassIncludeArguments');
capture['sass include block'] = require('./modules/sassIncludeBlock');
capture['sass include'] = require('./modules/sassInclude');
capture['sass mixin'] = require('./modules/sassMixin');
capture['sass placeholder'] = require('./modules/sassPlaceholder');
capture['sass return'] = require('./modules/sassReturn');
capture['sass variable assignment'] = require('./modules/sassVariableAssignment');

module.exports = capture;
