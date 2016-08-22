const path = require('path');
const between = require('lasso-string').between;

function nested(buffer, depth) {
  const capture = require('../capture'); // will only work when called at run time

  let start = 0;
  let end = 0;
  let value = '';
  var bool = true;
  let n = buffer.string.length;
  let args;

  while (bool) {
    start++;
    if ((
      buffer.string[start] === '{'
      && buffer.string.substr(start - 1, 2) !== '#{'
      ) || (
      start === n
    )) {
      bool = false;
    }
  }

  args = buffer.string.substr(0, start).trim();
  value = between(buffer.string.substr(start), '{', '}');

  buffer.string = buffer.string.substr(start + value.end);

  return {
    content : capture({ buffer : { string : value[1].trim() } }, [], depth),
    arguments : args,
  };
}

module.exports = nested;
