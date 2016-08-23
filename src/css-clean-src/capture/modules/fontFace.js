const nested = require('./nested');

function fontFace(buffer, depth) {
  let c = nested(buffer, depth);

  buffer.string = buffer.string.substr(c.length);

  return {
    content : c.content,
    selector : c.arguments.split(',').map(a => a.trim()),
  };
}

module.exports = fontFace;
