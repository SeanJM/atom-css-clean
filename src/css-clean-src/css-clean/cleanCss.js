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
    propertyGroupOrder : list.properties,
    tabSize : 2
  };
  return fnChain({}, cleanCss.fn, [settings, string]);
}

cleanCss.fn = {};

if (module) {
  module.exports = cleanCss;
}
