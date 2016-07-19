function commentInline(buffer) {
  const endOfLine = ['\n', '}'];

  let v = '';
  let i = 0;
  let n = buffer.string.length;

  while (
    endOfLine.indexOf(buffer.string[i]) === -1
    && i < n
  ) {
    v += buffer.string[i];
    i++;
  }

  buffer.string = buffer.string.substr(i);

  return {
    value : v.replace(/^\/\/(\s+|)/, ''),
  };
}

module.exports = commentInline;
