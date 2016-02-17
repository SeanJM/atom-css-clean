capture['property group'] = function (string, opt) {
  var m = string.match(/([^:]+?):([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1].trim(),
    value : m[2].trim().replace(/\n/g, ''),
    depth : opt.depth,
    strlen : m[0].length
  };
};
