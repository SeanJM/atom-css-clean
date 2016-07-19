function commentBlock(buffer) {
  let i = 0;
  let s = buffer.string.substring(0, i);
  let o;
  let c;
  let v;

  while (true) {
    i += 1;
    s = buffer.string.substring(0, i);
    o = s.match(/\/\*/g) || [];
    c = s.match(/\*\//g) || [];

    if (o.length > 0 && o.length === c.length) {
      v = lasso.between(s, '/*', '*/').slice(-1)[0];

      buffer.string = buffer.string.substr(v.capture.index + v.capture.length);

      return {
        value : v.value.trim().split('\n'),
      };
    }
  }
}

module.exports = commentBlock;