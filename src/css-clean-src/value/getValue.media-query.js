(function () {
  function flatten(opt, condition) {
    var padding = new Array(opt.padding + 1 - condition.property.length).join(' ');

    // and (min-device-width : 300px)
    return condition.operator +
      ' (' +
      condition.property +
      padding +
      ' : ' +
      condition.value +
      ')';
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

  getValue['media query'] = function (settings, element, parent) {
    var tab = new Array((element.depth * settings.tabSize) + 1).join(settings.tabChar);
    var align = new Array(element.name.length + 2).join(' ');
    var nested = getValue.shared.nested(settings, element, parent);
    var padding = 0;
    var value;

    element.value.forEach(function (a) {
      a.forEach(function (b) {
        if (b.property && b.property.length > padding) {
          padding = b.property.length;
        }
      });
    });

    value = element.value.map(function (mediaElement, i) {
      var value = joinLines({
        padding : padding,
        mediaElement : mediaElement,
        tab : tab,
        align : align
      });

      return i > 0
        ? tab + align + value
        : value;
    }).join(',\n');

    return element.name + ' ' + value + ' {\n' + nested + tab + '}';
  };
}());
