const nested = require('./nested');

function sassIf(buffer) {
  let c = nested(buffer);
  let m = c.arguments.match(/(@if|@else[ ]+if|@else)([\s\S]+|)/);

  buffer.string = buffer.string.substr(c.length);

  return {
    name : m[1],
    content : c.content,
    value : m[1] === '@if' || m[1] === '@else if'
      ? m[2].trim()
      : undefined
  };
}

module.exports = sassIf;
