/*global module*/
/*jshint
 camelcase: false
 */
module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-uglify');
    return {

        options: {
            mangle: ('<%= projectConfig.release.uglify.mangle%>' === 'true'),
            beautify: ('<%= projectConfig.release.uglify.beautify%>' === 'true'),
            preserveComments: ('<%= projectConfig.release.uglify.preserveComments%>' === 'true'),
            compress: {
                drop_console: ('<%= projectConfig.release.uglify.drop_console%>' === 'true')
            }
        },
        release: {
            files: [
                {
                    src: ['../dist/<%= projectConfig.general.ExtensionNameSafe%>-initialproperties.js'],
                    dest: '../dist/<%= projectConfig.general.ExtensionNameSafe%>-initialproperties.js'
                },
                {
                    src: ['../dist/<%= projectConfig.general.ExtensionNamespace %><%= projectConfig.general.ExtensionNameSafe%>.js'],
                    dest: '../dist/<%= projectConfig.general.ExtensionNamespace %><%= projectConfig.general.ExtensionNameSafe%>.js'
                },
                {
                    src: ['../dist/<%= projectConfig.general.ExtensionNameSafe%>-properties.js'],
                    dest: '../dist/<%= projectConfig.general.ExtensionNameSafe%>-properties.js'
                }
            ]
        }
    };
};