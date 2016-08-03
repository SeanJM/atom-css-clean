const PROPERTIES_LIST = require('../PROPERTIES_LIST');

var prototype = {};

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

function getScope(string) {
  if (string.substr(0, 2) === '//') {
    return 'comment inline';
  }

  if (string.substr(0, 2) === '/*')
    return 'comment block';

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

  if (isSelector(string) && /^%|^[^\%^{]+?%[^\{]+?\{/.test(string)) {
    return 'sass placeholder';
  }

  if (string.substring(0, 6) === '@media') {
    return 'media query';
  }

  if (string.substring(0, 8) === '@charset') {
    return 'character set';
  }

  if (isPropertyGroup(string)) {
    return 'property group';
  }

  if (isSelector(string)) {
    return 'selector';
  }

  // In the future return 'unknown'
  return false;
}

function capture(that, group, depth) {
  var scope = getScope(that.buffer.string);
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
        prototype[scope](that.buffer, depth)
      )
    );

    that.buffer.string = that.buffer.string.trim();


    scope = getScope(that.buffer.string);
    i++;
  }

  if (i === stackOverFlowIntMax) {
    throw 'CSS Clean has stopped: There must be a problem with your CSS.';
  }

  return group;
}

// CSS
prototype['character set'] = require('./modules/characterSet');
prototype['comment block'] = require('./modules/commentBlock');
prototype['comment inline'] = require('./modules/commentInline');
prototype['font face'] = require('./modules/fontFace');
prototype['media query'] = require('./modules/mediaQuery');
prototype['property group'] = require('./modules/propertyGroup');
prototype.selector = require('./modules/selector');

// SASS
prototype['sass each'] = require('./modules/sassEach');
prototype['sass extend'] = require('./modules/sassExtend');
prototype['sass for'] = require('./modules/sassFor');
prototype['sass function'] = require('./modules/sassFunction');
prototype['sass if'] = require('./modules/sassIf');
prototype['sass import'] = require('./modules/sassImport');
prototype['sass include arguments'] = require('./modules/sassIncludeArguments');
prototype['sass include block'] = require('./modules/sassIncludeBlock');
prototype['sass include'] = require('./modules/sassInclude');
prototype['sass mixin'] = require('./modules/sassMixin');
prototype['sass placeholder'] = require('./modules/sassPlaceholder');
prototype['sass return'] = require('./modules/sassReturn');
prototype['sass variable assignment'] = require('./modules/sassVariableAssignment');

module.exports = capture;
