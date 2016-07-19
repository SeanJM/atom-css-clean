const nested = require('./nested');
const lasso = require('src/vendor/lasso.min');

function sassMixin(buffer) {
  let c = nested(buffer);
  let args = lasso.between(c.arguments, '(', ')');
  let m = c.arguments.match(/(@mixin)[ ]+([^\(]+)/);

  let o = {
    content : c.content,
    name : m[1],
    value : m[2].trim()
  };

  buffer.string = buffer.string.substr(c.length);

  if (args.length) {
    args = args.slice(-1)[0].value;
    o.arguments = args.split(',').map(a => a.trim());
  }

  return o;
}

module.exports = sassMixin;
