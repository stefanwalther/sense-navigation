/*global define*/
define( [
		'jquery',
		'underscore',
		'qlik',
		'angular',
		'./properties',
		'./initialproperties',
		'text!./lib/css/main.css',
		'text!./template.ng.html'
	],
	function ( $, _, qlik, angular, props, initProps, cssContent, ngTemplate ) {
		'use strict';

		$( "<style>" ).html( cssContent ).appendTo( "head" );

		return {

			definition: props,
			initialProperties: initProps,
			snapshot: {canTakeSnapshot: false},
			template: ngTemplate,
			controller: ['$scope', function ( $scope ) {

				$scope.alignmentStyle = '{text-align: ' + $scope.align + ';}';
				$scope.doNavigate = function () {
					switch ( $scope.layout.action ) {
						case "nextSheet":
							$scope.nextSheet();
							break;
						case "prevSheet":
							$scope.prevSheet();
							break;
						case "gotoSheet":
							if ( !_.isEmpty( $scope.layout.selectedSheet ) ) {
								$scope.gotoSheet( $scope.layout.selectedSheet );
							}
							break;
						case "gotoSheetById":
							if ( !_.isEmpty( $scope.layout.sheetId ) ) {
								$scope.gotoSheet( $scope.layout.sheetId );
							}
							break;
						case "gotoStory":
							if ( !_.isEmpty( $scope.layout.selectedStory ) ) {
								$scope.gotoStory( $scope.layout.selectedStory );
							}
							break;
						case "openWebsite":
							if ( !_.isEmpty( $scope.layout.websiteUrl ) ) {
								console.log( 'openWebsite: ', $scope.layout.websiteUrl );
							}
							break;
						default:
							break;
					}
				};
				$scope.doAction = function () {

					if ( !$scope.layout.isActionsBefore ) {
						return;
					}

					var app = qlik.currApp();

					switch ( $scope.layout.actionBefore1 ) {
						case "clearAll":
							app.clearAll();
							break;
						case "unlockAll":
							app.unlockAll();
							break;
						case "clearField":
							if ( !_.isEmpty( $scope.layout.field1 ) ) {
								app.field( $scope.layout.field1 ).clear();
							}
							break;
						case "selectField":
							if ( !_.isEmpty( $scope.layout.field1 ) && ( !_.isEmpty( $scope.layout.value1 )) ) {
								app.field( $scope.layout.field1 ).selectMatch( $scope.layout.value1, false );
							}
							break;
						case "applyBookmark":
							if ( !_.isEmpty( $scope.layout.bookmark1 ) ) {
								app.bookmark.apply( $scope.layout.bookmark1 );
							}
							break;
						case "setVariable":
							if ( !_.isEmpty( $scope.layout.variable1 ) ) {
								$scope.setVariableContent( $scope.layout.variable1, $scope.layout.value1 );
							}
							break;
						default:
							break;
					}

				};

				//Todo: Check the result
				$scope.go = function () {

					console.log( 'go', $scope );
					if ( !$scope.$parent.editmode ) {
						$scope.doAction();
						$scope.doNavigate();
					}

				};

				//Todo: Check the result
				$scope.nextSheet = function () {
					if ( qlik.navigation ) {
						qlik.navigation.nextSheet();
					}
				};

				//Todo: Check the result
				$scope.prevSheet = function () {
					if ( qlik.navigation ) {
						qlik.navigation.prevSheet();
					}
				};

				//Todo: Check the result
				$scope.gotoSheet = function ( sheetId ) {
					if ( qlik.navigation ) {
						qlik.navigation.gotoSheet( sheetId );
					}
				};

				$scope.gotoStory = function ( storyId ) {
					if ( qlik.navigation ) {
						qlik.navigation.gotoStory( storyId );
					}
				};

				$scope.setVariableContent = function ( variableName, variableValue ) {
					var app = qlik.currApp();
					app.variable.setContent( variableName, variableValue )
						.then( function ( reply ) {
							//console.log( 'variable.setContent', reply );
							angular.noop();
						} );
				};

			}]
		};

	} );
