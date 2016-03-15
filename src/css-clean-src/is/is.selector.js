is.selector = function (value) {
  var selector = /^([\@\.\%\#\*a-zA-Z0-9\[\]\+\~\=\"\'\_\-\:\&\n,\(\) ]+)/.test(value);
  var braceIndex = value.indexOf('{');
  var semiIndex = value.indexOf(';');
  var braceBefore = semiIndex > braceIndex && braceIndex !== -1 || semiIndex === -1 && braceIndex !== -1;

  return selector && braceBefore;
};
