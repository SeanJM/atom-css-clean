const map = {
  'character set' : require('./characterSet'),
  'comment block' : require('./commentBlock'),
  'comment inline' : require('./commentInline'),
  'font face' : require('./fontFace'),
  'media query' : require('./mediaQuery'),
  'property group' : require('./propertyGroup'),
  'sass each' : require('./sassEach'),
  'sass extend' : require('./sassExtend'),
  'sass for' : require('./sassFor'),
  'sass function' : require('./sassFunction'),
  'sass if' : require('./sassIf'),
  'sass import' : require('./sassImport'),
  'sass include arguments' : require('./sassIncludeArguments'),
  'sass include block' : require('./sassIncludeBlock'),
  'sass include' : require('./sassInclude'),
  'sass mixin' : require('./sassMixin'),
  'sass placeholder' : require('./sassPlaceholder'),
  'sass return' : require('./sassReturn'),
  'sass variable assignment' : require('./sassVariableAssignment'),
  'selector' : require('./selector'),
};

function mapValue(that, parent) {
  return parent.map(function (element) {
    return map[element.scope](that, element, parent);
  });
}

module.exports = mapValue;
