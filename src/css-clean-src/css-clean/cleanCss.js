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
