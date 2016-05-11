/*global define*/
define( [
		'jquery',
		'underscore',
		'qlik',
		'angular',
		'./lib/external/sense-extension-utils/extUtils',
		'./properties',
		'./initialproperties',
		'text!./lib/css/main.css',
		'text!./template.ng.html'
	],
	function ( $, _, qlik, angular, extUtils, props, initProps, cssContent, ngTemplate ) {
		'use strict';
		

		extUtils.addStyleToHeader( cssContent );
		var faUrl = extUtils.getBasePath() + '/extensions/swr-sense-navigation/lib/external/fontawesome/css/font-awesome.min.css';
		extUtils.addStyleLinkToHeader( faUrl, 'swr-sense-navigation__fontawesome' );
		
		return {

			definition: props,
			initialProperties: initProps,
			snapshot: {canTakeSnapshot: false},
			template: ngTemplate,
			getPreferredSize: function () {
				console.log( 'getPreferredSize' , this);
			},
			controller: ['$scope', function ( $scope ) {

				$scope.alignmentStyle = '{text-align: ' + $scope.align + ';}';
				$scope.doNavigate = function () {

					switch ( $scope.layout.props.action ) {
						case "nextSheet":
							$scope.nextSheet();
							break;
						case "prevSheet":
							$scope.prevSheet();
							break;
						case "gotoSheet":
							$scope.gotoSheet( $scope.layout.props.selectedSheet );
							break;
						case "gotoSheetById":
							$scope.gotoSheet( $scope.layout.props.sheetId );
							break;
						case "gotoStory":
							$scope.gotoStory( $scope.layout.props.selectedStory );
							break;
						case "openWebsite":
							var url = $scope.layout.props.websiteUrl;
							console.log( url );
							if ( !_.isEmpty( url ) ) {
								if ( url.startsWith( 'http://' ) || url.startsWith( 'https://' ) ) {
									window.open( url );
								} else {
									window.open( 'http://' + url );
								}
							}
							break;
						default:
							break;
					}
				};

				$scope.isEditMode = function () {
					return $scope.$parent.$parent.editmode;
				};
				$scope.doAction = function () {

					if ( !$scope.layout.props.isActionsBefore ) {
						return;
					}

					var app = qlik.currApp();

					var fld = null;
					var val = null;

					for ( var i = 1; i <= 2; i++ ) {

						fld = $scope.layout.props['field' + i];
						val = $scope.layout.props['value' + i];

						switch ( $scope.layout.props['actionBefore' + i] ) {
							case "clearAll":
								app.clearAll();
								break;
							case "unlockAll":
								app.unlockAll();
								break;
							case "clearField":
								if ( !_.isEmpty( fld ) ) {
									app.field( fld ).clear();
								}
								break;
							case "selectField":
								if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
									app.field( fld ).selectMatch( val, false );
								}
								break;
							case "selectValues":
								if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
									var vals = val.split( ';' );
									console.log( 'vals', vals );
									app.field( fld ).selectValues( vals, false );
								}
								break;
							case "selectandLockField":
								if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
									app.field( fld ).selectMatch( val, true );
									app.field( fld ).lock()
								}
								break;
							case "lockField":
								if ( !_.isEmpty( fld ) ) {
									app.field( fld ).lock()
								}
								break;
							case "applyBookmark":
								if ( !_.isEmpty( $scope.layout.props['bookmark' + i] ) ) {
									app.bookmark.apply( $scope.layout.props['bookmark' + i] );
								}
								break;
							case "setVariable":
								if ( !_.isEmpty( $scope.layout.props['variable' + i] ) ) {
									$scope.setVariableContent( $scope.layout.props['variable' + i], val );
								}
								break;
							default:
								break;
						}
					}

				};

				$scope.go = function () {
					if ( !$scope.isEditMode() ) {
						$scope.doAction();
						$scope.doNavigate();
					}
				};

				$scope.nextSheet = function () {
					if ( $scope.checkQlikNavigation() ) {
						qlik.navigation.nextSheet();
					}
				};

				$scope.prevSheet = function () {
					if ( $scope.checkQlikNavigation() ) {
						qlik.navigation.prevSheet();
					}
				};

				$scope.gotoSheet = function ( sheetId ) {
					if ( $scope.checkQlikNavigation() && !_.isEmpty( sheetId ) ) {
						qlik.navigation.gotoSheet( sheetId );
					}
				};

				$scope.gotoStory = function ( storyId ) {
					if ( $scope.checkQlikNavigation() && !_.isEmpty( storyId ) ) {
						qlik.navigation.gotoStory( storyId );
					}
				};

				$scope.setVariableContent = function ( variableName, variableValue ) {
					var app = qlik.currApp();
					app.variable.setContent( variableName, variableValue )
						.then( function ( /*reply*/ ) {
							angular.noop();
						} );
				};

				$scope.checkQlikNavigation = function () {
					if ( !qlik.navigation ) {
						window.console.error( 'Capability API qlik.navigation is not supported in the current version of Qlik Sense' );
						return false;
					}
					return true;
				}

			}]
		};

	} )
;
