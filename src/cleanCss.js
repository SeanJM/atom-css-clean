function cleanCss(string) {
  var selectorMatch = /([\@\.\%\#\*a-zA-Z0-9\[\]\+\~\=\"\'\_\-\:\&\n,\(\) ]+)\{[\s\S]+\}/;
  var _             = cleanCss.microdash;
  var cssGroup      = [];
  function getTabspaceLength() {
    var tabStart = string.match(/(^[ \t]+|;[ \t]+)[a-zA-Z0-9\-\.\#\[\%\@]+/mg);
    if (tabStart === null) {
      return 2;
    } else if (tabStart.length === 1) {
      return tabStart[0].match(/[ \t]+/)[0].length;
    }
    return tabStart.slice(0, 10).reduce(function (a, b) {
      var as = a.match(/[ \t]+/)[0];
      var bs = b.match(/[ \t]+/)[0];
      var al = as.length;
      var bl = bs.length;
      if (al < bl) {
        return as;
      } else if (bl < al) {
        return bs;
      }
      return as;
    }).length;
  }
  function matchLength(s, b) {
    var match = s.match(new RegExp(b, 'g'));
    return !!match ? match.length : 0;
  }
  function hasGroup(s) {
    return s.indexOf('{') > -1 && s.indexOf('}') > -1;
  }
  function contentToArray(cssObj) {
    var longestProperty = 0;
    if (cssObj.content.trim().length) {
      cssObj.content = cssObj.content
      .replace(/\n[ \t]+/g, '')
      .replace(/((?:\*|)[a-z\-]+)(\s+|):(\s+|)/g, function (m, property) {
        return '\n' + property + ':';
      })
      .replace(/(@[a-z\-]+)(\s+)/g, function (m, property) {
        return '\n' + property + ' ';
      })
      .trim()
      .split('\n')
      .map(function (m) {
        if (/^@/.test(m)) {
          m = m.replace(/(\s+|);(\s+|)/, '').match(/(@[a-z\-]+)(?:\s+)([\s\S]+)/).slice(1, 3);
        } else {
          m = m.replace(/(\s+|);(\s+|)/, '').split(':');
        }
        // Get longest property value
        if (m[0].length > longestProperty) {
          longestProperty = m[0].length;
        }
        return {
          property       : m[0],
          value          : m[1],
          propertyLength : m[0].length
        }
      });
      cssObj.longestProperty = longestProperty;
    } else {
      cssObj.content = [];
    }
    return cssObj;
  }
  function trimValue(s) {
    var i = 0;
    while (/^(\s+|)\/\/[\s\S]+\n/.test(s)) {
      i = s.indexOf('\n') + 1;
      s = s.substring(i, s.length).replace(/^\s+/g, '');
    }
    while (/^(\s+|)\n/.test(s)) {
      i = s.indexOf('\n') + 1;
      s = s.substring(i, s.length).replace(/^\s+/g, '');
    }
    while (/^(\s+|)\/\*[\s\S]+?\*\//.test(s)) {
      i = s.indexOf('*/') + 2;
      s = s.substring(i, s.length).replace(/^\s+/g, '');
    }
    return s;
  }
  function getContentAndRemoveComments(value) {
    var start  = value.indexOf('{') + 1;
    var end    = value.lastIndexOf('}');
    var string = value.substring(start, end);
    return string.replace(/\/\/[^\n]+?\n|\/\*[\s\S]+?\*\//g, '');
  }
  function getSelectorAndConvertToList(value) {
    return value.match(selectorMatch)[1].split(',').map(function (a) {
      return a.trim();
    });
  }
  function getGroup(string, _cssGroup_, tabLength) {
    var cssObj = {};
    var value;
    var open;
    var closed;
    var groups;
    for (var i = 0, n = string.length; i <= n; i++) {
      value  = string.substring(0, i);
      open   = matchLength(value, '{');
      closed = matchLength(value, '}');
      if (open === closed && open > 0) {
        value  = trimValue(value);
        cssObj = {
          value     : value.match(selectorMatch)[0].trim(),
          content   : getContentAndRemoveComments(value),
          selector  : getSelectorAndConvertToList(value),
          tabLength : tabLength,
          tabs      : /^\t/m.test(value)
        };
        if (hasGroup(cssObj.content)) {
          cssObj.child = [];
          groups       = getGroup(cssObj.content, cssObj.child, tabLength + 2);
          groups.forEach(function (group) {
            cssObj.content = cssObj.content.replace(group.value, '').replace(/\n[ \t]+\n/g, '\n');
          });
        }
        _cssGroup_.push(contentToArray(cssObj));
        if (hasGroup(string)) {
          getGroup(string.substring(i, string.length), _cssGroup_, tabLength);
        }
        i = n;
      }
    }
    return _cssGroup_;
  }
  cssGroup.string = string;
  return cleanCss.fn(getGroup(string, cssGroup, getTabspaceLength()));
}
