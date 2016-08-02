const nested = require('./nested');

function sassIncludeBlock(buffer) {
  let c = nested(buffer);

  buffer.string = buffer.string.substr(c.length);

  return {
    content : c.content,
    name : '@include',
    value : c.arguments.split(' ')[1],
  };
}

module.exports = sassIncludeBlock;
