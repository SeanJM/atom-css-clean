function sassVariableAssignment(buffer) {
  let m = buffer.string.match(/([^:]+?):([^;]+?);/);

  buffer.string = buffer.string.substr(m[0].length);

  return {
    name : m[1].trim(),
    value : m[2].trim()
  };
}

module.exports = sassVariableAssignment;
