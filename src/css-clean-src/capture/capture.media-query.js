capture['media query'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var m = c.arguments.split(' ');
  var name = m[0];
  var value = m.slice(1).join(' ');
  return {
    scope : opt.scope,
    content : c.content,
    name : name,
    value : splitByComma(value),
    depth : opt.depth,
    strlen : c.strlen
  };
};
