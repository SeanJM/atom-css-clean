const mapValue = require('./modules/mapValue');

function getValue(settings, cssObject) {
  return mapValue(settings, cssObject)
    .map(function (value, i) {
      let element = cssObject[i];
      return (
        element.scope === 'sass variable assignment'
        && !element.last
      ) ? value
        : value + '\n';
    })
    .join('\n');
}

module.exports = getValue;
