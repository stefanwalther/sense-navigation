/*global    define,
 require,
 window,
 console,_
 */
/*jslint    devel:true,
 white: true
 */
define( [
		'jquery',
		'underscore',
		'qlik',
		'angular',
		'./sheetnavigation-properties',
		'./sheetnavigation-initialproperties',
		'text!./lib/css/style.css',
		'text!./lib/partials/sheetnavigation.ng.html',
		'client.utils/routing',
		'client.utils/state',
		'client.models/sheet'
	],
	function ( $, _, qlik, angular, props, initProps, cssContent, ngTemplate, Routing, State, SheetModel ) {
		'use strict';

		$( "<style>" ).html( cssContent ).appendTo( "head" );

		return {

			definition: props,
			initialProperties: initProps,
			snapshot: {canTakeSnapshot: true},
			template: ngTemplate,
			controller: ['$scope', function ( $scope ) {

				$scope.sheets;

				function getSheets ( $scope ) {
					SheetModel.getList().then( function ( list ) {
						list.getLayout().then( function ( layout ) {
							$scope.sheets = layout;
						} );
					} );
				}

				getSheets( $scope );

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
				$scope.go = function () {

					console.log('go', $scope );
					if ( !$scope.$parent.editmode ) {
						$scope.doAction();
						$scope.doNavigate();
					}

				};
				$scope.nextSheet = function () {
					var curSheetId = State.getModel().id;
					_.each( $scope.sheets, function ( elem, index, list ) {
						if ( elem.qInfo.qId === curSheetId ) {

							// Jump either to the next sheet or to the first one if the current sheet is the last one
							if ( index < list.length - 1 ) {
								return Routing.goToSheet( list[index + 1].qInfo.qId, Object.keys( State.States )[State.state] );
							} else {
								return Routing.goToSheet( list[0].qInfo.qId, Object.keys( State.States )[State.state] );
							}
						}

					} );
				};
				$scope.prevSheet = function () {
					var curSheetId = State.getModel().id;
					_.each( $scope.sheets, function ( elem, index, list ) {
						if ( elem.qInfo.qId === curSheetId ) {

							// Jump either to the next sheet or to the first one if the current sheet is the last one
							if ( index !== 0 ) {
								return Routing.goToSheet( list[index - 1].qInfo.qId, Object.keys( State.States )[State.state] );
							} else {
								return Routing.goToSheet( list[list.length - 1].qInfo.qId, Object.keys( State.States )[State.state] );
							}
						}

					} );
				};
				$scope.gotoSheet = function ( sheetId ) {
					Routing.goToSheet( sheetId, Object.keys( State.States )[State.state] );
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