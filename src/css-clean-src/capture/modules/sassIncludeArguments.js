function sassIncludeArguments(buffer) {
  let name = '';
  let value = '';
  let args = '';

  let i = 0;
  let n = buffer.string.length;
  let o = [0];

  // type
  if (buffer.string[i] === '@') {
    while (!/\s/.test(buffer.string[i]) && i < n) {
      name += buffer.string[i];
      i++;
    }
  }

  // Remove the whitespace
  while (/\s/.test(buffer.string[i]) && i < n) {
    i++;
  }

  // function name
  while (!/\(/.test(buffer.string[i]) && i < n) {
    value += buffer.string[i];
    i++;
  }

  // function name
  if (buffer.string[i] === '(') {
    o[0] += 1;
    o.start = true;
    while (o > 0 && i < n) {
      if (!o.start && buffer.string[i] === '(') {
        o++;
      } else if (buffer.string[i] === ')') {
        o--;
      }

      args += buffer.string[i];
      o.start = false;
      i++;
    }
  }

  args = args.substr(1, args.length - 2)
    .split(',')
    .map(a => a.trim());

  buffer.string = buffer.string.substr(i + 1);

  return {
    name : name,
    value : value,
    arguments : args
  };
}

module.exports = sassIncludeArguments;
