capture.scope = function (value) {
  var selector = /^([\@\.\%\#\*a-zA-Z0-9\[\]\+\~\=\"\'\_\-\:\&\n,\(\) ]+)/;
  if (value.substr(0, 2) === '//') {
    return 'comment inline';
  }
  if (value.substr(0, 2) === '/*') {
    return 'comment block';
  }
  if (/^\$[^:]+?:[^;]+?;/.test(value)) {
    return 'sass variable assignment';
  }
  if (/^(\*|)[a-z\- ]+:[^;]+?;/.test(value)) {
    return 'property group';
  }
  if (value.substring(0, 7) === '@extend') {
    return 'sass extend';
  }
  if (value.substring(0, 7) === '@import') {
    return 'sass import';
  }
  if (value.substring(0, 8) === '@include') {
    if (/^@include\s+[^ ]+?\s+\{/.test(value)) {
      return 'sass include block';
    }
    if (/^@include\s+[^ ]+?\(/.test(value)) {
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
  if (selector.test(value) && /^%|^[^\%^{]+?%[^\{]+?\{/.test(value)) {
    return 'sass placeholder';
  }
  if (selector.test(value)) {
    return 'selector';
  }
  return false;
};
