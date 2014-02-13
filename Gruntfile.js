module.exports = function(grunt) {
  grunt.registerTask('dev', [
    'dev-build',
    'connect:test',
    'watch:dev-build'
  ]);

  grunt.registerTask('dev-build', [
    'clean',
    'jshint', 
    'transpile:lib', 'transpile:test', 
    'concat:lib', 'concat:test'
  ]);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['tmp'],

    concat: {
      'lib': {
        src: 'tmp/transpiled/lib/**/*.js',
        dest: 'tmp/assets/lib.js'
      },
      'test': {
        src: 'tmp/transpiled/test/**/*.js',
        dest: 'tmp/assets/test.js'
      }
    },

    connect: {
      'test': {
        options: {
          base: ['bower_components', 'tmp', 'test-env']
        }
      }
    },

    watch: {
      'dev-build': {
        files: ['lib/**', 'test/**'],
        tasks: ['dev-build'],
        options: {
          livereload: true
        }
      },
    },

    jshint: {
      options: {
        'jshintrc': '.jshintrc'
      },
      all: ['lib/**/*.js', 'test/**/*.js']
    },

    transpile: {
      'lib': {
        moduleName: function(path) {
          return grunt.config.process('<%= pkg.name %>') + path;
        },
        type: 'amd',
        files: [{
          expand: true,
          cwd: 'lib',
          src: '**/*.js',
          dest: 'tmp/transpiled/lib'
        }]
      },

      'test': {
        moduleName: function(path) {
          return grunt.config.process('<%= pkg.name %>/test') + path;
        },
        type: 'amd',
        files: [{
          expand: true,
          cwd: 'test',
          src: '**/*.js',
          dest: 'tmp/transpiled/test'
        }]
      }
    }
  });
};
