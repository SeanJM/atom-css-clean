function capture(string, group, depth) {
  var scope;
  var i = 0;
  var n;
  var c;
  var stackOverFlowIntMax = 10000;

  function getScope(string) {
    if (string.substr(0, 2) === '//') {
      return 'comment inline';
    }
    if (string.substr(0, 2) === '/*') {
      return 'comment block';
    }
    if (/^\$[^:]+?:[^;]+?;/.test(string)) {
      return 'sass variable assignment';
    }
    if (string.substring(0, 7) === '@extend') {
      return 'sass extend';
    }
    if (string.substring(0, 7) === '@import') {
      return 'sass import';
    }
    if (string.substring(0, 8) === '@include') {
      if (/^@include\s+[a-zA-Z0-9\-\_\s]+\{/.test(string)) {
        return 'sass include block';
      }
      if (/^@include\s+[a-zA-Z0-9\-\_\s]+\(/.test(string)) {
        return 'sass include arguments';
      }
      return 'sass include';
    }
    if (string.substring(0, 6) === '@mixin') {
      return 'sass mixin';
    }
    if (string.substring(0, 9) === '@function') {
      return 'sass function';
    }
    if (string.substring(0, 7) === '@return') {
      return 'sass return';
    }
    if (string.substring(0, 3) === '@if') {
      return 'sass if';
    }
    if (string.substring(0, 4) === '@for') {
      return 'sass for';
    }
    if (string.substring(0, 5) === '@each') {
      return 'sass each';
    }
    if (/^@else[ ]+if/.test(string)) {
      return 'sass if';
    }
    if (string.substring(0, 5) === '@else') {
      return 'sass if';
    }
    if (string.substring(0, 10) === '@font-face') {
      return 'font face';
    }
    if (is.selector(string) && /^%|^[^\%^{]+?%[^\{]+?\{/.test(string)) {
      return 'sass placeholder';
    }
    if (string.substring(0, 6) === '@media') {
      return 'media query';
    }
    if (string.substring(0, 8) === '@charset') {
      return 'character set';
    }
    if (is.propertyGroup(string)) {
      return 'property group';
    }
    if (is.selector(string)) {
      return 'selector';
    }
    // In the future return 'unknown'
    return false;
  }

  string = string.trim();
  scope = getScope(string);

  while (i++ < stackOverFlowIntMax && scope) {
    if (typeof capture[scope] === 'undefined') {
      throw 'Missing \'' + scope + '\' method for \'capture\' function.';
    }

    c = capture[scope](string, {
      group : group,
      scope : scope
    });

    group.push(c);
    string = string.slice(c.strlen).trim();
    scope = getScope(string);
  }

  if (i === stackOverFlowIntMax) {
    throw 'CSS Clean has stopped: There must be a problem with your CSS.';
  }

  return group;
}

capture.shared = {};

capture.selector = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  
  return {
    scope : opt.scope,
    content : c.content,
    selector : c.arguments.split(',').map(function (a) { return a.trim(); }),
    depth : opt.depth,
    strlen : c.strlen
  };

};

capture['character set'] = function (string, opt) {
  var m = string.match(/^(@charset)([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1],
    value : m[2].trim(),
    depth : opt.depth,
    strlen : m[0].length
  };
};

capture['comment block'] = function (string, opt) {
  var i = 0;
  var s = string.substring(0, i);
  var o;
  var c;
  var v;
  while (true) {
    i += 1;
    s = string.substring(0, i);
    o = s.match(/\/\*/g) || [];
    c = s.match(/\*\//g) || [];
    if (o.length > 0 && o.length === c.length) {
      v = lasso.between(s, '/*', '*/').slice(-1)[0];
      return {
        scope : opt.scope,
        value : v.value.trim().split('\n'),
        depth : opt.depth,
        strlen : v.capture.index + v.capture.length
      };
    }
  }
};

capture['comment inline'] = function (string, opt) {
  var m = string.match(/[^\n]+\n/);
  return {
    scope : opt.scope,
    value : m[0].slice(2).trim(),
    depth : opt.depth,
    strlen : m[0].length
  };
};

capture['font face'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  return {
    scope : opt.scope,
    content : c.content,
    selector : c.arguments.split(',').map(function (a) { return a.trim(); }),
    depth : opt.depth,
    strlen : c.strlen
  };
};

capture['media query'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var m = c.arguments.split(' ');
  var name = m[0];
  var value = m.slice(1).join(' ').replace(/\s+/, ' ').replace(/\n/g, '');

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

    return lines;
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

capture['property group'] = function (string, opt) {
  var i = 0;
  var m;
  var n = string.length;
  while (string[i] !== ';' && i < n) {
    i++;
  }
  m = string.substr(0, i).split(':').map(a => a.trim());
  m[1] = m.slice(1).join(':').replace(/\n/g, '').replace(/;$/, '');
  return {
    scope : opt.scope,
    name : m[0],
    value : m[1],
    depth : opt.depth,
    strlen : i + 1
  };
};

capture['sass each'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var m = c.arguments.split(' ');
  var name = m[0];
  var value = m.slice(1).map((a) => a.trim()).filter((a) => a.length).join(' ');
  return {
    scope : c.scope,
    name : m[0],
    value : value,
    content : c.content,
    depth : c.depth,
    strlen : c.strlen
  };
};

capture['sass extend'] = function (string, opt) {
  var m = string.match(/^(@extend)([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1],
    value : m[2].trim(),
    depth : opt.depth,
    strlen : m[0].length
  };
};

capture['sass for'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var m = c.arguments.split(' ');
  var name = m[0];
  var value = m.slice(1).filter((a) => a.length).join(' ');
  return {
    scope : c.scope,
    name : m[0],
    value : value,
    content : c.content,
    depth : c.depth,
    strlen : c.strlen
  };
};

capture['sass function'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var args = lasso.between(c.arguments, '(', ')').slice(-1)[0].value;
  var m = c.arguments.match(/(@function)\s+([^)]+?)\(/);
  return {
    scope : opt.scope,
    content : c.content,
    name : m[1],
    value : m[2].trim(),
    arguments : args.split(',').map(function (a) { return a.trim(); }),
    depth : opt.depth,
    strlen : c.strlen
  };
};

capture['sass if'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var m = c.arguments.match(/(@if|@else[ ]+if|@else)([\s\S]+|)/);
  var o = {
    scope : opt.scope,
    name : m[1],
    content : c.content,
    depth : opt.depth,
    strlen : c.strlen
  };
  if (m[1] === '@if' || m[1] === '@else if') {
    o.value = m[2].trim();
  }
  return o;
};

capture['sass import'] = function (string, opt) {
  var m = string.match(/^(@import)([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1],
    value : m[2].split(',').map((a) => a.trim().replace(/^\'|\'$|^\"|\"$/g, '')),
    depth : opt.depth,
    strlen : m[0].length
  };
};

capture['sass include'] = function (string, opt) {
  var m = string.match(/^(@include)([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1],
    value : m[2].trim(),
    depth : opt.depth,
    strlen : m[0].length
  };
};

capture['sass mixin'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  var args = lasso.between(c.arguments, '(', ')');
  var m = c.arguments.match(/(@mixin)[ ]+([^\(]+)/);
  var o = {
    content : c.content,
    depth : opt.depth,
    name : m[1],
    scope : opt.scope,
    strlen : c.strlen,
    value : m[2].trim(),
  };
  if (args.length) {
    args = args.slice(-1)[0].value;
    o.arguments = args.split(',').map((a) => a.trim());
  }
  return o;
};

capture['sass placeholder'] = capture['selector'];

capture['sass return'] = function (string, opt) {
  var m = string.match(/^(@return)([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1],
    value : m[2].trim(),
    depth : opt.depth,
    strlen : m[0].length
  };
};

capture.shared.nested = function (string, opt) {
  var i = 0;
  var start = 0;
  var open;
  var closed;
  var v;
  var args;

  function getArguments(i) {
    while (string[i] !== '{') {
      i += 1;
    }

    if (string[i - 1] === '#') {
      i = getArguments(i + 1);
    }

    return i;
  }

  args = string.substr(0, getArguments(0));

  start = args.length;
  o = string.substr(start, i).match(/\{/g) || [];
  c = string.substr(start, i).match(/\}/g) || [];
  i = 0;

  while (i < string.length) {
    i += 1;
    o = string.substr(start, i).match(/\{/g) || [];
    c = string.substr(start, i).match(/\}/g) || [];

    if (o.length > 0 && o.length === c.length) {
      v = lasso.between(string.substr(start, i), '{', '}').slice(-1)[0];

      return {
        scope : opt.scope,
        content : capture(v.value.trim(), [], opt.depth + 1),
        arguments : args.trim(),
        depth : opt.depth,
        strlen : args.length + v.capture.index + v.capture.length,
      };

    }

  }
};

capture['sass include arguments'] = function (string, opt) {
  var m = string.match(/^(@include)\s+([a-zA-Z0-9\-\_]+)([^;]+?);/);
  var args = lasso.between(m[3], '(', ')').slice(-1)[0].value;
  return {
    scope : opt.scope,
    name : m[1],
    value : m[2],
    arguments : args.split(',').map(function (a) { return a.trim(); }),
    depth : opt.depth,
    strlen : m[0].length
  };
};

capture['sass include block'] = function (string, opt) {
  var c = capture.shared.nested(string, opt);
  return {
    scope : opt.scope,
    content : c.content,
    name : '@include',
    value : c.arguments.split(' ')[1],
    depth : opt.depth,
    strlen : c.strlen
  };
};

capture['sass variable assignment'] = function (string, opt) {
  var m = string.match(/([^:]+?):([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1].trim(),
    value : m[2].trim(),
    depth : opt.depth,
    strlen : m[0].length
  };
};

function cleanCss(string) {
  var settings = {
    alignTogether : [
      'property group',
      'sass import',
      'sass include',
      'sass include arguments',
      'sass extend',
      'sass variable assignment',
    ],

    blockScopeOrder : [
      'sass import',
      'sass variable assignment',
      'sass extend',
      'sass include',
      'sass include arguments',
      'property group',
      'sass include block',
      'selector',
      'sass return'
    ],
    
    lineBreak : 80,
    align : false,
    sortMainScope : false,
    sortBlockScope : true,
    propertyGroupOrder : list.properties,
    tabSize : 2
  };
  return fnChain({}, cleanCss.fn, [settings, string]);
}

cleanCss.fn = {};

if (module) {
  module.exports = cleanCss;
}

cleanCss.fn.align = function (settings, string) {
  settings.align = true;
};

cleanCss.fn.setLineBreak = function (settings, string, length) {
  settings.lineBreak = length;
};

cleanCss.fn.setTabChar = function (settings, string, tabChar) {
  settings.tabChar = tabChar;
};

cleanCss.fn.setTabSize = function (settings, string, tabSize) {
  settings.tabSize = tabSize;
};

cleanCss.fn.sortBlockScope = function (settings, string) {
  settings.sortBlockScope = true;
};

cleanCss.fn.sortMainScope = function (settings, string) {
  settings.sortMainScope = true;
};

cleanCss.fn.value = function (settings, string) {
  var cssObject = capture(string, [], 0);
  sortCss(settings, cssObject);
  return getValue(settings, cssObject);
};

var is = {};

is.propertyGroup = function (value) {
  var startsWith = /^(\*|)[a-z\- ]+:/.test(value);
  var property = value.split(':')[0].trim();
  var inIndexed = list.properties.indexOf(property) > -1;
  var braceBeforeSemiColon = false;
  var n = value.length;
  var i;

  if (startsWith && inIndexed) {
    return true;
  }

  while (value[i] !== ';' && i < n) {
    // Protect is from mismatching SASS eval
    if (value[i] === '{' && value[i - 1] !== '#') {
      return false;
    }
    i++;
  }
  return value[i] === ';';
};

is.selector = function (value) {
  var selector = /^([\@\.\%\#\*a-zA-Z0-9\[\]\+\~\=\"\'\_\-\:\&\n,\(\) ]+)/.test(value);
  var braceIndex = value.indexOf('{');
  var semiIndex = value.indexOf(';');
  var braceBefore = semiIndex > braceIndex && braceIndex !== -1 || semiIndex === -1 && braceIndex !== -1;

  return selector && braceBefore;
};

var list = {};

(function () {
  function unzip(list) {
    var vendors = ['-moz-', '-ms-', '-o-', '-webkit-', ''];
    var prefixed;
    var i;
    for (i = list.length - 1; i > 0; i--) {
      if (list[i].indexOf('-prefix-') !== -1) {
        prefixed = vendors.map((a) => list[i].replace('-prefix-', a));
        [].splice.apply(list, [i, 1].concat(prefixed));
      }
    }
    return list;
  }
  list.properties = unzip([
    'z-index',
    'content',
    'icon',
    'display',
    '*display',
    '-prefix-device-pixel-ratio',
    '-prefix-box-sizing',
    '-prefix-box-align',
    '-prefix-box-direction',
    '-prefix-box-orient',
    '-prefix-box-pack',
    'visibility',
    '-prefix-appearance',
    'zoom',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'min-width',
    'max-width',
    'height',
    'min-height',
    'max-height',
    'float',
    'clear',
    'clip',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    '-prefix-margin-before',
    '-prefix-margin-after',
    '-prefix-margin-end',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'color',
    'opacity',
    'overflow',
    'overflow-x',
    'overflow-y',
    'overflow-wrap',
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-color',
    'border-image',
    'border-image-source',
    'border-image-repeat',
    'border-image-width',
    'border-image-outset',
    'border-image-slice',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-width',
    'border-style',
    '-prefix-border-radius',
    '-prefix-border-top-left-radius',
    '-prefix-border-top-right-radius',
    '-prefix-border-bottom-right-radius',
    '-prefix-border-bottom-left-radius',
    'border-top-width',
    'border-top-style',
    'border-right-width',
    'border-right-style',
    'border-bottom-width',
    'border-bottom-style',
    'border-left-width',
    'border-left-style',
    'border-collapse',
    'border-spacing',
    'background',
    'background-image',
    'background-color',
    '-prefix-background-blend-mode',
    'background-repeat',
    'background-attachment',
    'background-origin',
    'background-position',
    'background-size',
    'background-clip',
    'filter',
    'outline',
    'outline-color',
    'outline-offset',
    'outline-style',
    'outline-width',
    'caption-side',
    'empty-cells',
    'table-layout',
    '-prefix-box-shadow',
    'box-decoration-break',
    'text-align',
    'text-decoration',
    'text-decoration-color',
    'text-decoration-line',
    'text-decoration-style',
    'text-underline-position',
    'text-transform',
    'text-shadow',
    'text-align-last',
    'text-combine-upright',
    'text-indent',
    'text-justify',
    'text-orientation',
    'text-combine-upright',
    'text-overflow',
    '-prefix-text-size-adjust',
    'vertical-align',
    '-prefix-align-content',
    '-prefix-align-items',
    '-prefix-align-self',
    '@font-feature-values',
    'font-feature-settings',
    'font',
    'font-family',
    'font-display',
    'font-size',
    'font-size-adjust',
    'font-style',
    'font-weight',
    'font-kerning',
    'font-stretch',
    '-prefix-font-smoothing',
    '-prefix-osx-font-smoothing',
    'font-synthesis',
    'font-variant',
    'font-variant-alternates',
    'font-variant-caps',
    'font-variant-east-asian',
    'font-variant-ligatures',
    'font-variant-numeric',
    'font-variant-position',
    'font-language-override',
    'src',
    'flex',
    'flex-basis',
    '-prefix-flex-align',
    '-prefix-flex-direction',
    '-prefix-flex-line-pack',
    '-prefix-flex-pack',
    'flex-flow',
    'flex-grow',
    'flex-shrink',
    '-prefix-flex-wrap',
    '-prefix-justify-content',
    'order',
    'hanging-punctuation',
    'line-break',
    'hyphens',
    'line-height',
    'letter-spacing',
    'tab-size',
    'white-space',
    'word-break',
    'word-spacing',
    'word-wrap',
    'direction',
    'unicode-bidi',
    'writing-mode',
    'list-style',
    'list-style-image',
    'list-style-position',
    'list-style-type',
    'counter-increment',
    'counter-reset',
    '@-prefix-keyframes',
    '-prefix-animation',
    '-prefix-animation-delay',
    '-prefix-animation-direction',
    '-prefix-animation-duration',
    '-prefix-animation-fill-mode',
    '-prefix-animation-iteration-count',
    '-prefix-animation-name',
    '-prefix-animation-play-state',
    '-prefix-animation-timing-function',
    'backface-visibility',
    'perspective',
    'perspective-origin',
    '-prefix-transform',
    '-prefix-transform-origin',
    '-prefix-transform-style',
    '-prefix-transition',
    '-prefix-transition-property',
    '-prefix-transition-duration',
    '-prefix-transition-timing-function',
    '-prefix-transition-delay',
    '-prefix-interpolation-mode',
    'ime-mode',
    'Multi-column',
    'break-after',
    'break-before',
    'break-inside',
    'column-count',
    'column-fill',
    'column-gap',
    'column-rule',
    'column-rule-color',
    'column-rule-style',
    'column-rule-width',
    'column-span',
    'column-width',
    'columns',
    'widows',
    'orphans',
    'page-break-after',
    'page-break-before',
    'page-break-inside',
    'marks',
    'quotes',
    'image-orientation',
    'image-rendering',
    'image-resolution',
    'object-fit',
    'object-position',
    'mask',
    'mask-type',
    'mark',
    'mark-after',
    'mark-before',
    'phonemes',
    'rest',
    'rest-after',
    'rest-before',
    'voice-balance',
    'voice-duration',
    'voice-pitch',
    'voice-pitch-range',
    'voice-rate',
    'voice-stress',
    'voice-volume',
    'marquee-direction',
    'marquee-play-count',
    'marquee-speed',
    'marquee-style',
    'nav-index',
    'nav-up',
    'nav-right',
    'nav-down',
    'nav-left',
    'resize',
    '-prefix-touch-action',
    '-prefix-tap-highlight-color',
    '-prefix-user-select',
    '-prefix-pointer-events',
    'cursor',
  ]);
}());

function sortCss(settings, cssObject) {
  var displaceDeep = [
    'sass function',
    'sass import',
    'sass include',
    'sass include arguments',
    'sass mixin',
    'sass include block',
    'sass extend',
    'property group',
  ];

  var displaceZeroDepth = [
    'sass import',
    'sass include',
    'sass variable assignment',
    'font face',
    'sass function',
    'sass mixin',
    'sass include block',
    'sass placeholder',
  ];

  function sortDeep(content) {
    sortCss.scope(settings, content, displaceDeep);

    for (var i = 0, n = content.length; i < n; i++) {
      if (Array.isArray(content[i].content) && content[i].content.length) {
        sortDeep(content[i].content);
      }
    }
  }

  sortCss.scope(settings, cssObject, displaceZeroDepth);

  if (settings.sortBlockScope) {
    for (var i = 0, n = cssObject.length; i < n; i++) {
      if (Array.isArray(cssObject[i].content) && cssObject[i].content.length) {
        sortDeep(cssObject[i].content);
      }
    }
  }
}

sortCss.list = {};
sortCss.each = {};

sortCss.scope = function (settings, content, order) {
  var displace = {};
  var start = 0;
  var name;
  var i;
  var n;
  var x;
  var y;

  // Determine if a comment is the first element in the array
  while (content[start].scope.substr(0, 7) === 'comment') {
    start += 1;
  }

  for (i = 0, n = order.length; i < n; i++) {
    displace[order[i]] = [];
  }

  for (i = content.length - 1; i >= start; i--) {
    name = content[i].scope;
    // Add to displace list
    if (order.indexOf(name) > -1) {
      displace[name].unshift(content[i]);
      content.splice(i, 1);
    }
  }

  // Sort
  for (name in displace) {
    x = displace[name];
    if (Array.isArray(x) && x.length && typeof sortCss.list[name] === 'function') {
      sortCss.list[name](settings, x);
    }
  }

  for (name in sortCss.each) {
    for (i = 0, n = content.length; i < n; i++) {
      if (content[i].scope === name) {
        sortCss.each[name](settings, content[i]);
      }
    }
  }

  for (i = 0, n = order.length; i < n; i++) {
    name = order[i];
    if (displace[name].length) {
      [].splice.apply(content, [start, 0].concat(displace[name]));
      start += displace[name].length;
    }
  }
};

sortCss.each.selector = function (settings, element) {
  element.selector.sort(smartSort());
};

sortCss.each['sass import'] = function (settings, element) {
  element.value.sort(smartSort());
};

sortCss.list['property group'] = function (settings, list) {
  var order = settings.propertyGroupOrder;
  list.sort(function (a, b) {
    var ai = order.indexOf(a.name);
    var bi = order.indexOf(b.name);
    if (a.name === b.name && typeof sortCss.list['property group'][a.name] === 'function') {
      return sortCss.list['property group'][a.name](a, b);
    }
    if (ai > -1 && bi > -1) {
      return ai - bi;
    }
    if (ai > -1 && bi === -1) {
      return -1;
    }
    if (bi > -1 && ai === -1) {
      return 1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });
};

sortCss.list['sass function'] = function (settings, list) {
  list.sort(smartSort('value'));
};

sortCss.list['sass import'] = function (settings, list) {
  for (var i = list.length - 1; i > 0; i--) {
    [].push.apply(list[0].value, list[i].value);
    list.splice(i, 1);
  }
};

sortCss.list['sass include'] = function (settings, list) {
  list.sort(smartSort('value'));
};

sortCss.list['sass mixin'] = function (settings, list) {
  list.sort(smartSort('value'));
};

sortCss.list['property group']['background'] = function (a, b) {
  if (/\(/.test(a.value) && !/\(/.test(b.value)) {
    return 1;
  } else if (/\(/.test(a.value) && /\(/.test(b.value)) {
    if (a.value > b.value) {
      return 1;
    }
    return -1;
  }
  return -1;
};

sortCss.list['property group']['src'] = function (a, b) {
  var av = splitByComma(a.value);
  var bv = splitByComma(b.value);
  if (av.length > bv.length) {
    return 1;
  }
  return -1;
};

sortCss.list['property group']['background-color'] = sortCss.list['property group']['background'];

function getValue(settings, cssObject) {
  var i;
  var n;

  function indexSiblings(group, depth) {
    var scopeCount = {};
    var align = 0;
    var i = 0;
    var n = group.length;
    var x;

    for (; i < n; i++) {
      // untracked scopes & ''@if' starts a new group
      x = group[i];

      if (typeof scopeCount[x.scope] === 'undefined' || x.name === '@if') {
        scopeCount[x.scope] = {
          groupLength : 1,
          align : x.name ? x.name.length : 0
        };
      } else {
        scopeCount[x.scope].groupLength += 1;

        if (x.name && scopeCount[x.scope].align < x.name.length) {
          scopeCount[x.scope].align = x.name.length;
        }
      }

      x.first = scopeCount[x.scope].groupLength === 1;
      x.groupIndex = scopeCount[x.scope].groupLength - 1;

      x.index = i;
      x.length = n;
      x.depth = depth;
    }

    i = 0;

    for (; i < n; i++) {
      x = group[i];

      x.groupLength = scopeCount[x.scope].groupLength;
      x.last = x.groupIndex === x.groupLength - 1;

      if (x.depth === 0) {
        x.align = scopeCount[x.scope].align;
      }
    }

    // Get alignments for groups that align together
    i = 0;
    n = settings.alignTogether.length;

    for (; i < n; i++) {
      x = settings.alignTogether[i];
      if (scopeCount[x] && scopeCount[x].align > align) {
        align = scopeCount[x].align;
      }
    }

    i = 0;
    n = group.length;

    for (; i < n; i++) {
      x = group[i];

      if (settings.alignTogether.indexOf(x.scope) !== -1) {
        x.align = align;
      }

      // Recursively get information about siblings
      if (Array.isArray(x.content)) {
        indexSiblings(x.content, depth + 1);
      }
    }
  }

  indexSiblings(cssObject, 0);

  return getValue.map(settings, cssObject).map(function (value, i) {
    var element = cssObject[i];

    if (element.scope === 'sass variable assignment' && !element.last) {
      return value;
    }

    return value + '\n';
  }).join('\n');
}

getValue.shared = {};

getValue.map = function (settings, parent) {
  return parent.map(function (element) {
    if (typeof getValue[element.scope] === 'undefined') {
      throw `There is no 'getValue' method for: '${element.scope}'`;
    }
    return getValue[element.scope](settings, element, parent);
  });
};

getValue.selector = function (settings, element, siblings) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var v = getValue.shared.nested(settings, element, parent);
  var selector = element.selector.map(function (a, i) {
    return i > 0 ? tab + a : a;
  }).join(',\n');

  if (element.depth > 0 && siblings[0] !== element && element.first) {
    if (!element.last) {
      return '\n' + tab + selector + ' {\n' + v + tab + '}\n';
    }
    return '\n' + tab + selector + ' {\n' + v + tab + '}';
  } else if (element.depth > 0 && v.length) {
    if (!element.last) {
      return selector + ' {\n' + v + tab + '}\n';
    }
    return selector + ' {\n' + v + tab + '}';
  } else if (v.length && element.depth === 0) {
    return selector + ' {\n' + v + tab + '}';
  } else if (element.last) {
    return selector + ' {}';
  } else {
    return selector + ' {}\n';
  }
};

getValue['character set'] = function (settings, element, parent) {
  return element.name + ' ' + element.value + ';';
};

getValue['comment block'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var isTitleStart = /^[\-]+(\s+|)\*\\$/.test(element.value[0].trim());
  var isTitleEnd = /^\\\*(\s+|)[\-]+$/.test(element.value.slice(-1)[0].trim());
  var isTitle = isTitleStart && isTitleEnd;
  var isSpecialComment = element.value[0] === '!';
  var value;
  var elementLength = element.value.length;

  /*
  Titling support
  http://cssguidelin.es/#titling
  */

  function lineBreak() {
    var lines = [[]];
    var $tab = new Array(settings.tabSize + 1).join(settings.tabChar);
    var x = 0;
    var v = element.value.join('\n').split(' ').filter(function (a) { return a.length; });
    var tabLength = tab.length + $tab.length;
    var i;
    var n;

    for (i = v.length - 1; i >= 0; i--) {
      if (v[i].length > 1 && v[i].substr(-1) === '\n') {
        v[i] = lasso.trimEnd(v[i]);
        v.splice(i + 1, 0, '\n');
      }
    }

    for (i = 0, n = v.length; i < n; i++) {
      if (v[i] === '\n') {
        x = 0;
      } else {
        x += v[i].length + 1;
        if (x >= settings.lineBreak) {
          x = 0;
          v.splice(i, 0, '\n');
        }
      }
    }

    if (v.length) {
      element.value = v.reduce(function (a, b) {
        if (b === '\n') {
          return a += '\n';
        } else if (a.substr(-1) === '\n') {
          return a + b;
        }
        return a += ' ' + b;
      }).split('\n');
    }
  }

  if (settings.lineBreak) {
    lineBreak();
  }

  if (element.value.length > 1) {
    if (isTitle) {
      value = element.value.map(function (line, i) {
        var $tab = '';
        if (i > 0) {
          $tab = new Array(settings.tabSize + 1).join(settings.tabChar);
        }
        return i < elementLength - 1 ? $tab + line + '\n' : $tab + line;
      });
      return '/*' + value.join('') + '*/\n';
    } else if (isSpecialComment) {
      value = element.value.map(function (line, i) {
        var $tab = '';
        if (i > 0) {
          $tab = tab + new Array(settings.tabSize + 1).join(settings.tabChar);
        }
        return $tab + line;
      });
      return '/*' + value.join('\n') + '\n' + tab + '*/\n';
    }

    value = element.value.map(function (line) {
      var $tab = new Array(settings.tabSize + 1).join(settings.tabChar);
      return $tab + line;
    }).join('\n');

    return '/*\n' + value + '\n' + tab + '*/\n';
  }

  return '/* ' + element.value.join('\n') + ' */';
};

getValue['comment inline'] = function (settings, element, parent) {
  return '// ' + element.value;
};

getValue['font face'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var selector = element.selector.join(',\n');
  var v = getValue.shared.nested(settings, element, parent);
  return `${selector} {\n${v}${tab}}`;
};

getValue['media query'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var align = new Array(element.name.length + 2).join(' ');
  var nested = getValue.shared.nested(settings, element, parent);
  var value;

  function joinLines(a) {
    return a.map(function (b, i) {
      if (i > 0) {
        return tab + align + b;
      }
      return b;
    }).join('\n');
  }

  value = element.value.map(function (a, i) {
    a = joinLines(a);

    if (i > 0) {
      return tab + align + a;
    }

    return a;
  }).join(',\n\n');

  return element.name + ' ' + value + ' {\n' + nested + tab + '}';
};

getValue['property group'] = function (settings, element, parent) {
  var value = splitByComma(element.value);
  var captures;
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  if (element.align) {
    value = value.map(function (a, i) {
      var align = new Array(element.align + 4).join(' ');
      if (i === 0) {
        return a;
      }
      return tab + align + a;
    }).join(',\n');
    return element.name + new Array(element.align - element.name.length + 2).join(' ') + ': ' + value + ';';
  }
  return element.name + ': ' + element.value + ';';
};

getValue['sass each'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var nested = getValue.shared.nested(settings, element, parent);
  var value = splitByComma(element.value);
  var each;
  if (settings.align) {
    for (var i = 0, n = value.length; i < n; i++) {
      if (i === 0) {
        value[i] = element.name + ' ' + value[i];
      } else {
        value[i] = tab + new Array(element.name.length + 2).join(' ') + new Array(value[0].substr(0, value[0].indexOf('(')).length + 1).join(' ') + value[i];
      }
    }
    each = value.join(', \n');
  } else {
    for (var i = 0, n = value.length; i < n; i++) {
      if (i === 0) {
        value[i] = element.name + ' ' + value[i];
      } else {
        value[i] = tab + value[i];
      }
    }
    each = value.join(',\n');
  }
  return `${each} {\n${nested}${tab}}`;
};

getValue['sass extend'] = function (settings, element, parent) {
  if (element.align && element.length > 1) {
    return `${element.name}${new Array((element.align - element.name.length) + 4).join(' ')}${element.value};`;
  }
  return `${element.name} ${element.value};`;
};

getValue['sass for'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var s = `${element.name} ${element.value}`;
  var v = getValue.shared.nested(settings, element, parent);
  return `${s} {\n${v}${tab}}`;
};

getValue['sass function'] = function (settings, element, parent) {
  var args = '(' + element.arguments.join(', ') + ')';
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var selector = `${element.name} ${element.value}${args}`;
  var v = getValue.shared.nested(settings, element, parent);
  return `${tab}${selector} {\n${v}${tab}}`;
};

getValue['sass if'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var $tab = new Array(settings.tabSize + 1).join(settings.tabChar);
  var delegate = {
    "@if" : function () {
      var s = `${element.name} ${element.value}`;
      var v = getValue.map(settings, element.content).map(function (value) {
        return `${tab}${$tab}${value}`;
      }).join('\n');
      if (element.groupLength > 1 && element.index > 1) {
        return `${s} {\n${v}\n${tab}}`;
      }
      if (element.groupLength > 1) {
        return `${s} {\n${v}\n${tab}}`;
      }
      return `${s} {\n${v}\n${tab}}`;
    },
    "@else if" : function () {
      var s = `${element.name} ${element.value}`;
      var v = getValue.map(settings, element.content).map(function (value) {
        return `${tab}${$tab}${value}`;
      }).join('\n');
      if (element.groupLength > 1) {
        return `${s} {\n${v}\n${tab}}`;
      }
      return `${s} {\n${v}\n${tab}}\n`;
    },
    "@else" : function () {
      var s = `${element.name}`;
      var v = getValue
      .map(settings, element.content)
      .map(function (value) {
        return `${tab}${$tab}${value}`;
      }).join(';\n');
      return `${s} {\n${v}\n${tab}}\n`;
    }
  };
  return delegate[element.name]();
};

getValue['sass import'] = function (settings, element, parent) {
  var tab = new Array((element.depth + 1) * settings.tabSize).join(settings.tabChar);
  var space = '';
  var x = 0;
  var v;
  var alignSpace = '';
  if (element.align && element.depth > 0) {
    alignSpace = new Array(element.align - element.name.length + 1).join(' ');
  }
  if (settings.align) {
    if (element.depth > 0) {
      space = `${tab}${alignSpace}${new Array(element.name.length + 3).join(' ')}`;
    } else {
      space = `${tab}${alignSpace}${new Array(element.name.length + 1).join(' ')}`;
    }
    element.value = element.value.map(function (a, i) {
      if (i > 0) {
        return `${space}"${a}"`;
      }
      if (element.depth > 0 && parent.length > 1) {
        return `  "${a}"`;
      }
      return `"${a}"`;
    });
  } else {
    element.value = element.value.map((a) => `"${a}"`);
  }
  v = element.value.join(',\n');
  if (element.align) {
    return `${element.name}${alignSpace} ${v};`;
  }
  return `${element.name} ${v};`;
};

getValue['sass include'] = function (settings, element, parent) {
  var align = new Array(element.align - element.name.length + 4).join(' ');
  if (element.align && parent.length > 1) {
    return `${element.name}${align}${element.value};`;
  }
  return `${element.name} ${element.value};`;
};

getValue['sass mixin'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var args = '';
  var v = getValue.shared.nested(settings, element, parent);
  var s = `${tab}${element.name} ${element.value}`;
  if (element.arguments) {
     args = '(' + element.arguments.join(', ') + ')';
     s = `${tab}${element.name} ${element.value}${args}`;
  }
  return `${s} {\n${v}}`;
};

getValue['sass placeholder'] = getValue['selector'];

getValue['sass return'] = function (settings, element, parent) {
  return `${element.name} ${element.value};`;
};

getValue.shared.nested = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var $tab = new Array(settings.tabSize + 1).join(settings.tabChar);
  var scopeList = element.content.map(function (a) { return a.scope; });
  var newGroupIndex = [];
  var t;
  var i = 0;
  var n = scopeList.length;
  var newLineCases = [
    'selector',
    'sass function',
    'sass mixin',
    'sass include block',
    'sass for'
  ];

  for (; i < n; i++) {
    newGroupIndex[i] = i > 0 && t !== scopeList[i] && newLineCases.indexOf(scopeList[i]) !== -1;
    t = scopeList[i];
  }

  return getValue.map(settings, element.content).map(function (value, i) {

    if (element.content[i].name === '@else if') {
      return ' ' + value;
    }

    if (element.content[i].name === '@else') {
      return ' ' + value;
    }

    if (element.content[i].index > 1 && element.content[i].name === '@if') {
      return tab + $tab + value;
    }

    if (element.content[i].name === '@if') {
      return tab + $tab + value;
    }

    return tab + $tab + value + '\n';

  }).join('');
};

getValue['sass include arguments'] = function (settings, element, parent) {
  var args = '(' + element.arguments.join(', ') + ')';
  var align;
  if (element.depth === 0) {
    align = new Array(element.align - element.name.length + 2).join(' ');
  } else {
    align = new Array(element.align - element.name.length + 4).join(' ');
  }
  if (element.align && parent.length > 1) {
    return `${element.name}${align}${element.value}${args};`;
  }
  return `${element.name} ${element.value}${args};`;
};

getValue['sass include block'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var selector = `${element.name} ${element.value}`;
  var v = getValue.shared.nested(settings, element, parent);
  return `${selector} {\n${v}${tab}}`;
};

getValue['sass variable assignment'] = function (settings, element, parent) {
  if (element.align) {
    return `${element.name}${new Array(element.align - element.name.length + 2).join(' ')}: ${element.value};`;
  }
  return `${element.name} : ${element.value};`;
};

function fnChain(target, source, args) {
  'use strict';

  var name;

  function chain(name) {

    return function () {
      var
        n = arguments.length,
        a = new Array(n),
        i,
        b;

      for (i = 0; i < n; i++) {
        a[i] = arguments[i];
      }

      b = source[name].apply(null, args.concat(a));

      return typeof b === 'undefined' ? target : b;

    };

  }

  if (!Array.isArray(args)) {
    throw 'Invalid argument for \'fnChain\', the 3rd argument must be an array of arguments.';
  }

  for (name in source) {
    if (typeof source[name] === 'function' && source.hasOwnProperty(name)) {
      target[name] = chain(name);
    }
  }

  return target;

}

function forEach(array, fn) {
  for (var i = 0, n = array.length; i < n; i++) {
    fn(array[i], i, array);
  }
}

function partial(fn) {
  var a = [].slice(fn, 1);
  return function () {
    var b = a.concat([].slice(arguments));
    fn.apply(null, a);
  }
}

function smartSort(property) {
  return function (a, b) {
    var aC;
    var bC;
    if (typeof property === 'string') {
      a = a[property];
      b = b[property];
    }
  	var aa = lasso.matchType(a);
    var bb = lasso.matchType(b);
    var n = aa.length;
    if (aa.length > bb.length) {
    	n = bb.length;
    }
    for (var i = 0; i < n; i++) {
    	if (!isNaN(Number(aa[i])) && !isNaN(Number(bb[i]))) {
      	if (Number(aa[i]) > Number(bb[i])) {
        	return 1;
        } else if (Number(aa[i]) < Number(bb[i])) {
  	      return -1
        }
      }
    	if (aa[i] > bb[i]) {
      	return 1;
      } else if (aa[i] < bb[i]) {
      	return -1;
      }
    }
    return 0;
  }
};

function splitByComma (value) {
  var open = 0;
  var index = 0;
  var i = 0;
  var n = value.length;
  var lines = [''];

  for (; i < n; i++) {
    if (value[i] === '(') {
      open += 1;
      lines[index] += value[i];
    } else if (value[i] === ')') {
      open -= 1;
      lines[index] += value[i];
    } else if (value[i] === ',' && open === 0) {
      index += 1;
      lines[index] = '';
    } else {
      lines[index] += value[i];
    }
  }

  return lines.map(function (a) { return a.trim(); });
}

/*! lasso-string 2016-02-14 */
function lasso(a){return lasso.chain(a)}"object"==typeof module&&(module.exports=lasso),lasso.between=function(a,b,c){function d(a){return a?a.length:0}function e(b,c,d){var e=j[b],f=k[c];i.push({length:d-e.length-f.length,index:e.index+e.length,capture:{index:e.index,length:d,value:a.substr(e.index,d)},value:a.substr(e.index+e.length,d-f.length-e.length)}),j.splice(b,1),k.splice(c,1)}function f(b,c,g){var h=j.length-1,i=k[b].index-j[h].index+k[b].length,l=a.substr(j[h].index,i),m=d(l.match(c)),n=d(l.match(g));j[h].index<k[b].index&&m===n?(e(h,b,i),j.length&&f(0,c,g)):j.length&&k.length&&f(b+1,c,g)}function g(b,c,f){var h=k.length-1,i=k[h].index+k[h].length-j[b].index,l=a.substr(j[b].index,i),m=d(l.match(c)),n=d(l.match(f));j[b].index<k[h].index&&m===n?(e(b,h,i),k.length&&g(j.length-1,c,f)):j.length&&k.length&&g(b-1,c,f)}function h(a){var b=j.length-1,c=k[a].index-j[b].index+k[a].length;j[b].index<k[a].index?(e(b,a,c),j.length&&h(0)):j.length&&k.length&&h(a+1)}var i=[],j=lasso.indexesOf(a,b),k=lasso.indexesOf(a,c),l={closed:{")":"(","}":"{","]":"["},open:{"(":")","{":"}","[":"]"}};return j.length&&k.length&&(l.open[b]!==c&&"string"==typeof l.closed[c]?f(0,new RegExp("\\"+l.closed[c],"g"),new RegExp("\\"+c,"g")):l.open[b]!==c&&"string"==typeof l.open[b]?g(j.length-1,new RegExp("\\"+b,"g"),new RegExp("\\"+l.open[b],"g")):h(0)),i},lasso.camelCase=function(a,b,c,d){return"string"==typeof a&&a.length&&(a=a.replace(/[\-]+/g," ").trim().replace(/[A-Z][a-z0-9]+/g,function(a){return" "+a}).match(/[a-zA-Z0-9\. ]/g).join("").replace(/\./g,"_").split(" ").filter(function(a){return a.length}).map(function(a,b){return 0===b?a.toLowerCase():a[0].toUpperCase()+a.substr(1,a.length).toLowerCase()}).join("")),a},lasso.differentWords=function(a,b){var c,d,e,f=[];for(a=a.match(/[a-zA-Z0-9 ]+/g).join(" ").replace(/[ ]+/g," ").split(" "),b=b.match(/[a-zA-Z0-9 ]+/g).join(" ").replace(/[ ]+/g," ").split(" "),d=0,e=a.length;e>d;d++)for(c=b.indexOf(a[d]),-1===c&&f.push(a[d]);c>-1;)b.splice(c,1),c=b.indexOf(a[d]);for(d=0,e=b.length;e>d;d++)for(c=a.indexOf(b[d]),-1===c&&-1===f.indexOf(b[d])&&f.push(b[d]);c>-1;)a.splice(c,1),c=a.indexOf(b[d]);return f},lasso.distance=function(a,b){var c,d,e=[];if(0===a.length)return b.length;if(0===b.length)return a.length;for(c=0;c<=b.length;c++)e[c]=[c];for(d=0;d<=a.length;d++)e[0][d]=d;for(c=1;c<=b.length;c++)for(d=1;d<=a.length;d++)b.charAt(c-1)===a.charAt(d-1)?e[c][d]=e[c-1][d-1]:e[c][d]=Math.min(e[c-1][d-1]+1,e[c][d-1]+1,e[c-1][d]+1);return e[b.length][a.length]},lasso.fuzzy=function(a,b){var c,d=a.indexOf(b[0]),e=[],f=0;for(e.distance=0,e.closest=a.length,e.farthest=0;d>-1;)c={index:d+f,length:1,match:b[e.length]},e.push(c),e.distance=c.index-e[0].index,f=d,d=a.substr(f,a.length-f).indexOf(b[e.length]),d>-1&&d+f-c.index<e.closest&&(e.closest=d+f-c.index),f-d>e.farthest&&(e.farthest=f-d);return e.length===b.length?(e.difference=e.farthest-e.closest,e):!1},lasso.group=function(a,b,c,d){var e=a.toString().split("."),f=e[0].split("").reverse();if(f.length>3)for(var g=f.length;g>=0;g--)g<f.length&&g>0&&g%3===0&&f.splice(g,0,",");return 2===e.length?f.reverse().join("")+"."+e.slice(1).join("."):f.reverse().join("")},lasso.indexesOf=function(a,b){function c(){for(var c=b.exec(a.substr(0,h));c;)e=c.index,g.push({index:f+e,length:c[0].length,match:c[0]}),f+=e+c[0].length,c=b.exec(a.substr(f,h-f))}function d(){for(e=a.substr(f,h-f).indexOf(b);-1!==e&&h>f;)g.push({index:f+e,length:b.length,match:b}),f+=e+b.length,e=a.substr(f,h-f).indexOf(b)}var e,f=0,g=[],h=a.length;if(2!==arguments.length)throw"Error (lasso.indexesOf): Missing Arguments";return"string"==typeof b?d():"function"==typeof b.test&&c(),g},lasso.matchType=function(a){function b(a){return/[a-zA-Z ]/.test(a)?0:/[0-9]/.test(a)?1:/[\-\_]/.test(a)?2:/[\.\,\;\:\?\!]/.test(a)?3:/[\$\%\^\*\#\@\&\+\=]/.test(a)?4:/[\[\]\{\}\(\)\<\>\"\']/.test(a)?5:6}var c,d=[""],e=0;c=b(a[0]);for(var f=0,g=a.length;g>f;f++)c!==b(a[f])&&(d.push(""),e+=1),d[e]+=a[f],c=b(a[f]);return d},lasso.sameWords=function(a,b){var c,d,e,f,g,h=[];for(a=a.match(/[a-zA-Z0-9 ]+/g).join(" ").replace(/[ ]+/g," ").split(" "),b=b.match(/[a-zA-Z0-9 ]+/g).join(" ").replace(/[ ]+/g," ").split(" "),d=a,e=b,a.length<b.length&&(d=b,e=a),f=0,g=d.length;g>f;f++)for(c=e.indexOf(d[f]),c>-1&&h.push(d[f]);c>-1;)e.splice(c,1),c=e.indexOf(d[f]);return h},lasso.splice=function(a,b,c,d){return a.substr(0,b)+d+a.substr(b+c,a.length-b-c)},lasso.template=function(a){var b=[].slice.call(arguments,1,arguments.length),c=0;return a.replace(/(?:%s|%([0-9]+))/g,function(a,d){return d?b[Number(d)]:(c+=1,b[c-1])})},lasso.toChar=function(a){return Array.isArray(a)?a.map(function(a){return String.fromCharCode(a)}).join(""):String.fromCharCode(a)},lasso.toCharCode=function(a){return Array.prototype.map.call(a.split(""),function(a){return a.charCodeAt(0)})},lasso.toCurrency=function(a,b){return 1===arguments.length&&(b=a,a="$"),0>b||"-"===b.toString()[0]?"-"+a+lasso.group((-1*Number(b)).toFixed(2)):a+lasso.group(Number(b).toFixed(2))},lasso.trimEnd=function(a){for(var b=a.length-1,c=a.substr(b,1);" "===c||"\n"===c||"	"===c||"\r"===c;)b-=1,c=a.substr(b,1);return a.substr(0,b+1)},lasso.trimStart=function(a){for(var b=0,c=a.substr(b,1);" "===c||"\n"===c||"	"===c||"\r"===c;)b+=1,c=a.substr(b,1);return a.slice(b)},function(){var a={};for(var b in lasso)a[b]=function(b){return function(){var c=[].slice.call(arguments);return a.value=lasso[b].apply(null,[a.value].concat(c)),a}}(b);lasso.chain=function(b){return a.value=b,a}}();

(function () {
  module.exports = {
    activate: function(state) {
      atom.commands.add('atom-text-editor', {
        'css-clean:convert': this.convert
      });
    },
    convert: function (event) {
      var editor         = this.getModel();
      var editorText     = editor.getText();
      var selectedBuffer = editor.getSelectedBufferRange();
      var tabChar = editorText.trim().match(/\{\n(\t+|[ ]+)/m);
      var lineBreak = 80;
      var tabSize = 2;
      var clean;

      if (atom.config.settings && atom.config.settings.editor && atom.config.settings.editor.preferredLineLength) {
        lineBreak = atom.config.settings.editor.preferredLineLength;
      }

      if (tabChar) {
        tabSize = tabChar[1].length;
        tabChar = tabChar[1][0];
      } else {
        tabChar = ' ';
      }
      if (/^source\.css/.test(editor.getRootScopeDescriptor().scopes[0])) {
        clean = cleanCss(editorText)
        .setTabChar(tabChar)
        .setTabSize(tabSize)
        .setLineBreak(lineBreak)
        .sortBlockScope()
        .sortMainScope()
        .align()
        .value();
        //console.log(clean);
        editor.setText(clean);
        editor.setSelectedBufferRange(selectedBuffer);
      }
    }
  };
})();

//# sourceMappingURL=main.js.map