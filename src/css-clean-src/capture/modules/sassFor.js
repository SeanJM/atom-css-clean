const nested = require('./nested');

function sassFor(buffer, depth) {
  let c = nested(buffer, depth);
  let m = c.arguments.split(' ');

  buffer.string = buffer.string.substr(c.length);

  return {
    name : m[0],
    content : c.content,
    value : m.slice(1).filter(a => a.length).join(' ')
  };
}

module.exports = sassFor;
