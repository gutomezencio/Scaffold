module.exports = function(grunt) {
    'use strict';

    var config = {
            dev: {
                path: 'dev',
                assets: 'dev/assets',
                partials: 'dev/partials'
            },
            staging: {
                path: 'staging',
                assets: 'staging/assets',
                partials: 'staging/partials'
            },
            build: {
                path: 'build',
                assets: 'build/assets',
                partials: 'build/partials'
            }
        },
        js = {
            project: [
                config.dev.assets + '/js/main.js'
            ],
            plugins: [
                config.dev.assets + '/js/comp/plugins/*.js'
            ]
        };

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,
        uglify_files: js.plugins.concat(js.project),
        banner: '/*! <%= pkg.projectName %> - v<%= pkg.version %> - by <%= pkg.developers %> - <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        clean: {
            staging: ['<%= config.staging.path %>'],
            build: ['<%= config.build.path %>'],
            joycss: ['<%= config.build.assets %>/css/main.min.joy']
        },
        less: {
            staging: {
                files: {
                    '<%= config.staging.assets %>/css/main.min.css': '<%= config.dev.assets %>/less/main.less'
                },
                options: {
                    yuicompress: false
                }
            },
            build: {
                files: {
                    '<%= config.build.assets %>/css/main.min.css': '<%= config.dev.assets %>/less/main.less'
                },
                options: {
                    yuicompress: false
                }
            }
        },
        jshint: {
            files: js.project,
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                },
                bitwise: true,
                expr: true
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: {
                    except: ['jQuery', 'Backbone']
                }
            },
            build: {
                files: {
                    '<%= config.build.assets %>/js/main.min.js': '<%= uglify_files %>'
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            staging: {
                src: ['<%= uglify_files %>'],
                dest: '<%= config.staging.assets %>/js/main.min.js',
            }
        },
        joycss: {
            build: {
                options: {
                    layout: 'auto',
                    alpha: true
                },
                cwd: '<%= config.build.assets %>/css/',
                src: ['main.min.css'],
                dest: '<%= config.build.assets %>/css/'
            }
        },
        rename: {
            main: {
                files: [{
                    src: ['<%= config.build.assets %>/img/main.min-sprite.png'],
                    dest: '<%= config.build.assets %>/img/main-sprite.png'
                }]
            }
        },
        replace: {
            sprite: {
                src: ['<%= config.build.assets %>/css/*.css'],
                overwrite: true,
                replacements: [{
                    from: 'main.min-sprite.png',
                    to: 'main-sprite.png?' + '<%= new Date().getTime() %>'
                }]
            },
            esc_sprite: {
                src: ['<%= config.build.assets %>/css/*.css'],
                overwrite: true,
                replacements: [{
                    from: '?esc)',
                    to: '?<%= new Date().getTime() %>)'
                }]
            }
        },
        imagemin: {
            options: {
                optimizationLevel: 7
            },
            build: {
                expand: true,
                cwd: '<%= config.build.assets %>/img',
                src: '{,*/}*.{png,jpg,jpeg}',
                dest: '<%= config.build.assets %>/img'
            }
        },
        imageEmbed: {
            build: {
                src: ['<%= config.build.assets %>/css/main.min.css'],
                dest: '<%= config.build.assets %>/css/main.min.css',
                options: {
                    //deleteAfterEncoding: true,
                    maxImageSize: 20480
                }
            }
        },
        responsive_images: {
            build: {
                options: {
                    sizes: [{
                        width: 240,
                        name: 'small'
                    }, {
                        width: 320,
                        name: 'standard'
                    }, {
                        width: 768,
                        name: 'tablet'
                    }]
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dev.assets %>/img',
                    src: ['**/*.{jpg,gif,png}'],
                    dest: '<%= config.build.assets %>/img'
                }]
            }
        },
        svgmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dev.assets %>/svg',
                    src: ['**/*.svg'],
                    dest: '<%= config.build.assets %>/svg'
                }]
            }
        },
        htmlbuild: {
            staging: {
                src: '<%= config.dev.path %>/*.html',
                dest: '<%= config.staging.path %>/',
                options: {
                    sections: {
                        header: '<%= config.dev.partials %>/header.html',
                        footer: '<%= config.dev.partials %>/footer.html'
                    }
                }
            },
            build: {
                src: '<%= config.dev.path %>/*.html',
                dest: '<%= config.build.path %>/',
                options: {
                    sections: {
                        header: '<%= config.dev.partials %>/header.html',
                        footer: '<%= config.dev.partials %>/footer.html'
                    }
                }
            }
        },
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: {
                    '<%= config.build.path %>/index.html': '<%= config.build.path %>/index.html'
                }
            }
        },
        htmlcompressor: {
            build: {
                files: {
                    '<%= config.build.path %>/index.html': '<%= config.build.path %>/index.html'
                },
                options: {
                    type: 'html',
                    preserveServerScript: true,
                    compressJs: true
                }
            }
        },
        cmq: {
            build: {
                options: {
                    log: 'true'
                },
                files: {
                    '<%= config.build.assets %>/css/': ['<%= config.build.assets %>/css/*.css']
                }
            }
        },
        csso: {
            build: {
                options: {
                    report: 'gzip',
                    banner: '<%= banner %>'
                },
                files: {
                    '<%= config.build.assets %>/css/main.min.css': ['<%= config.build.assets %>/css/main.min.css']
                }
            }
        },
        cachebreaker: {
            js: {
                asset_url: 'assets/js/main.min.js',
                files: {
                    src: '<%= config.build.path %>/*.html'
                }
            },
            css: {
                asset_url: 'assets/css/main.min.css',
                files: {
                    src: '<%= config.build.path %>/*.html'
                }
            }
        },
        copy: {
            fontsStaging: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.assets %>/font/*'],
                    dest: '<%= config.staging.assets %>/font/',
                    flatten: true
                }]
            },
            fontsBuild: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.assets %>/font/*'],
                    dest: '<%= config.build.assets %>/font/',
                    flatten: true
                }]
            },
            scriptsStaging: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.assets %>/js/comp/lib/*'],
                    dest: '<%= config.staging.assets %>/js/comp/lib',
                    flatten: true
                }]
            },
            scriptsBuild: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.assets %>/js/comp/lib/*'],
                    dest: '<%= config.build.assets %>/js/comp/lib',
                    flatten: true
                }]
            },
            swfStaging: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.assets %>/swf/*.swf'],
                    dest: '<%= config.staging.assets %>/swf',
                    flatten: true
                }]
            },
            swfBuild: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.assets %>/swf/*.swf'],
                    dest: '<%= config.build.assets %>/swf',
                    flatten: true
                }]
            },
            imgStaging: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.assets %>/img/*'],
                    dest: '<%= config.staging.assets %>/img',
                    flatten: true
                }]
            },
            imgBuild: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.assets %>/img/*'],
                    dest: '<%= config.build.assets %>/img',
                    flatten: true
                }]
            },
            cssStaging: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.assets %>/css/*'],
                    dest: '<%= config.staging.assets %>/css',
                    flatten: true
                }]
            },
            cssBuild: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.assets %>/css/*'],
                    dest: '<%= config.build.assets %>/css',
                    flatten: true
                }]
            },
            filesStaging: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.path %>/{,*/}*.{png,jpg,jpeg,txt,json,gif,htaccess}'],
                    dest: '<%= config.staging.path %>/',
                    flatten: true
                }]
            },
            filesBuild: {
                files: [{
                    expand: true,
                    src: ['<%= config.dev.path %>/{,*/}*.{png,jpg,jpeg,txt,json,gif,htaccess}'],
                    dest: '<%= config.build.path %>/',
                    flatten: true
                }]
            }
        },
        watch: {
            scripts: {
                files: [
                    '<%= config.dev.assets %>/js/*.js',
                    '<%= config.dev.assets %>/js/**/*.js'
                ],
                tasks: ['jshint', 'concat']
            },
            less: {
                files: [
                    '<%= config.dev.assets %>/less/**/*.less',
                    '<%= config.dev.assets %>/less/*.less'
                ],
                tasks: ['less:staging'],
                options: {
                    livereload: true,
                }
            },
            css: {
                files: [
                    '<%= config.dev.assets %>/css/**/*.css',
                    '<%= config.dev.assets %>/css/*.css'
                ],
                tasks: ['copy:cssStaging']
            },
            img: {
                files: [
                    '<%= config.dev.assets %>/img/**/*',
                    '<%= config.dev.assets %>/img/*'
                ],
                tasks: ['copy:imgStaging']
            },
            svg: {
                files: [
                    '<%= config.dev.assets %>/svg/**/*.svg',
                    '<%= config.dev.assets %>/svg/*.svg'
                ],
                tasks: ['copy:svgStaging']
            },
            swf: {
                files: [
                    '<%= config.dev.assets %>/swf/**/*',
                    '<%= config.dev.assets %>/swf/*'
                ],
                tasks: ['copy:swfStaging']
            },
            html: {
                files: [
                    '<%= config.dev.path %>/**/*.html',
                    '<%= config.dev.path %>/*.html'
                ],
                tasks: ['htmlbuild:staging'],
                options: {
                    livereload: true,
                }
            }
        }
    });

    grunt.registerTask('default', [
        'clean:staging',
        'copy:fontsStaging',
        'copy:scriptsStaging',
        'copy:swfStaging',
        'copy:imgStaging',
        'copy:filesStaging',
        'htmlbuild:staging',
        'concat',
        'less:staging',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:build',
        'copy:fontsBuild',
        'copy:scriptsBuild',
        'copy:swfBuild',
        'copy:imgBuild',
        'copy:filesBuild',
        'responsive_images',
        'svgmin',
        'less:build',
        'cmq',
        'joycss',
        'rename',
        'replace',
        'imageEmbed',
        'csso',
        'imagemin',
        'uglify',
        'htmlbuild:build',
        'cachebreaker',
        'htmlmin',
        'htmlcompressor',
        'clean:joycss'
    ]);
};
