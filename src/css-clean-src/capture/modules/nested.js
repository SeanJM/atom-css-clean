const path = require('path');
const between = require('lasso-string').between;

function nested(buffer, depth) {
  const capture = require('../capture'); // will only work when called at run time

  let start = 0;
  let end = 0;
  let value = '';
  let args;
  let that;

  while (
    buffer.string[start] !== '{'
    && buffer.string[start - 1] !== '#'
  ) {
    start++;
  }

  args = buffer.string.substr(0, start).trim();
  value = between(buffer.string.substr(start), '{', '}');

  buffer.string = buffer.string.substr(start + value.end);

  // 'value' is the buffer
  that = {
    value : {
      string : value[1].trim()
    }
  };

  return {
    content : capture(that, [], depth),
    arguments : args,
  };
}

module.exports = nested;
