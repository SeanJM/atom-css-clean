function sassReturn(buffer) {
  let m = buffer.string.match(/^(@return)([^;]+?);/);

  buffer.string = buffer.string.substr(m[0].length);

  return {
    name : m[1],
    value : m[2].trim()
  };
}

module.exports = sassReturn;
