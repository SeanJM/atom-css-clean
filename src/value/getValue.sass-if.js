getValue['sass if'] = function (settings, element, parent) {
  var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
  var $tab = new Array(settings.tabSize + 1).join(settings.tabChar);
  var delegate = {
    "@if" : function () {
      var s = `${element.name} ${element.value}`;
      var v = getValue.map(settings, element.content).map(function (value) {
        return `${tab}${$tab}${value}`;
      }).join('\n');
      if (element.groupLength > 1 && element.index > 1) {
        return `${s} {\n${v}\n${tab}}`;
      }
      if (element.groupLength > 1) {
        return `${s} {\n${v}\n${tab}}`;
      }
      return `${s} {\n${v}\n${tab}}`;
    },
    "@else if" : function () {
      var s = `${element.name} ${element.value}`;
      var v = getValue.map(settings, element.content).map(function (value) {
        return `${tab}${$tab}${value}`;
      }).join('\n');
      if (element.groupLength > 1) {
        return `${s} {\n${v}\n${tab}}`;
      }
      return `${s} {\n${v}\n${tab}}\n`;
    },
    "@else" : function () {
      var s = `${element.name}`;
      var v = getValue
      .map(settings, element.content)
      .map(function (value) {
        return `${tab}${$tab}${value}`;
      }).join(';\n');
      return `${s} {\n${v}\n${tab}}\n`;
    }
  };
  return delegate[element.name]();
};
