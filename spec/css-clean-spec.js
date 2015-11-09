var CssClean = require('../lib/css-clean');

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("CssClean", function() {
  var ref = [],
      workspaceElement = ref[0],
      activationPromise = ref[1];
  beforeEach(function() {
    workspaceElement = atom.views.getView(atom.workspace);
    return activationPromise = atom.packages.activatePackage('css-clean');
  });
  return describe("when the css-clean:toggle event is triggered", function() {
    it("hides and shows the modal panel", function() {
      expect(workspaceElement.querySelector('.css-clean')).not.toExist();
      atom.commands.dispatch(workspaceElement, 'css-clean:toggle');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        var cssCleanElement, cssCleanPanel;
        expect(workspaceElement.querySelector('.css-clean')).toExist();
        cssCleanElement = workspaceElement.querySelector('.css-clean');
        expect(cssCleanElement).toExist();
        cssCleanPanel = atom.workspace.panelForItem(cssCleanElement);
        expect(cssCleanPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'css-clean:toggle');
        return expect(cssCleanPanel.isVisible()).toBe(false);
      });
    });
    return it("hides and shows the view", function() {
      jasmine.attachToDOM(workspaceElement);
      expect(workspaceElement.querySelector('.css-clean')).not.toExist();
      atom.commands.dispatch(workspaceElement, 'css-clean:toggle');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        var cssCleanElement;
        cssCleanElement = workspaceElement.querySelector('.css-clean');
        expect(cssCleanElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'css-clean:toggle');
        return expect(cssCleanElement).not.toBeVisible();
      });
    });
  });
});
