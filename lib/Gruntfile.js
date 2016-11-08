module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      js: {
          src: ['../javascripts/main.js'],
          dest: 'dist/app.js'
      }
    },
    jshint: {
      files: ['../javascripts/**/*.js'],
      options: {
        predef: [ "document", "console", "$", "firebase", "alert"],
        esnext: true,
        globalstrict: true,
        globals: {},
        browserify: true
      }
    },
     sass: {
      dist: {
        files: {
          '../styles/styles.css': '../sass/styles.scss'
        }
      }
    },
    watch: {
      javascripts: {
        files: ['../javascripts/**/*.js'],
        tasks: ['jshint', 'browserify']
      },
      sassy: {
        files: ['../sass/**/*.scss'],
        tasks: ['sass']        
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['sass', 'jshint', 'browserify', 'watch']);
};