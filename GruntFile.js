'use strict';

module.exports = function(grunt) {
    var scaffold = {
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
        scaffold: scaffold,
        banner: '/*! <%= pkg.projectName %> - v<%= pkg.version %> - by <%= pkg.developers %> - <%= grunt.template.today("dd/mm/yyyy") %> */\n',
        clean: {
            staging: [
                '<%= scaffold.staging.path %>/**/*',
                '!<%= scaffold.staging.path %>/**/.git',
                '!<%= scaffold.staging.path %>/**/.svn'
            ],
            build: [
                '<%= scaffold.build.path %>/**/*',
                '!<%= scaffold.build.path %>/**/.git',
                '!<%= scaffold.build.path %>/**/.svn'
            ],
            joycss: ['<%= scaffold.build.assets %>/css/main.min.joy'],
            tmp: [
                '.tmp',
                '.css'
            ]
        },
        less: {
            staging: {
                files: {
                    '<%= scaffold.staging.assets %>/css/main.min.css': '<%= scaffold.dev.assets %>/less/main.less'
                },
                options: {
                    yuicompress: false
                }
            },
            build: {
                files: {
                    '<%= scaffold.build.assets %>/css/main.min.css': '<%= scaffold.dev.assets %>/less/main.less'
                },
                options: {
                    yuicompress: false
                }
            }
        },
        cssmin: {
            options: {
                banner: '<%= banner %>',
                keepSpecialComments: 0,
                report: 'gzip'
            }
        },
        jshint: {
            files: [
                'Gruntfile.js',
                '<%= scaffold.dev.assets %>/js/{,*/}*.js',
                '!<%= scaffold.dev.assets %>/js/vendor/*'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: {
                    except: ['jQuery', 'Backbone']
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            }
        },
        modernizr: {
            'devFile': '<%= scaffold.dev.assets %>/js/vendor/lib/modernizr.min.js',
            'outputFile': '<%= scaffold.build.assets %>/js/vendor/lib/modernizr.min.js',
            'matchCommunityTests': true,
            'files': [
                '<%= scaffold.build.assets %>/css/{,*/}*.css',
                '<%= scaffold.dev.assets %>/js/**/*'
            ],
            'excludeFiles': [
                '<%= scaffold.dev.assets %>/js/vendor/modernizr.min.js'
            ],
            'tests' : [],
        },
        joycss: {
            build: {
                options: {
                    layout: 'auto',
                    alpha: true
                },
                cwd: '<%= scaffold.build.assets %>/css/',
                src: ['**'],
                dest: '<%= scaffold.build.assets %>/css/'
            }
        },
        rename: {
            main: {
                files: [{
                    src: ['<%= scaffold.build.assets %>/img/main.min-sprite.png'],
                    dest: '<%= scaffold.build.assets %>/img/main-sprite.png'
                }]
            }
        },
        replace: {
            sprite: {
                src: ['<%= scaffold.build.assets %>/css/*.css'],
                overwrite: true,
                replacements: [{
                    from: 'main.min-sprite.png',
                    to: 'main-sprite.png?' + '<%= new Date().getTime() %>'
                }]
            },
            escSprite: {
                src: ['<%= scaffold.build.assets %>/css/*.css'],
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
                cwd: '<%= scaffold.build.assets %>/img',
                src: '{,*/}*.{png,jpg,jpeg}',
                dest: '<%= scaffold.build.assets %>/img'
            }
        },
        imageEmbed: {
            build: {
                src: ['<%= scaffold.build.assets %>/css/main.min.css'],
                dest: '<%= scaffold.build.assets %>/css/main.min.css',
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
                    cwd: '<%= scaffold.dev.assets %>/svg',
                    src: ['**/*.svg'],
                    dest: '<%= scaffold.build.assets %>/svg'
                }, {
                    expand: true,
                    cwd: '<%= scaffold.dev.assets %>/font',
                    src: ['**/*.svg'],
                    dest: '<%= scaffold.build.assets %>/font'
                }]
            }
        },
        htmlbuild: {
            staging: {
                src: '<%= scaffold.dev.path %>/*.html',
                dest: '<%= scaffold.staging.path %>/',
                options: {
                    sections: {
                        header: '<%= scaffold.dev.partials %>/header.html',
                        footer: '<%= scaffold.dev.partials %>/footer.html'
                    }
                }
            },
            build: {
                src: '<%= scaffold.dev.path %>/*.html',
                dest: '<%= scaffold.build.path %>/',
                options: {
                    sections: {
                        header: '<%= scaffold.dev.partials %>/header.html',
                        footer: '<%= scaffold.dev.partials %>/footer.html'
                    }
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= scaffold.build.path %>',
                root: '<%= scaffold.dev.path %>'
            },
            html: '<%= scaffold.build.path %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= scaffold.dev.path %>'],
                dirs: ['<%= scaffold.build.path %>']
            },
            html: ['<%= scaffold.build.path %>/{,*/}*.html'],
            css: ['<%= scaffold.build.assets %>/css/{,*/}*.css']
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
                cwd: '<%= scaffold.build.path %>',
                src: ['**/*.html'],
                dest: '<%= scaffold.build.path %>'
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
                cwd: '<%= scaffold.build.path %>',
                src: ['**/*.html'],
                dest: '<%= scaffold.build.path %>'
            }
        },
        cmq: {
            build: {
                options: {
                    log: 'true'
                },
                files: {
                    '<%= scaffold.build.assets %>/css/': ['<%= scaffold.build.assets %>/css/*.css']
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
                    '<%= scaffold.build.assets %>/css/main.min.css': ['<%= scaffold.build.assets %>/css/main.min.css']
                }
            }
        },
        cachebreaker: {
            js: {
                'asset_url': 'assets/js/main.min.js',
                files: {
                    src: '<%= scaffold.build.path %>/*.html'
                }
            },
            css: {
                'asset_url': 'assets/css/main.min.css',
                files: {
                    src: '<%= scaffold.build.path %>/*.html'
                }
            }
        },
        copy: {
            staging: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= scaffold.dev.assets %>',
                    dest: '<%= scaffold.staging.assets %>',
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
                    cwd: '<%= scaffold.dev.assets %>',
                    dest: '<%= scaffold.build.assets %>',
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
                    '<%= scaffold.dev.assets %>/js/*.js',
                    '<%= scaffold.dev.assets %>/js/**/*.js'
                ],
                tasks: ['jshint', 'concat'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: [
                    '<%= scaffold.dev.assets %>/less/**/*',
                    '<%= scaffold.dev.assets %>/css/**/*',
                    '<%= scaffold.dev.assets %>/img/**/*',
                    '<%= scaffold.dev.assets %>/svg/**/*',
                    '<%= scaffold.dev.assets %>/swf/**/*',
                ],
                tasks: ['concurrent:staging'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: [
                    '<%= scaffold.dev.path %>/**/*.html',
                    '<%= scaffold.dev.path %>/*.html'
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
                        scaffold.staging.path
                    ]
                }
            }
        },
        concurrent: {
            staging: [
                'less:staging',
                'copy:staging'
            ]
        },
        compress: {
            build: {
                options: {
                    archive: '<%= pkg.name %>.zip',
                    mode: 'zip',
                    pretty: true,
                    level: 7
                },
                src: ['<%= scaffold.build.path %>/**'],
                dest: '/'
            }
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
        'cssmin',
        'usemin',
        'cachebreaker',
        'htmlmin',
        'htmlcompressor',
        'clean:joycss',
        'clean:tmp',
        'compress'
    ]);
};
