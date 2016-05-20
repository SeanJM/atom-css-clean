capture['character set'] = function (string, opt) {
  var m = string.match(/^(@charset)([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1],
    value : m[2].trim(),
    depth : opt.depth,
    strlen : m[0].length
  };
};
