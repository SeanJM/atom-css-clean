capture.shared.nested = function (string, opt) {
  var i = 0;
  var start = 0;
  var args = string.substr(i, 2);
  var o;
  var c;
  var v;
  while (args.slice(1) !== '{' && args[0] === '#' || args === '#{' || args.slice(1) !== '{') {
    i += 1;
    args = string.substr(i, 2);
  }
  args = string.substr(0, i);
  start = args.length;
  o = string.substr(start, i).match(/\{/g) || [];
  c = string.substr(start, i).match(/\}/g) || [];
  i = 0;
  while (true) {
    i += 1;
    o = string.substr(start, i).match(/\{/g) || [];
    c = string.substr(start, i).match(/\}/g) || [];
    if (o.length > 0 && o.length === c.length) {
      v = lasso.between(string.substr(start, i), '{', '}').slice(-1)[0];
      return {
        scope : opt.scope,
        content : capture(v.value.trim(), [], opt.depth + 1),
        arguments : args.trim(),
        depth : opt.depth,
        strlen : args.length + v.capture.index + v.capture.length,
      };
    }
    if (i === 10000) {
      throw 'There is an error with your CSS on this match: ' + string;
    }
  }
};
