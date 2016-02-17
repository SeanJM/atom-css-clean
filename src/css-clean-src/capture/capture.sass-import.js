capture['sass import'] = function (string, opt) {
  var m = string.match(/^(@import)([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1],
    value : m[2].split(',').map((a) => a.trim().replace(/^\'|\'$|^\"|\"$/g, '')),
    depth : opt.depth,
    strlen : m[0].length
  };
};
