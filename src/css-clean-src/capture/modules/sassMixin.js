const nested = require('./nested');
const lasso = require('lasso-string');

function sassMixin(buffer) {
  let c = nested(buffer);
  let args = lasso.between(c.arguments, '(', ')');
  let m = c.arguments.match(/(@mixin)[ ]+([^\(]+)/);

  buffer.string = buffer.string.substr(c.length);

  return {
    arguments : args ? args[1].split(',').map(a => a.trim()) : '',
    content : c.content,
    name : m[1],
    value : m[2].trim()
  };
}

module.exports = sassMixin;
