capture['sass include arguments'] = function (string, opt) {
  var m = string.match(/^(@include)\s+([a-zA-Z0-9\-\_]+)([^;]+?);/);
  var args = lasso.between(m[3], '(', ')').slice(-1)[0].value;
  return {
    scope : opt.scope,
    name : m[1],
    value : m[2],
    arguments : args.split(',').map(function (a) { return a.trim(); }),
    depth : opt.depth,
    strlen : m[0].length
  };
};
