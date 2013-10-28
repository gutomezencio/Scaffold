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
    };

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,
        uglify_files: js.vendor.concat(js.project),
        banner: '/*! <%= pkg.projectName %> - v<%= pkg.version %> - by <%= pkg.developers %> - <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        clean: {
            staging: [
                '<%= config.staging.path %>/**/*',
                '!<%= config.staging.path %>/**/.git',
                '!<%= config.staging.path %>/**/.svn'
            ],
            build: [
                '<%= config.build.path %>/**/*',
                '!<%= config.build.path %>/**/.git',
                '!<%= config.build.path %>/**/.svn'
            ],
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
            }/*,
            build: {
                files: {
                    '<%= config.build.assets %>/js/main.min.js': '<%= uglify_files %>'
                }
            }*/
        },
        concat: {
            options: {
                separator: ';'
            }/*,
            staging: {
                src: ['<%= uglify_files %>'],
                dest: '<%= config.staging.assets %>/js/main.min.js',
            }*/
        },
        modernizr: {
            'devFile': '<%= config.dev.assets %>/js/vendor/lib/modernizr.min.js',
            'outputFile': '<%= config.build.assets %>/js/vendor/lib/modernizr.min.js',
            'matchCommunityTests': true,
            'files': [
                '<%= uglify_files %>',
                '<%= config.build.assets %>/css/{,*/}*.css',
                '<%= config.dev.assets %>/js/vendor/*'
            ],
            'excludeFiles': [
                '<%= config.dev.assets %>/js/vendor/modernizr.min.js'
            ],
            'tests' : [],
        },
        joycss: {
            build: {
                options: {
                    layout: 'auto',
                    alpha: true
                },
                cwd: '<%= config.build.assets %>/css/',
                src: ['**'],
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
                    deleteAfterEncoding: true,
                    maxImageSize: 20480
                }
            }
        },
        svgmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dev.assets %>/svg',
                    src: ['**/*.svg'],
                    dest: '<%= config.build.assets %>/svg'
                }, {
                    expand: true,
                    cwd: '<%= config.dev.assets %>/font',
                    src: ['**/*.svg'],
                    dest: '<%= config.build.assets %>/font'
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
        useminPrepare: {
            options: {
                dest: '<%= config.build.path %>',
                root: '<%= config.dev.path %>'
            },
            html: '<%= config.build.path %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= config.dev.path %>'],
                dirs: ['<%= config.build.path %>']
            },
            html: ['<%= config.build.path %>/{,*/}*.html']
        },
        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeRedundantAttributes: false,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                expand: true,
                cwd: '<%= config.build.path %>',
                src: ['**/*.html'],
                dest: '<%= config.build.path %>'
            }
        },
        htmlcompressor: {
            build: {
                options: {
                    type: 'html',
                    preserveServerScript: true,
                    compressJs: true
                },
                expand: true,
                cwd: '<%= config.build.path %>',
                src: ['**/*.html'],
                dest: '<%= config.build.path %>'
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
            staging: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.dev.assets %>',
                    dest: '<%= config.staging.assets %>',
                    src: [
                        '*.{ico,png,txt,json}',
                        '.htaccess',
                        'img/**/*',
                        'swf/**/*',
                        'css/**/*',
                        'js/**/*',
                        'font/**/*'
                    ]
                }]
            },
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.dev.assets %>',
                    dest: '<%= config.build.assets %>',
                    src: [
                        '*.{ico,png,txt,json}',
                        '.htaccess',
                        'img/**/*',
                        'swf/**/*',
                        'css/**/*',
                        'font/**/*'
                    ]
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
            css: {
                files: [
                    '<%= config.dev.assets %>/less/**/*',
                    '<%= config.dev.assets %>/css/**/*',
                    '<%= config.dev.assets %>/img/**/*',
                    '<%= config.dev.assets %>/svg/**/*',
                    '<%= config.dev.assets %>/swf/**/*',
                ],
                tasks: ['concurrent:staging'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: [
                    '<%= config.dev.path %>/**/*.html',
                    '<%= config.dev.path %>/*.html'
                ],
                tasks: ['htmlbuild:staging'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        config.staging.path
                    ]
                }
            }
        },
        concurrent: {
            staging: [
                'less:staging',
                'copy:staging'
            ]
        }
    });

    grunt.registerTask('default', [
        'clean:staging',
        'concurrent:staging',
        'htmlbuild:staging',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:build',
        'copy:build',
        'svgmin',
        'less:build',
        'cmq',
        'joycss',
        'rename',
        'replace',
        'imageEmbed',
        'csso',
        'imagemin',
        'modernizr',
        'htmlbuild:build',
        'useminPrepare',
        'concat',
        'uglify',
        'usemin',
        'cachebreaker',
        'htmlmin',
        'htmlcompressor',
        'clean:joycss'
    ]);
};
