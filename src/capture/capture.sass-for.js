capture['sass for'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var m = c.arguments.split(' ');
  var name = m[0];
  var value = m.slice(1).filter((a) => a.length).join(' ');
  return {
    scope : c.scope,
    name : m[0],
    value : value,
    content : c.content,
    depth : c.depth,
    strlen : c.strlen
  };
};
