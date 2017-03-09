const path = require('path');
const fs = require('fs');
var cleanCss = require('css-clean');

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

      let tab = {
        size : 2,
        char : ' '
      };

      try {
        let config = JSON.parse(fs.readFileSync(path.join(atom.project.rootDirectories[0].path, '.csscleanrc'), 'utf8'));

        if (config.tab_char === 'space') {
          tab.char = ' ';
        } else if (config.tab_char === 'tab') {
          tab.char = '\t';
        }

        tab.size = config.tab_size || 2;

      } catch (e) {}

      if (atom.config.settings && atom.config.settings.editor && atom.config.settings.editor.preferredLineLength) {
        lineBreak = atom.config.settings.editor.preferredLineLength;
      }

      if (/^source\.css/.test(editor.getRootScopeDescriptor().scopes[0])) {
        clean = cleanCss({
          css : editorText,
          tabSize : tab.size,
          tabChar : tab.char,
          lineBreak : lineBreak
        });

        editor.setText(clean);
        editor.setSelectedBufferRange(selectedBuffer);
      }
    }
  };
})();
