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
      var clean;
      if (/^source\.css/.test(editor.getRootScopeDescriptor().scopes[0])) {
        clean = cleanCss(editorText)
          .sortContent()
          .alignProperties()
          .value();
        editor.setText(clean);
        editor.setSelectedBufferRange(selectedBuffer);
      }
    }
  };
})();
