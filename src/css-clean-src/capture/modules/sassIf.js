const nested = require('./nested');

function sassIf(buffer, depth) {
  let c = nested(buffer, depth);
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
