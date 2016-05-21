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
