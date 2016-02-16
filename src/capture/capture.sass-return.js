capture['sass return'] = function (string, opt) {
  var m = string.match(/^(@return)([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1],
    value : m[2].trim(),
    depth : opt.depth,
    strlen : m[0].length
  };
};
