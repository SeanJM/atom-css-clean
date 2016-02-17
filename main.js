function capture(string, group, depth) {
  var scope;
  var i = 0;
  var c;
  var scopeCount = {};
  var alignTogether = [
    'property group',
    'sass import',
    'sass include',
    'sass include arguments',
    'sass extend',
    'sass variable assignment',
  ];
  //console.log(string);
  string = string.trim();
  scope = capture.scope(string);
  while (i++ < 1000 && scope) {
    if (typeof capture[scope] === 'undefined') {
      throw `Missing '${scope}' method for 'capture' function.`;
    }
    c = capture[scope](string, {
      group : group,
      depth : depth,
      scope : scope
    });
    group.push(c);
    string = string.slice(c.strlen).trim();
    scope = capture.scope(string);
  }
  for (var i = 0, n = group.length; i < n; i++) {
    // untracked scopes & ''@if' starts a new group
    if (typeof scopeCount[group[i].scope] === 'undefined' || group[i].name === '@if') {
      scopeCount[group[i].scope] = {
        groupLength : 1,
        align : group[i].name ? group[i].name.length : 0
      };
    } else {
      scopeCount[group[i].scope].groupLength += 1;
      if (group[i].name && scopeCount[group[i].scope].align < group[i].name.length) {
        scopeCount[group[i].scope].align = group[i].name.length;
      }
    }
    group[i].first = scopeCount[group[i].scope].groupLength === 1;
    group[i].groupIndex = scopeCount[group[i].scope].groupLength - 1;
    group[i].index = i;
    group[i].length = n;
  }
  for (var i = 0, n = group.length; i < n; i++) {
    group[i].groupLength = scopeCount[group[i].scope].groupLength;
    group[i].last = group[i].groupIndex === group[i].groupLength - 1;
  }
  if (depth === 0) {
    for (var i = 0, n = group.length; i < n; i++) {
      group[i].align = scopeCount[group[i].scope].align;
    }
  } else {
    // Get alignments
    alignTogether.align = 0;
    for (var i = 0, n = alignTogether.length; i < n; i++) {
      if (scopeCount[alignTogether[i]] && scopeCount[alignTogether[i]].align > alignTogether.align) {
        alignTogether.align = scopeCount[alignTogether[i]].align;
      }
    }
    for (var i = 0, n = group.length; i < n; i++) {
      if (alignTogether.indexOf(group[i].scope) !== -1) {
        group[i].align = alignTogether.align;
      }
    }
  }
  return group;
}

capture.shared = {};

capture.scope = function (value) {
  var selector = /^([\@\.\%\#\*a-zA-Z0-9\[\]\+\~\=\"\'\_\-\:\&\n,\(\) ]+)/;
  if (value.substr(0, 2) === '//') {
    return 'comment inline';
  }
  if (value.substr(0, 2) === '/*') {
    return 'comment block';
  }
  if (/^\$[^:]+?:[^;]+?;/.test(value)) {
    return 'sass variable assignment';
  }
  if (/^(\*|)[a-z\- ]+:[^;]+?;/.test(value)) {
    return 'property group';
  }
  if (value.substring(0, 7) === '@extend') {
    return 'sass extend';
  }
  if (value.substring(0, 7) === '@import') {
    return 'sass import';
  }
  if (value.substring(0, 8) === '@include') {
    if (/^@include\s+[^ ]+?\s+\{/.test(value)) {
      return 'sass include block';
    }
    if (/^@include\s+[^ ]+?\(/.test(value)) {
      return 'sass include arguments';
    }
    return 'sass include';
  }
  if (value.substring(0, 6) === '@mixin') {
    return 'sass mixin';
  }
  if (value.substring(0, 9) === '@function') {
    return 'sass function';
  }
  if (value.substring(0, 7) === '@return') {
    return 'sass return';
  }
  if (value.substring(0, 3) === '@if') {
    return 'sass if';
  }
  if (value.substring(0, 4) === '@for') {
    return 'sass for';
  }
  if (value.substring(0, 5) === '@each') {
    return 'sass each';
  }
  if (/^@else[ ]+if/.test(value)) {
    return 'sass if';
  }
  if (value.substring(0, 5) === '@else') {
    return 'sass if';
  }
  if (selector.test(value) && /^%|^[^\%^{]+?%[^\{]+?\{/.test(value)) {
    return 'sass placeholder';
  }
  if (selector.test(value)) {
    return 'selector';
  }
  return false;
};

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

capture['property group'] = function (string, opt) {
  var m = string.match(/([^:]+?):([^;]+?);/);
  return {
    scope : opt.scope,
    name : m[1].trim(),
    value : m[2].trim(),
    depth : opt.depth,
    strlen : m[0].length
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
  var args = string.substr(i, 2);
  var o;
  var c;
  var v;
  while (args.slice(1) !== '{' && args[0] === '#' || args === '#{' || args.slice(1) !== '{') {
    i += 1;
    args = string.substr(i, 2);
  }
  args = string.substr(0, i);
  start = args.length;
  o = string.substr(start, i).match(/\{/g) || [];
  c = string.substr(start, i).match(/\}/g) || [];
  i = 0;
  while (true) {
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
    if (i === 10000) {
      throw 'There is an error with your CSS on this match: ' + string;
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
    lineBreak : 80,
    align : false,
    sortMainScope : false,
    sortBlockScope : true,
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
    propertyGroupOrder : [
      'z-index',
      'content',
      'display',
      '*display',
      'visibility',
      'appearance',
      '-moz-appearance',
      '-ms-appearance',
      '-webkit-appearance',
      'zoom',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'width',
      'height',
      'float',
      'clear',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'color',
      'list-style',
      'list-style-image',
      'list-style-position',
      'list-style-type',
      'counter-increment',
      'counter-reset',
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
      'border-size',
      'border-style',
      'border-radius',
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      'border-collapse',
      'border-spacing',
      'outline',
      'outline-color',
      'outline-offset',
      'outline-style',
      'outline-width',
      'caption-side',
      'empty-cells',
      'table-layout',
      'text-align',
      'text-decoration',
      'text-decoration-color',
      'text-decoration-line',
      'text-decoration-style',
      'text-underline-position',
      'text-transform',
      'text-shadow',
      'text-overflow',
      'vertical-align',
      'font',
      'font-family',
      'font-size',
      'font-size-adjust',
      'font-style',
      'font-weight',
      'font-kerning',
      'font-stretch',
      'line-height',
      'letter-spacing',
      'word-spacing',
      'line-break',
      'hyphens',
      'overflow-wrap',
      'tab-size',
      'white-space',
      'word-break',
      'word-wrap',
      'box-shadow',
      '-moz-box-shadow',
      '-ms-box-shadow',
      '-webkit-box-shadow',
      'box-decoration-break',
      'opacity',
      'filter',
      'overflow',
      'overflow-x',
      'overflow-y',
      'background',
      'background-image',
      'background-color',
      'background-blend-mode',
      'background-repeat',
      'background-attachment',
      'background-origin',
      'background-position',
      'background-size',
      'background-clip',
      'user-select',
      '-moz-user-select',
      '-ms-user-select',
      '-webkit-user-select',
      'pointer-events',
      'animation',
      'animation-delay',
      'animation-direction',
      'animation-duration',
      'animation-fill-mode',
      'animation-iteration-count',
      'animation-name',
      'animation-play-state',
      'animation-timing-function',
      'transition',
      '-moz-transition',
      '-ms-transition',
      '-webkit-transition',
      'transition-property',
      'transition-duration',
      'transition-timing-function',
      'transition-delay',
      'transform',
      '-moz-transform',
      '-ms-transform',
      '-webkit-transform',
      'cursor',
      'resize',
    ],
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

function sortCss(settings, cssObject) {
  function sortDeep(array) {
    sortCss.scope(settings, array, [
      'sass function',
      'sass import',
      'sass include',
      'sass include arguments',
      'sass mixin',
      'sass include block',
      'sass extend',
      'property group',
      'selector',
    ]);
    if (Array.isArray(array.content)) {
      sortDeep(array.content);
    }
  }
  sortCss.scope(settings, cssObject, [
    'sass import',
    'sass include',
    'sass variable assignment',
    'sass function',
    'sass mixin',
    'sass include block',
    'sass placeholder',
    'selector'
  ]);
  if (settings.sortBlockScope) {
    for (var i = 0, n = cssObject.length; i < n; i++) {
      if (Array.isArray(cssObject[i].content)) {
        sortDeep(cssObject[i].content);
      }
    }
  }
}

sortCss.shared = {};
sortCss.list = {};
sortCss.each = {};

sortCss.scope = function (settings, elementList, sortList) {
  var scope = {};
  var start = 0;
  var name;
  var i;
  var n;
  var x;
  var y;
  // Determine if a comment is the first element in the array
  while (elementList[start].scope.substr(0, 7) === 'comment') {
    start += 1;
  }
  for (i = 0, n = sortList.length; i < n; i++) {
    scope[sortList[i]] = [];
  }
  for (i = elementList.length - 1; i >= start; i--) {
    if (sortList.indexOf(elementList[i].scope) !== -1) {
      scope[elementList[i].scope].push(elementList[i]);
      elementList.splice(i, 1);
    }
  }
  for (i = 0, n = sortList.length; i < n; i++) {
    name = sortList[i];
    if (typeof sortCss.list[name] === 'function' && scope[name].length) {
      sortCss.list[name](settings, scope[name]);
    }
    if (typeof sortCss.each[name] === 'function') {
      for (x = 0, y = scope[name].length; x < y; x++) {
        sortCss.each[name](settings, scope[name][x]);
      }
    }
    if (scope[name].length) {
      [].splice.apply(elementList, [start, 0].concat(scope[name]));
      start += scope[name].length;
    }
  }
};

sortCss.each.selector = function (settings, element) {
  element.selector.sort(smartSort());
};

// sortCss.scope.block = function (settings, cssObject) {
//   var scope = {};
//   var start = 0;
//   var name;
//   while (cssObject[start].scope.substr(0, 7) === 'comment') {
//     start += 1;
//   }
//   for (var i = 0, n = sortCss.scope.block.list.length; i < n; i++) {
//     scope[sortCss.scope.block.list[i]] = [];
//   }
//   for (i = cssObject.length - 1; i >= start; i -= 1) {
//     if (sortCss.scope.block.list.indexOf(cssObject[i].scope) !== -1) {
//       scope[cssObject[i].scope].push(cssObject[i]);
//       cssObject.splice(i, 1);
//     }
//   }
//   for (var i = 0, n = cssObject.length; i < n; i++) {
//     name = cssObject[i].scope;
//     if (sortCss.scope.block.list.indexOf(name) !== -1 && typeof sortCss.list[name] === 'function') {
//       sortCss.list[name](settings, cssObject[i]);
//     }
//     if (sortCss.scope.block.each.indexOf(name) !== -1 && typeof sortCss.each[name] === 'function') {
//       sortCss.each[name](settings, cssObject[i]);
//     }
//   }
// };

// sortCss.scope.main = function (settings, cssObject) {
//   var scope = {};
//   var start = 0;
//   var name;
//   var i;
//   var n;
//   var x;
//   var y;
//   // Determine if a comment is the first element in the array
//   while (cssObject[start].scope.substr(0, 7) === 'comment') {
//     start += 1;
//   }
//   for (i = 0, n = sortCss.scope.main.list.length; i < n; i++) {
//     scope[sortCss.scope.main.list[i]] = [];
//   }
//   for (i = cssObject.length - 1; i >= start; i -= 1) {
//     if (sortCss.scope.main.list.indexOf(cssObject[i].scope) !== -1) {
//       scope[cssObject[i].scope].push(cssObject[i]);
//       cssObject.splice(i, 1);
//     }
//   }
//   for (i = 0, n = sortCss.scope.main.list.length; i < n; i++) {
//     name = sortCss.scope.main.list[i];
//     if (typeof sortCss.list[name] === 'function') {
//       sortCss.list[name](settings, scope[name]);
//     }
//     if (typeof sortCss.each[name] === 'function') {
//       for (x = 0, y = scope[name].length; x < y; x++) {
//         sortCss.each[name](settings, scope[name][x]);
//       }
//     }
//     if (scope[name].length) {
//       [].splice.apply(cssObject, [start, 0].concat(scope[name]));
//       start += scope[name].length;
//     }
//   }
// };
//
// sortCss.scope.main.list = [
//   'sass import',
//   'sass variable assignment',
//   'sass function',
//   'sass mixin',
//   'sass placeholder',
// ];

sortCss.each['sass import'] = function (settings, element) {
  element.value.sort(smartSort());
};

sortCss.list['property group'] = function (settings, list) {
  var order = settings.propertyGroupOrder;
  list.sort(function (a, b) {
    var ai = order.indexOf(a.name);
    var bi = order.indexOf(b.name);
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

sortCss.list['sass variable assignment'] = function (settings, list) {
  list.sort(smartSort('name'));
  for (var i = 0, n = list.length; i < n; i++) {
    list[i].groupIndex = i;
    list[i].first = i === 0;
    list[i].last = i === n - 1;
  }
};

function getValue(settings, cssObject) {
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

getValue['selector'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var selector = element.selector.join(',\n');
  var v = getValue.shared.nested(settings, element, parent);
  return `${selector} {\n${v}${tab}}`;
};

getValue['comment block'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var value;
  function lineBreak() {
    var lines = [[]];
    var $tab = new Array(settings.tabSize + 1).join(settings.tabChar);
    var x = 0;
    var v = element.value.join('\n').split(' ').filter((a) => a.length);
    var tabLength = tab.length + $tab.length;
    for (var i = v.length - 1; i >= 0; i--) {
      if (v[i].length > 1 && v[i].substr(-1) === '\n') {
        v[i] = lasso.trimEnd(v[i]);
        v.splice(i + 1, 0, '\n');
      }
    }
    for (var i = 0, n = v.length; i < n; i++) {
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
    element.value = v.reduce(function (a, b) {
      if (b === '\n') {
        return a += '\n';
      } else if (a.substr(-1) === '\n') {
        return a + b;
      }
      return a += ' ' + b;
    }).split('\n');
  }
  if (settings.lineBreak) {
    lineBreak();
  }
  if (element.value.length > 1) {
    value = element.value.map(function (line) {
      var $tab = new Array(settings.tabSize + 1).join(settings.tabChar);
      return `${$tab}${tab}${line}`;
    }).join('\n');
    return `${tab}/*\n${value}\n${tab}*/`;
  }
  return `${tab}/*\ ${element.value.join('\n')} */`
};

getValue['comment inline'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  return tab + '// ' + element.value;
};

getValue['property group'] = function (settings, element, parent) {
  if (element.align) {
    return element.name + new Array(element.align - element.name.length + 2).join(' ') + ': ' + element.value + ';';
  }
  return element.name + ': ' + element.value + ';';
};

getValue['sass each'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var s = `${element.name} ${element.value}`;
  var v = getValue.shared.nested(settings, element, parent);
  var sublist = lasso.between(element.value, '(', ')');
  var commas = lasso.indexesOf(element.value, ',');
  var lines = [''];
  var index = 0;
  if (sublist.length) {
    commas = commas.filter(function (comma) {
      for (var i = 0, n = sublist.length; i < n; i++) {
        if (comma.index > sublist[i].index && comma.index < sublist[i].index + sublist[i].length) {
          return false;
        }
      }
      return comma.index > sublist.slice(-1)[0].index;
    }).map((a) => a.index);
    for (var i = 0, n = element.value.length; i < n; i++) {
      if (commas.indexOf(i) !== -1) {
        index += 1;
        lines[index] = '';
      } else {
        lines[index] += element.value[i];
      }
    }
    lines = lines.map((a) => a.trim());
    if (settings.align) {
      for (var i = 0, n = lines.length; i < n; i++) {
        if (i === 0) {
          lines[i] = element.name + ' ' + lines[i];
        } else {
          lines[i] = tab + new Array(lines[0].substr(0, lines[0].indexOf('(')).length + 1).join(' ') + lines[i];
        }
      }
      s = lines.join(', \n');
    } else {
      for (var i = 0, n = lines.length; i < n; i++) {
        if (i === 0) {
          lines[i] = element.name + ' ' + lines[i];
        } else {
          lines[i] = tab + lines[i];
        }
      }
      s = lines.join(', \n');
    }
  }
  return `${s} {\n${v}${tab}}`;
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
  var scopeList = element.content.map((a) => a.scope);
  var newGroupIndex = [];
  var newLineCases = [
    'selector',
    'sass function',
    'sass mixin',
    'sass include block',
    'sass for'
  ];
  var t;
  for (var i = 0, n = scopeList.length; i < n; i++) {
    newGroupIndex[i] = i > 0 && t !== scopeList[i] && newLineCases.indexOf(scopeList[i]) !== -1;
    t = scopeList[i];
  }
  return getValue.map(settings, element.content).map(function (value, i) {
    if (element.content[i].name === '@else if') {
      return ` ${value}`;
    }
    if (element.content[i].name === '@else') {
      return ` ${value}`;
    }
    if (element.content[i].index > 1 && element.content[i].name === '@if') {
      return `${tab}${$tab}${value}`;
    }
    if (element.content[i].name === '@if') {
      return `${tab}${$tab}${value}`;
    }
    return `${tab}${$tab}${value}\n`;
  }).join('');
};

getValue['sass include arguments'] = function (settings, element, parent) {
  var args = '(' + element.arguments.join(', ') + ')';
  var align = new Array(element.align - element.name.length + 4).join(' ');
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
  for (var k in source) {
    if (typeof source[k] === 'function') {
      target[k] = function (k) {
        return function () {
          var b = source[k].apply(null, args.concat([].slice.call(arguments)));
          return typeof b === 'undefined' ? target : b;
        }
      }(k);
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

var lasso = require('lasso-string');

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
      var tabChar = editorText.trim().match(/^{\n(\t+|^[ ]+)/m);
      var lineBreak = atom.config.settings.editor.preferredLineLength || 80;
      var tabSize = 2;
      var clean;
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