/*global module*/
module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-replace');

    /**
     * Replace variables like the Urls for the help, the version, etc.
     */
    return {

        general: {
            options: {
                patterns: [
                    {
                        json: grunt.file.readYAML('gruntReplacements.yml')
                    }
                ]
            },
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['../dist/*.*', '!../dist/**/*.{png,gif,jpg,ico,psd}'],
                    dest: '../dist/'}
            ]
        },
        dev: {
            options: {
                patterns: [
                    {
                        json: grunt.file.readYAML('gruntReplacements_dev.yml')
                    }
                ]
            },
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['../dist/*.*'],
                    dest: '../dist/'}
            ]
        },
        release: {
            options: {
                patterns: [
                    {
                        json: grunt.file.readYAML('gruntReplacements_release.yml')
                    }
                ]
            },
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['../dist/*.*', '!../dist/**/*.{png,gif,jpg,ico,psd}'],
                    dest: '../dist/'}
            ]
        }
    };
};