capture['sass include arguments'] = function (string, opt) {
  var name = '';
  var value = '';
  var args = '';

  var i = 0;
  var n = string.length;
  var o = [0];

  // type
  if (string[i] === '@') {
    while (!/\s/.test(string[i]) && i < n) {
      name += string[i];
      i++;
    }
  }

  while (/\s/.test(string[i]) && i < n) {
    i++;
  }

  // function name
  while (!/\(/.test(string[i]) && i < n) {
    value += string[i];
    i++;
  }

  // function name
  if (string[i] === '(') {
    o[0] += 1;
    o.start = true;
    while (o > 0 && i < n) {
      if (!o.start && string[i] === '(') {
        o++;
      } else if (string[i] === ')') {
        o--;
      }

      args += string[i];
      o.start = false;
      i++;
    }
  }

  args = args.substr(1, args.length - 2)
    .split(',')
    .map(a => a.trim());

  return {
    scope : opt.scope,
    name : name,
    value : value,
    arguments : args,
    depth : opt.depth,
    strlen : i + 1
  };
};
