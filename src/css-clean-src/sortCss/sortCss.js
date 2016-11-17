const sortEach = require('./modules/sortEach');
const sortList = require('./modules/sortList');

const SORT_DEEP = [
  'sass function',
  'sass import',
  'sass include',
  'sass variable assignment',
  'sass include arguments',
  'sass mixin',
  'sass include block',
  'sass extend',
  'property group',
];

const SORT_SHALLOW = [
  'sass import',
  'sass include',
  'sass variable assignment',
  'font face',
  'sass function',
  'sass mixin',
  'sass include block',
  'sass placeholder',
];

function sortScope(that, content, order) {
  var displace = {};
  var start = 0;
  var name;
  var i;
  var n;
  var x;

  // Determine if a comment is the first element in the array
  while (content[start] && content[start].scope.substr(0, 7) === 'comment') {
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

  // Sort block
  for (name in displace) {
    x = displace[name];
    if (Array.isArray(x) && x.length && typeof sortList[name] === 'function') {
      sortList[name](that, x);
    }
  }

  // Sort individual
  for (i = 0, n = content.length; i < n; i++) {
    x = content[i];
    if (typeof sortEach[x.scope] === 'function') {
      sortEach[x.scope](that, x);
    }
  }

  // Insert the displaced groups back into the main content array
  for (i = 0, n = order.length; i < n; i++) {
    name = order[i];
    if (displace[name].length) {
      [].splice.apply(content, [start, 0].concat(displace[name]));
      start += displace[name].length;
    }
  }
}

function sortDeep(that, content) {
  sortScope(that, content, SORT_DEEP);

  for (var i = 0, n = content.length; i < n; i++) {
    if (Array.isArray(content[i].content) && content[i].content.length) {
      sortDeep(that, content[i].content);
    }
  }
}

function sortCss(that, cssObject) {
  sortScope(that, cssObject, SORT_SHALLOW);

  for (var i = 0, n = cssObject.length; i < n; i++) {
    if (Array.isArray(cssObject[i].content) && cssObject[i].content.length) {
      sortDeep(that, cssObject[i].content);
    }
  }
}

module.exports = sortCss;
