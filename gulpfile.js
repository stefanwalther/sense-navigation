'use strict';
var gulp = require('gulp');
var senseGo = require('sense-go');

var userConfig = {
	"packageName": "sense-sheet-navigation"
};

senseGo.init( gulp, userConfig,  function (  ) {
	gulp.task('all', gulp.series(
		'bump:patch',
		'build',
		'release',
		'git:add',
		'git:commit',
		'git:push'
		//'npm:publish'
	));
});
