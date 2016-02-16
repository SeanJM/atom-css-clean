capture['sass mixin'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var args = lasso.between(c.arguments, '(', ')');
  var m = c.arguments.split(' ').filter((a) => a.length);
  var o = {
    arguments : false,
    content : c.content,
    depth : opt.depth,
    name : m[0],
    scope : opt.scope,
    strlen : c.strlen,
    value : m[2],
  };
  if (args.length) {
    args = args.slice(-1)[0].value;
    o.arguments = args.split(',').map((a) => a.trim());
  }
  return o;
};
