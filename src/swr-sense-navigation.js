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
		var faUrl = '/extensions/swr-sense-navigation/lib/external/fontawesome/css/font-awesome.min.css';
		extUtils.addStyleLinkToHeader( faUrl, 'fontawesome' );

		return {

			definition: props,
			initialProperties: initProps,
			snapshot: {canTakeSnapshot: false},
			template: ngTemplate,
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
							if ( !_.isEmpty( $scope.layout.props.selectedSheet ) ) {
								$scope.gotoSheet( $scope.layout.props.selectedSheet );
							}
							break;
						case "gotoSheetById":
							if ( !_.isEmpty( $scope.layout.props.sheetId ) ) {
								$scope.gotoSheet( $scope.layout.props.sheetId );
							}
							break;
						case "gotoStory":
							if ( !_.isEmpty( $scope.layout.props.selectedStory ) ) {
								$scope.gotoStory( $scope.layout.props.selectedStory );
							}
							break;
						case "openWebsite":
							if ( !_.isEmpty( $scope.layout.props.websiteUrl ) ) {
								console.log( 'openWebsite: ', $scope.layout.props.websiteUrl );
							}
							break;
						default:
							break;
					}
				};
				$scope.doAction = function () {

					if ( !$scope.layout.props.isActionsBefore ) {
						return;
					}

					var app = qlik.currApp();

					switch ( $scope.layout.props.actionBefore1 ) {
						case "clearAll":
							app.clearAll();
							break;
						case "unlockAll":
							app.unlockAll();
							break;
						case "clearField":
							if ( !_.isEmpty( $scope.layout.props.field1 ) ) {
								app.field( $scope.layout.props.field1 ).clear();
							}
							break;
						case "selectField":
							if ( !_.isEmpty( $scope.layout.props.field1 ) && ( !_.isEmpty( $scope.layout.props.value1 )) ) {
								app.field( $scope.layout.props.field1 ).selectMatch( $scope.layout.props.value1, false );
							}
							break;
						case "applyBookmark":
							if ( !_.isEmpty( $scope.layout.props.bookmark1 ) ) {
								app.bookmark.apply( $scope.layout.props.bookmark1 );
							}
							break;
						case "setVariable":
							if ( !_.isEmpty( $scope.layout.props.variable1 ) ) {
								$scope.setVariableContent( $scope.layout.props.variable1, $scope.layout.props.value1 );
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
