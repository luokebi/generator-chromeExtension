/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        mt: grunt.file.readJSON('ext/manifest.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            js_and_css: {
                files:{
                    // concat js files
                    'ext/js/background.js': ['src/js/background/*.js'],
                    'ext/js/popup.js': ['src/js/popup/*.js'],
                    'ext/js/contentscript.js': ['src/js/content-script/*.js']
                }
            }

        },
        uglify: {
           js: {
               files: [{
                expand: true,
                cwd: 'dist/ext/js',
                src: '*.js',
                dest: 'dist/ext/js'
              }]
           }
        },
        copy:{
          dev: {
            files: [
                  {
                     expand: true,
                     cwd: 'src/js',
                     src: ['*.js'],
                     dest: 'ext/js/'
                  }
            ]
          },
          main: {
             files:[
                 {
                     expand: true,
                     src: ['ext/**/*'],
                     dest:'dist/'
                 }
             ]
          }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {'window':true,'$':true,'chrome':true,'console':true}
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['src/js/*.js']
            }
        },
        cssmin: {
           minify: {
               expand: true,
               cwd: 'dist/ext/css/',
               src: ['*.css'],
               dest: 'dist/ext/css/'
           }
        },
        imagemin:{
          image: {
            options: {
              optimizationLevel: 3
            },
            files: [{
              expand: true,
              cwd: 'ext/images/',
              src: ['**/*.{png,jpg,gif}'],
              dest: 'dist/ext/images'
            }]
          }

        },
        htmlmin: {
          min: {
            options: {
              removeComments: true,
              collapseWhitespace: true
            },
            files: [{
              expand: true,
              cwd: "dist/ext/",
              src: ['*.html'],
              dest: 'dist/ext'
            }]
          }
        },
        compress: {
          main: {
            options: {
              archive: 'dist/smart-shopper-<%= mt.version %>.zip'
            },
            files: [{
              expand: true,
              src: ['**/*'],
              cwd: 'dist/ext/'
            }]
          }
        },

        watch: {
            js:{
                files: ['src/**/*'],
                tasks: ['concat','copy:dev']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task.
    grunt.registerTask('dev',['concat','copy:dev']);
    grunt.registerTask('release', ['concat','copy','cssmin','uglify','htmlmin','imagemin','compress']);
    grunt.registerTask('default',['concat','copy:dev','watch']);
    grunt.registerTask('test',['imagemin']);


};