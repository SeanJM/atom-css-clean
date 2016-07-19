const nested = require('./nested');

function pushLine(lines, v, i) {
  let x;

  if (lines[lines.length - 1].length) {
    lines.push('');
  }

  x = lines.length - 1;

  while (v.substr(i + 1, 3) !== 'and' && v[i]) {
    lines[x] = lines[x].concat(v[i]);
    i++;
  }

  return i;
}

function getChunk(line, startChr, untilChr) {
  let i = line.indexOf(startChr) + 1;
  let n = line.length;
  let chunk = '';

  while (line[i] !== untilChr && i < n) {
    chunk += line[i];
    i++;
  }

  return chunk.trim();
}

function mediaQuery(buffer) {
  let c = nested(buffer);
  let m = c.arguments.split(' ');
  let name = m[0];
  let value = m.slice(1).join(' ').replace(/\s+|\n/g, ' ');

  value = splitByComma(value);

  value = value.map(function (v) {
    let lines = [''];
    let i = 0;
    let n = v.length;

    for (; i < n; i++) {
      if (v.substr(i, 4) === 'only' && [' ', '('].indexOf(v[i + 4]) !== -1) {
        i = pushLine(lines, v, i);
      } else if (v.substr(i, 3) === 'and' && [' ', '('].indexOf(v[i + 3]) !== -1) {
        i = pushLine(lines, v, i);
      } else {
        lines[lines.length - 1] = lines[lines.length - 1].concat(v[i]);
      }
    }

    return lines.map(function (line) {
      let property;
      let value;

      if (line.substr(0, 4) === 'only' || line.substr(0, 3) !== 'and') {
        return { mediaType : line };
      }

      return {
        operator : line.split(' ')[0],
        property : getChunk(line, '(', ':'),
        value : getChunk(line, ':', ')')
      };
    });
  });

  buffer.string = buffer.string.substr(c.length);

  return {
    content : c.content,
    name : name,
    value : value
  };
}

module.exports = mediaQuery;
