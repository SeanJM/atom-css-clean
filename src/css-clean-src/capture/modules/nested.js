function nested(buffer) {
  let i = 0;
  let start = 0;
  let open;
  let closed;
  let v;
  let args;

  function getArguments(i) {
    while (buffer.string[i] !== '{') {
      i += 1;
    }

    if (string[i - 1] === '#') {
      i = getArguments(i + 1);
    }

    return i;
  }

  args = buffer.string.substr(0, getArguments(0));

  start = args.length;
  o = buffer.string.substr(start, i).match(/\{/g) || [];
  c = buffer.string.substr(start, i).match(/\}/g) || [];
  i = 0;

  while (i < buffer.string.length) {
    i += 1;
    o = buffer.string.substr(start, i).match(/\{/g) || [];
    c = buffer.string.substr(start, i).match(/\}/g) || [];

    if (o.length > 0 && o.length === c.length) {
      v = lasso.between(buffer.string.substr(start, i), '{', '}').slice(-1)[0];

      return {
        content : capture(v.value.trim(), [], opt.depth + 1),
        arguments : args.trim(),
        length : args.length + v.capture.index + v.capture.length,
      };
    }
  }
}

module.exports = nested;
