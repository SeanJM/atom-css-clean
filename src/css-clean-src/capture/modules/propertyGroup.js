function propertyGroup(buffer) {
  let n = buffer.string.length;
  let i = 0;
  let m;

  while (buffer.string[i] !== ';' && i < n) {
    i++;
  }

  m = buffer.string.substr(0, i).split(':').map(a => a.trim());

  buffer.string = buffer.string.substr(i + 1);

  return {
    name : m[0],
    value : m.slice(1).join(':').replace(/\n/g, '').replace(/;$/, '')
  };
}

module.exports = propertyGroup;
