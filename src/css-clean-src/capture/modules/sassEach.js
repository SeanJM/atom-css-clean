const nested = require('./nested');

function sassEach(buffer) {
  let c = nested(buffer);
  let m = c.arguments.split(' ');

  buffer.string = buffer.string.substr(c.length);

  return {
    name : m[0],
    value : m.slice(1).map(a => a.trim()).filter(a => a.length).join(' '),
    content : c.content
  };
}

module.exports = sassEach;
