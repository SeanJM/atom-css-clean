const format = {
  'background' : require('./propertyGroup/background.js'),
  'background-image' : require('./propertyGroup/background.js'),
  default : require('./propertyGroup/default.js'),
};

function propertyGroup(that, element, siblings) {
  if (typeof format[element.name] === 'function') {
    return format[element.name](that, element, siblings);
  }
  return format.default(that, element, siblings);
}

module.exports = propertyGroup;
