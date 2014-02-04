'use strict';

module.exports = function(grunt) {
    var scaffold = {
        dev: {
            path: 'dev',
            assets: 'dev/assets',
            partials: 'dev/partials',
            templates: 'dev/templates'
        },
        staging: {
            path: 'staging',
            assets: 'staging/assets'
        },
        build: {
            path: 'build',
            assets: 'build/assets'
        }
    };

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('assemble');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        scaffold: scaffold,
        timestamp: '<%= new Date().getTime() %>',
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
            'devFile': '<%= scaffold.dev.assets %>/js/vendor/lib/modernizr.js',
            'outputFile': '<%= scaffold.build.assets %>/js/vendor/lib/modernizr.js',
            'matchCommunityTests': true,
            'files': [
                '<%= scaffold.build.assets %>/css/{,*/}*.css',
                '<%= scaffold.dev.assets %>/js/**/*'
            ],
            'excludeFiles': [
                '<%= scaffold.dev.assets %>/js/vendor/modernizr.js'
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
            sprites: {
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
                    to: 'main-sprite.png?' + '<%= timestamp %>'
                }]
            },
            joycss: {
                src: ['<%= scaffold.build.assets %>/css/*.css'],
                overwrite: true,
                replacements: [{
                    from: '?esc)',
                    to: '?<%= timestamp %>)'
                }]
            },
            hashmap: {
                src: ['.tmp/hashmap.json'],
                overwrite: true,
                replacements: [{
                    from: 'build/',
                    to: 'dev/'
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
                expand: true,
                cwd: '<%= scaffold.build.assets %>/css',
                src: '{,*/}*.css',
                dest: '<%= scaffold.build.assets %>/css',
                options: {
                    deleteAfterEncoding: true,
                    maxImageSize: 20480
                }
            }
        },
        svgmin: {
            build: {
                files: [{
                    dot: true,
                    expand: true,
                    cwd: '<%= scaffold.dev.assets %>',
                    dest: '<%= scaffold.build.assets %>',
                    src: ['**/*.svg']
                }]
            }
        },
        assemble: {
            options: {
                layoutdir: '<%= scaffold.dev.templates %>',
                layoutext: '.html',
                layout: 'default',
                partials: ['<%= scaffold.dev.partials %>/**/*.html'],
                flatten: true
            },
            staging: {
                expand: true,
                cwd: '<%= scaffold.dev.path %>',
                dest: '<%= scaffold.staging.path %>',
                src: [
                    '**/*.html',
                    '!templates/**/*',
                    '!partials/**/*'
                ]
            },
            build: {
                expand: true,
                cwd: '<%= scaffold.dev.path %>',
                dest: '<%= scaffold.build.path %>',
                src: [
                    '**/*.html',
                    '!templates/**/*',
                    '!partials/**/*'
                ]
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= scaffold.build.path %>',
                root: '<%= scaffold.dev.path %>',
                flow: {
                    steps: {
                        'js': ['concat', 'uglifyjs'],
                        'css': ['concat']
                    },
                    post: []
                }
            },
            html: '<%= scaffold.build.path %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= scaffold.dev.path %>'],
                dirs: ['<%= scaffold.build.path %>'],
                revmap: '.tmp/hashmap.json'
            },
            html: [
                '<%= scaffold.build.path %>/**/*.html',
                '!<%= scaffold.build.path %>/templates/**/*',
                '!<%= scaffold.build.path %>/partials/**/*'
            ]
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
        htmlhint: {
            build: {
                options: {
                    htmlhintrc: '.htmlhintrc',
                    force: true
                },
                src: ['<%= scaffold.staging.path %>/**/*.html']
            }
        },
        cmq: {
            build: {
                options: {
                    log: 'true'
                },
                files: {
                    '<%= scaffold.build.assets %>/css/': ['<%= scaffold.build.assets %>/css/**/*.css']
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
        hash: {
            options: {
                mapping: '.tmp/hashmap.json',
                srcBasePath: '',
                destBasePath: '<%= scaffold.build.path %>/',
                flatten: false
            },
            js: {
                src: [
                    '<%= scaffold.build.assets %>/**/*.js'
                ],
            },
            css: {
                src: [
                    '<%= scaffold.build.assets %>/**/*.css'
                ],
            }
        },
        copy: {
            staging: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= scaffold.dev.path %>',
                    dest: '<%= scaffold.staging.path %>',
                    src: [
                        '*.{ico,png,gif,txt,json}',
                        '.htaccess',
                        'assets/**/*',
                        '!assets/**/*.{gitignore,svn,DS_Store}',
                        '!assets/{less,coffee,resources}/**'
                    ]
                }]
            },
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= scaffold.dev.path %>',
                    dest: '<%= scaffold.build.path %>',
                    src: [
                        '*.{ico,png,gif,txt,json}',
                        '.htaccess',
                        'assets/**/*',
                        '!assets/**/*.{gitignore,svn,DS_Store}',
                        '!assets/{less,coffee,resources}/**'
                    ]
                }]
            }
        },
        watch: {
            scripts: {
                files: [
                    '<%= scaffold.dev.assets %>/js/**/*.js'
                ],
                tasks: ['jshint', 'concat'],
                options: {
                    livereload: true
                }
            },
            stylesheets: {
                files: [
                    '<%= scaffold.dev.assets %>/less/**/*',
                    '<%= scaffold.dev.assets %>/css/**/*'
                ],
                tasks: ['less:staging', 'copy:staging'],
                options: {
                    livereload: true
                }
            },
            files: {
                files: [
                    '<%= scaffold.dev.assets %>/**/*',
                    '!<%= scaffold.dev.assets %>/less/**/*',

                ],
                tasks: ['copy:staging'],
                options: {
                    livereload: true
                }
            },
            pages: {
                files: [
                    '<%= scaffold.dev.path %>/**/*.html',
                    '<%= scaffold.dev.path %>/*.html'
                ],
                tasks: ['assemble:staging', 'htmlhint'],
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
        },
        favicons: {
            options: {
                trueColor: true,
                precomposed: true,
                appleTouchBackgroundColor: "#ffffff",
                coast: true,
                windowsTile: true,
                tileBlackWhite: false,
                tileColor: "auto",
                html: '<%= scaffold.dev.templates %>/default.html',
                HTMLPrefix: ""
            },
            icons: {
                src: '<%= scaffold.dev.path %>/assets/img/favicon.png',
                dest: '<%= scaffold.staging.path %>'
            }
        }
    });

    grunt.registerTask('default', [
        'clean:staging',
        'copy:staging',
        'less:staging',
        'assemble:staging',
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
        'replace:sprite',
        'replace:joycss',
        'imageEmbed',
        'csso',
        'imagemin',
        'modernizr',
        'assemble:build',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'hash',
        'replace:hashmap',
        'usemin',
        'htmlmin',
        'htmlcompressor',
        'clean:joycss',
        'clean:tmp',
        'compress'
    ]);
};
