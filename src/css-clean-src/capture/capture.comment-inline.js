capture['comment inline'] = function (string, opt) {
  var value = '';
  var i = 0;
  var n = string.length;

  while (['\n', '}'].indexOf(string[i]) === -1 && i < n) {
    value += string[i];
    i++;
  }

  return {
    scope : opt.scope,
    value : value.replace(/^\/\/(\s+|)/, ''),
    depth : opt.depth,
    strlen : i
  };
};
