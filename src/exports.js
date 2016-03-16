(function () {
  module.exports = {
    activate: function(state) {
      atom.commands.add('atom-text-editor', {
        'css-clean:convert': this.convert
      });
    },
    convert: function (event) {
      var editor         = this.getModel();
      var editorText     = editor.getText();
      var selectedBuffer = editor.getSelectedBufferRange();
      var tabChar = editorText.trim().match(/^{\n(\t+|^[ ]+)/m);
      var lineBreak = 80;
      var tabSize = 2;
      var clean;

      if (atom.config.settings && atom.config.settings.editor && atom.config.settings.editor.preferredLineLength) {
        lineBreak = atom.config.settings.editor.preferredLineLength;
      }

      if (tabChar) {
        tabSize = tabChar[1].length;
        tabChar = tabChar[1][0];
      } else {
        tabChar = ' ';
      }
      if (/^source\.css/.test(editor.getRootScopeDescriptor().scopes[0])) {
        clean = cleanCss(editorText)
        .setTabChar(tabChar)
        .setTabSize(tabSize)
        .setLineBreak(lineBreak)
        .sortBlockScope()
        .sortMainScope()
        .align()
        .value();
        //console.log(clean);
        editor.setText(clean);
        editor.setSelectedBufferRange(selectedBuffer);
      }
    }
  };
})();
