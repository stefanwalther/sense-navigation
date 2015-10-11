'use strict';
var gulp = require( 'gulp' );
var senseGo = require( 'sense-go' );
var path = require( 'path' );

var userConfig = senseGo.loadYml( path.join( __dirname, 'sense-go.yml' ) );
senseGo.init( gulp, userConfig, function () {
	gulp.task( 'all', gulp.series(
		'bump:patch',
		'build',
		'release',
		'git:add',
		'git:commit',
		'git:push',
		'npm:publish'
	) );
	gulp.task( 'watch:build', function () {
		gulp.watch(
			['./src/**/*.*'],
			{
				readDelay: 10,
				usePolling: true,
				interval: 50
			},
			gulp.series( 'build' ) );
	} );
} );
