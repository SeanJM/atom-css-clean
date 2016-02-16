capture['comment inline'] = function (string, opt) {
  var m = string.match(/[^\n]+\n/);
  return {
    scope : opt.scope,
    value : m[0].slice(2).trim(),
    depth : opt.depth,
    strlen : m[0].length
  };
};
