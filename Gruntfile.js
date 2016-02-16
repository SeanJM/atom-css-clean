var matchFile = require('match-file-utility');
var js = {
  cssClean : matchFile('src/css-clean-src', /\.js$/)
  .smartSort()
  .concat('src/exports.js')
};

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    concat : {
      options: {
        sourceMap : true,
      },
      js : {
        files : {
          'main.js' : js.cssClean,
        }
      }
    },
    watch : {
      js_all : {
        files : js.cssClean,
        tasks : ['concat']
      },
      configFiles : {
        files : ['Gruntfile.js'],
        options : {
          reload : true
        },
        tasks : ['default']
      }
    }
  });
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Default task(s).
  /*grunt.registerTask('default', ['concat_sourcemap','sass','autoprefixer','uglify','imagemin','watch']);*/
  grunt.registerTask('default', ['concat', 'watch']);
};
