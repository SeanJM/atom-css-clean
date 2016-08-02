function sassImport(buffer) {
  let m = buffer.string.match(/^(@import)([^;]+?);/);

  buffer.string = buffer.string.substr(m[0].length);

  return {
    name : m[1],
    value : m[2].split(',').map(a => a.trim().replace(/^\'|\'$|^\"|\"$/g, ''))
  };
}

module.exports = sassImport;
