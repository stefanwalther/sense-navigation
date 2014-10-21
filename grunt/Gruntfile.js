/*global module,define,require */
/*jshint
 camelcase: false
 */
var fs = require( "fs" );

module.exports = function (grunt) {

    grunt.option['debug'] = false;

    var cfg = {};
    // parse all configured tasks automatically:
    fs.readdirSync( "./" ).forEach( function ( file ) {
        if ( file.indexOf( "Gruntfile." ) === 0 && file !== "Gruntfile.js" ) {
            var name = file.split( "Gruntfile." )[1].split( ".js" )[0];
            cfg[name] = require( "./Gruntfile." + name )( grunt );

        }
    } );

    grunt.initConfig( cfg );


    grunt.registerTask('dev', [

        // Clean 'dist' and copy all relevant files to 'dist'
        'clean:empty_dist',
        'copy:copy_to_dist',

        // Replacements
        'replace:general',
        'replace:dev',

        // Less support: true
        'less:dev',

        // Cleanup
        'clean:devFiles',
        'cleanempty:all',


        // Deploy to Qlik Sense Desktop
        'clean:empty_desktop',
        'copy:copy_to_desktop',

        // Zip
        'compress:dev'



    ]);

    grunt.registerTask('release', [

        // Clean 'dist' and copy all relevant files to 'dist'
        'clean:empty_dist',
        'copy:copy_to_dist',

        // Replacements
        'replace:general',
        'replace:release',

        // Less support: true
        'less:release',

        // Cleanup
        'clean:devFiles',
        'cleanempty:all',

        // Optimization & Uglification
        'uglify:release',

        // Deploy to Qlik Sense Desktop
        'clean:empty_desktop',
        'copy:copy_to_desktop',

        // Zip
        'compress:release'


    ]);

    grunt.registerTask('source', [

        'compress:source'
    ]);


    // Pointer to dev task
    grunt.registerTask('default', 'dev');

};