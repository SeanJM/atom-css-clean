(function () {
  function pushLine(lines, v, i) {
    var x;

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
    var i = line.indexOf(startChr) + 1;
    var n = line.length;
    var chunk = '';

    while (line[i] !== untilChr && i < n) {
      chunk += line[i];
      i++;
    }

    return chunk.trim();
  }

  capture['media query'] = function (string, opt) {
    var c = capture.shared.nested(string, opt);
    var m = c.arguments.split(' ');
    var name = m[0];
    var value = m.slice(1).join(' ').replace(/\s+|\n/g, ' ');

    value = splitByComma(value);

    value = value.map(function (v) {
      var lines = [''];
      var i = 0;
      var n = v.length;

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
        var property;
        var value;

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

    return {
      scope : opt.scope,
      content : c.content,
      name : name,
      value : value,
      depth : opt.depth,
      strlen : c.strlen
    };
  };
}());
