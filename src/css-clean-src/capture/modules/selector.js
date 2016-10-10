const nested = require('./nested');

function selector(buffer, depth) {
  let c = nested(buffer, depth);

  buffer.string = buffer.string.substr(c.length);

  return {
    content : c.content,
    selector : c.arguments.split(',').map(a => a.replace(/\s+/g, ' ').trim())
  };
}

module.exports = selector;
