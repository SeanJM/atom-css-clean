function flatten(opt, condition) {
  let padding = new Array(opt.padding + 1 - condition.property.length).join(' ');
  // and (min-device-width : 300px)
  return `${condition.operator} (${condition.property}${padding} : ${condition.value})`;
}

function joinLines(opt) {
  return opt.mediaElement
    .map(function (condition, i) {
      return condition.mediaType
        ? condition.mediaType
        : opt.tab + opt.align + flatten(opt, condition);
    })
    .join('\n');
}

function mediaQuery(that, element, siblings) {
  const nested = require('./nested');

  let tab = new Array((element.depth * that.tabSize) + 1).join(that.tabChar);
  let align = new Array(element.name.length + 2).join(' ');
  let nest = nested(that, element, siblings);
  let padding = 0;
  let value;

  element.value.forEach(function (a) {
    a.forEach(function (b) {
      if (b.property && b.property.length > padding) {
        padding = b.property.length;
      }
    });
  });

  value = element.value.map(function (mediaElement, i) {
    let value = joinLines({
      padding : padding,
      mediaElement : mediaElement,
      tab : tab,
      align : align
    });

    return i > 0
      ? tab + align + value
      : value;
  }).join(',\n');

  return `${element.name} ${value} {\n${nest}${tab}}`;
}

module.exports = mediaQuery;
