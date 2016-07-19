const nested = require('./nested');

function fontFace(buffer) {
  let c = nested(buffer.string);

  buffer.string = buffer.string.substr(c.length);

  return {
    content : c.content,
    selector : c.arguments.split(',').map(a => a.trim()),
  };
}

module.exports = fontFace;
