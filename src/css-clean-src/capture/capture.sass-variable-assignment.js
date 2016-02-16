capture['sass variable assignment'] = function (string, opt) {
  var m = string.match(/([^:]+?):([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1].trim(),
    value : m[2].trim(),
    depth : opt.depth,
    strlen : m[0].length
  };
};
