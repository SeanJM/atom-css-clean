capture.shared.nested = function (string, opt) {
  var i = 0;
  var start = 0;
  var open;
  var closed;
  var v;
  var args;

  function getArguments(i) {
    while (string[i] !== '{') {
      i += 1;
    }

    if (string[i - 1] === '#') {
      i = getArguments(i + 1);
    }

    return i;
  }

  args = string.substr(0, getArguments(0));

  start = args.length;
  o = string.substr(start, i).match(/\{/g) || [];
  c = string.substr(start, i).match(/\}/g) || [];
  i = 0;

  while (i < string.length) {
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

  }
};
