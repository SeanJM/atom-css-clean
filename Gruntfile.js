var images = {};
var js = {};
(function () {
  var lib = {
    init: [
      'src/init.js'
    ],
    root: [
      'src/cleanCss.js',
      'src/cleanCss.fn.js',
      'src/cleanCss.microdash.js',
      'src/cleanCss.*.js',
      'src/exports.js',
    ]
  };
  function get(getGroup) {
    var getFiles = [];
    for (var i = 0, n = getGroup.length; i < n; i++) {
      getFiles = getFiles.concat(lib[getGroup[i]]);
    }
    return getFiles;
  }
  js.owner = get([
    'init',
    'root',
  ]);
  js.all = get([
    'init',
    'root',
  ])
})();
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner    : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap : true,
        mangle    : false,
        compress  : false
      },
      js: {
        files: {
          'lib/css-clean.js' : js.all,
        }
      }
    },
    watch: {
      js_all: {
        files: js.all,
        tasks: ['uglify']
      },
      configFiles: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        },
        tasks: ['default']
      }
    },
    jshint: {
      all: js.all
    }
  });
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Default task(s).
  /*grunt.registerTask('default', ['concat_sourcemap','sass','autoprefixer','uglify','imagemin','watch']);*/
  grunt.registerTask('default', ['uglify', 'watch']);
};
