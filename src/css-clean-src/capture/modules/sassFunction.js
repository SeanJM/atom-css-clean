const nested = require('./nested');
const lasso = require('lasso-string');

function sassFunction(buffer) {
  let c = nested(buffer);
  let args = lasso.between(c.arguments, '(', ')').slice(-1)[0].value;
  let m = c.arguments.match(/(@function)\s+([^)]+?)\(/);

  buffer.string = buffer.string.substr(c.length);

  return {
    content : c.content,
    name : m[1],
    value : m[2].trim(),
    arguments : args.split(',').map(function (a) { return a.trim(); })
  };
}

module.exports = sassFunction;
