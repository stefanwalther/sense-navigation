/*global module*/
/*jshint
 camelcase: false
 */
module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-uglify');
    return {

		// Changed to hardcoded
        options: {
            mangle: true,
			beautify: false,
			preserveComments: 'some',
            compress: {
                drop_console: true
            },
			maxLineLen: 800
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