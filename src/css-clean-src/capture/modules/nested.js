const between = require('lasso-string').between;
const capture = require('../capture');

function nested(buffer) {
  var start = 0;
  var end = 0;
  var value = '';
  var args;

  while (
    buffer.string[start] !== '{'
    && buffer.string[start - 1] !== '#'
  ) {
    start++;
  }

  args = buffer.string.substr(0, start).trim();
  value = between(buffer.string.substr(start), '{', '}');

  buffer.string = buffer.string.substr(start + value.end);

  return {
    content : value[1].trim(),
    arguments : args,
  };
}

module.exports = nested;
