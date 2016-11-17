
function sassIf(that, element) {
  const mapValue = require('./mapValue');

  const tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  const $tab = new Array(that.tabSize + 1).join(that.tabChar);
  const delegate = {
    "@if" : function () {
      let content = mapValue(that, element.content)
        .map(value => `${tab}${$tab}${value}`).join('\n');

      return `${element.name} ${element.value} {\n${content}\n${tab}}`;
    },

    "@else if" : function () {
      let content = mapValue(that, element.content)
        .map(value => `${tab}${$tab}${value}`).join('\n');

      return element.groupLength > 1
        ? `${element.name} ${element.value} {\n${content}\n${tab}}`
        : `${element.name} ${element.value} {\n${content}\n${tab}}\n`;
    },

    "@else" : function () {
      let content = mapValue(that, element.content)
        .map(value => `${tab}${$tab}${value}`).join('\n');

      return `${element.name} {\n${content}\n${tab}}\n`;
    }
  };

  return delegate[element.name]();
}

module.exports = sassIf;
