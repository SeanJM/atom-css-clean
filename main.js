var cleanCss = require('./src/css-clean-src/cleanCss');

function getTab(editorText) {
  var char = editorText
    .trim()
    .match(/\{\s+([a-zA-Z]+)/g)
    .map(function (a) {
      return a.match(/\{(\s+)/)[1].replace(/\n/, '');
    })
    .filter(function (a) {
      return a.length;
    })
    .sort(function (a, b) {
      return a.length - b.length;
    })[0];

  return {
    size : char ? char.length : 2,
    char : /\t/.test(char) ? '\t' : ' ',
  };
}

(function () {
  module.exports = {
    activate: function () {
      atom.commands.add('atom-text-editor', {
        'css-clean:convert': this.convert
      });
    },

    convert: function () {
      var editor = this.getModel();
      var editorText = editor.getText();
      var selectedBuffer = editor.getSelectedBufferRange();
      var lineBreak = 80;
      var clean;

      var tab = getTab(editorText);

      if (atom.config.settings && atom.config.settings.editor && atom.config.settings.editor.preferredLineLength) {
        lineBreak = atom.config.settings.editor.preferredLineLength;
      }

      if (/^source\.css/.test(editor.getRootScopeDescriptor().scopes[0])) {
        clean = cleanCss(editorText)
          .indent(tab.size, tab.char)
          .setLineBreak(lineBreak)
          .valueOf();

        editor.setText(clean);
        editor.setSelectedBufferRange(selectedBuffer);
      }
    }
  };
})();
