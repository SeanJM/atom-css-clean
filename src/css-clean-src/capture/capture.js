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
