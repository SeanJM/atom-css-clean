const nested = require('./nested');

function sassFor(buffer) {
  let c = nested(buffer);
  let m = c.arguments.split(' ');

  buffer.string = buffer.string.substr(c.length);

  return {
    name : m[0],
    content : c.content,
    value : m.slice(1).filter(a => a.length).join(' ')
  };
}

module.exports = sassFor;
