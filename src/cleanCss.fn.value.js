(function () {
  var fill = {
    selector : '@tabLength@selector',
    group    : '@selector {\n@content@tabLength}\n',
    content  : '@tabLength@property: @value;\n',
    sass     : '@tabLength@property  @value;\n',
  };
  var _ = cleanCss.microdash;
  function template(string, object) {
    return string.replace(/@([a-zA-Z]+)/g, function (m, property) {
      return typeof object[property] === 'string' ? object[property] : '';
    });
  }
  function toSelector(selector, tabLength) {
    var out;
    if (/@media/.test(selector.join(''))) {
      out = selector.join(',\n');
    } else {
      var longest = selector
        .map(function (a) { return a.length; })
        .sort(function (a, b) { return a - b})
        .slice(-1)[0];
      if (longest < 10) {
        out = _.chunk(selector.sort(), Math.ceil(20 / longest)).map(function (selectors) {
          return template(fill.selector, {
            selector : selectors.join(', '),
            tabLength : tabLength
          });
        }).join(',\n');
      } else {
        out = selector.sort().map(function (selector) {
          return template(fill.selector, {
            selector : selector,
            tabLength : tabLength
          });
        }).join(',\n');
      }
    }
    return out;
  }
  function convertToString(cssGroups, tabLength) {
    var convertedGroup = [];
    tabLength          = tabLength || 0;
    cssGroups.forEach(function (group) {
      var content = [];
      var tabChar = group.tabs ? '\t' : ' ';
      group.content.forEach(function (groupContent) {
        // Property is SASS
        if (/^@/.test(groupContent.property)) {
          content.push(template(fill.sass, {
            property : groupContent.property,
            value    : groupContent.value,
            tabLength : new Array(group.tabLength + 1).join(tabChar)
          }));
        } else {
          // Property is CSS
          content.push(template(fill.content, {
            property : groupContent.property,
            value    : groupContent.value,
            tabLength : new Array(group.tabLength + 1).join(tabChar)
          }));
        }
      });
      if (Array.isArray(group.child)) {
        // Join the return value and push it to 'content'
        content.push(convertToString(group.child, group.tabLength).join(''));
      }
      convertedGroup.push(template(fill.group, {
        selector  : toSelector(group.selector, new Array(tabLength + 1).join(tabChar)),
        content   : content.join(''),
        tabLength : new Array(tabLength + 1).join(' ')
      }));
    });
    return convertedGroup;
  }
  cleanCss.fn.value = function () {
    var converted = convertToString(this);
    var self      = this;
    self.forEach(function (m, i) {
      self.string = self.string.replace(m.value, converted[i].trim());
    });
    return self.string;
  };
})();
