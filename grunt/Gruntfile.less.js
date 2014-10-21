/*global module*/
module.exports = function ( grunt ) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-less');
    return {
        dev: {
            options: {
                compress: ('<%= projectConfig.dev.less.lessCompress%>' === 'true'),
                yuicompress: ('<%= projectConfig.dev.less.lessYuiCompress%>' === 'true'),
                optimization: parseInt('projectConfig.dev.less.lessOptimization'),
                cleancss: ('<%= projectConfig.dev.less.lessCleanCss%>' === 'true')
            },
            files: {
                "../dist/lib/css/style.css": "../src/lib/less/_root.less"
            }
        },
        release: {
            options: {
                compress: ('<%= projectConfig.release.less.lessCompress%>' === 'true'),
                yuicompress: ('<%= projectConfig.release.less.lessYuiCompress%>' === 'true'),
                optimization: parseInt('projectConfig.release.less.lessOptimization'),
                cleancss: ('<%= projectConfig.release.less.lessCleanCss%>' === 'true')
            },
            files: {
                "../dist/lib/css/style.css": "../src/lib/less/_root.less"
            }
        }
    };
};