capture['sass include block'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  return {
    scope : opt.scope,
    content : c.content,
    name : '@include',
    value : c.arguments.split(' ')[1],
    depth : opt.depth,
    strlen : c.strlen
  };
};
