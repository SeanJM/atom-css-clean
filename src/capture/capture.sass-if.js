capture['sass if'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var m = c.arguments.match(/(@if|@else[ ]+if|@else)([\s\S]+|)/);
  var o = {
    scope : opt.scope,
    name : m[1],
    content : c.content,
    depth : opt.depth,
    strlen : c.strlen
  };
  if (m[1] === '@if' || m[1] === '@else if') {
    o.value = m[2].trim();
  }
  return o;
};
