const nested = require('./nested');
const lasso = require('lasso-string');

function sassFunction(buffer, depth) {
  let c = nested(buffer, depth);
  let args = lasso.between(c.arguments, '(', ')');
  let m = c.arguments.match(/(@function)\s+([^)]+?)\(/);

  buffer.string = buffer.string.substr(c.length);

  return {
    content : c.content,
    name : m[1],
    value : m[2].trim(),
    arguments : args
      ? args[1].split(',').map(a => a.trim())
      : ''
  };
}

module.exports = sassFunction;
