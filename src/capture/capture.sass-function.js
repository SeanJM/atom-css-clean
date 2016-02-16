capture['sass function'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var args = lasso.between(c.arguments, '(', ')').slice(-1)[0].value;
  var m = c.arguments.match(/(@function)\s+([^)]+?)\(/);
  return {
    scope : opt.scope,
    content : c.content,
    name : m[1],
    value : m[2].trim(),
    arguments : args.split(',').map(function (a) { return a.trim(); }),
    depth : opt.depth,
    strlen : c.strlen
  };
};
