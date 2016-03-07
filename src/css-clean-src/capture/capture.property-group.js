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
