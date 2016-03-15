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
