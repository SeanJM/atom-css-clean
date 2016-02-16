capture['comment block'] = function (string, opt) {
  var i = 0;
  var s = string.substring(0, i);
  var o;
  var c;
  var v;
  while (true) {
    i += 1;
    s = string.substring(0, i);
    o = s.match(/\/\*/g) || [];
    c = s.match(/\*\//g) || [];
    if (o.length > 0 && o.length === c.length) {
      v = lasso.between(s, '/*', '*/').slice(-1)[0];
      return {
        scope : opt.scope,
        value : v.value.trim().split('\n'),
        depth : opt.depth,
        strlen : v.capture.index + v.capture.length
      };
    }
  }
};
