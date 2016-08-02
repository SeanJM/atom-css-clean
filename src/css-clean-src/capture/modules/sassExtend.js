function sassExtend(buffer) {
  let m = buffer.string.match(/^(@extend)([^;]+?);/);

  buffer.string = buffer.string.substr(m[0].length);

  return {
    name : m[1],
    value : m[2].trim()
  };
}

module.exports = sassExtend;
