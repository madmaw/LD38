module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            dist: {
                src: ['src/main/ts/**/*.ts', 'typings/**/*.d.ts'],
                out: 'build/out.js',
                //reference: 'reference.ts',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    basePath: 'src/main/ts',
                    sourceMap: true,
                    declaration: false
                }
            }
        },
        clean: {
            all: ["build", "dist", "dist.zip"],
            dist: ["dist"]
        },
        copy: {
            dist: {
                files: [
                    { expand: true, src: ['node_modules/pixi.js/dist/pixi.js'], dest: 'dist/' },
                    { expand: true, src: ['build/out.js'], dest: 'dist/' },
                    { expand: true, src: ['index.html'], dest: 'dist/' },
                    { expand: true, src: ['app.css'], dest: 'dist/' }
                ]
            }
        },
        compress: {
            dist: {
                options: {
                    archive: 'dist.zip'
                },
                expand: true,
                level: 10,
                cwd: 'dist/',
                src: ['*', '**'],
                dest: '.'
            }

        }
    });

    // clean
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Load the plugin that provides the "TS" task.
    grunt.loadNpmTasks('grunt-ts');
    // zip
    grunt.loadNpmTasks('grunt-contrib-compress');
    // copy
    grunt.loadNpmTasks('grunt-contrib-copy');
    // replace text in file
    grunt.loadNpmTasks('grunt-text-replace');

    // Default task(s).
    grunt.registerTask('reset', ['clean:all']);
    grunt.registerTask('prod', ['copy', 'ts:dist']);
    grunt.registerTask('dist', ['prod', 'compress:dist']); //, 'clean:js', 'clean:dist'
    grunt.registerTask('default', ['ts:dist']);

};
