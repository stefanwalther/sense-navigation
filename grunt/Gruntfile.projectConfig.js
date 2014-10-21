/*global module*/
module.exports = function ( grunt ) {
    'use strict';
    return grunt.file.readYAML('grunt-config.yml');
};