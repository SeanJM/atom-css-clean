const ALIGN_TOGETHER = [
  'property group',
  'sass import',
  'sass include',
  'sass include arguments',
  'sass extend',
  'sass variable assignment',
];

function index(group, depth) {
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
  n = ALIGN_TOGETHER.length;

  for (; i < n; i++) {
    x = ALIGN_TOGETHER[i];
    if (scopeCount[x] && scopeCount[x].align > align) {
      align = scopeCount[x].align;
    }
  }

  i = 0;
  n = group.length;

  for (; i < n; i++) {
    x = group[i];

    if (ALIGN_TOGETHER.indexOf(x.scope) !== -1) {
      x.align = align;
    }

    // Recursively get information about siblings
    if (Array.isArray(x.content)) {
      index(x.content, depth + 1);
    }
  }
}

module.exports = index;
