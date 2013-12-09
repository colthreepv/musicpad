module.exports = function (grunt) {

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-concat-sourcemap');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // concat
    concat_sourcemap: {
      options: {
        sourcesContent: true
      },
      app: {
        src: [
          'app/app.js'
        ],
        dest: 'app.js'
      },
      libs: {
        src: [
          'libs/angular/angular.js',
        ],
        dest: 'libs.js'
      }
    },
    // copy
    copy: {
      index: {
        src: 'index.html',
        dest: 'build/index.html'
      }
    },
    // mkdir
    mkdir: {
      build: {
        options: {
          create: ['build']
        }
      }
    },
    // clean
    clean: {
      app: ['app.js'],
      libs: ['libs.js'],
      templates: ['templates.js'],
      bower: ['libs/*']
    },
    // connect
    connect: {
      serve: {
        options: {
          port: 8181,
          base: '.',
          hostname: '*',
          debug: true,
          keepalive: true
        }
      }
    },
    watch: {

    }
  });

  grunt.registerTask('trash', ['clean:app', 'clean:libs', 'clean:templates']);
  grunt.registerTask('default', ['trash', 'concat_sourcemap', 'connect']);
  // grunt.registerTask('build', ['mkdir', 'copy', 'build']);
};
