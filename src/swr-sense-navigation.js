/*global define*/
define( [
		'jquery',
		'underscore',
		'qlik',
		'angular',
		'core.utils/deferred',
		'./lib/external/sense-extension-utils/extUtils',
		'./properties',
		'./initialproperties',
		'text!./lib/css/main.css',
		'text!./template.ng.html'
	],
	function ( $, _, qlik, angular, Deferred, extUtils, props, initProps, cssContent, ngTemplate ) {
		'use strict';

		extUtils.addStyleToHeader( cssContent );
		var faUrl = extUtils.getBasePath() + '/extensions/swr-sense-navigation/lib/external/fontawesome/css/font-awesome.min.css';
		extUtils.addStyleLinkToHeader( faUrl, 'swr-sense-navigation__fontawesome' );

		// Helper function to split numbers.
		// function splitToStringNum ( str, sep ) {
		// 	var a = str.split( sep );
		// 	for ( var i = 0; i < a.length; i++ ) {
		// 		if ( !isNaN( a[i] ) ) {
		// 			a[i] = Number( a[i] );
		// 		}
		// 	}
		// 	return a;
		// }

		return {

			definition: props,
			support: {
				export: false,
				exportData: false,
				snapshot: false
			},
			initialProperties: initProps,
			snapshot: {canTakeSnapshot: false},
			template: ngTemplate,
			controller: ['$scope', '$element', function ( $scope, $element ) {

				// Note: getPreferredSize is an undocumented method and not supported right now.
				// this.getPreferredSize = function () {
				// 	var $btn = this.$element.find('.btn');
				// 	var size = {
				// 		w: $btn.width(),
				// 		h: $btn.height() + 7
				// 	};
				// 	var df = Deferred();
				// 		df.resolve( size );
				// 	return df.promise;
				// };
				

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
							const url = $scope.layout.props.websiteUrl;
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
				$scope.doAction = function (actionsbefore, index) {
					if ( !$scope.layout.props.isActionsBefore ) {
						return;
					}
					//
					const app = qlik.currApp();	
					const fld = $scope.layout.props['field' + index];
					const val = $scope.layout.props['value' + index];
					const softlock = $scope.layout.props['softlock' + index];
					//
					switch ( actionsbefore ) {
						case "clearAll":
							app.clearAll();
							break;
						case "lockAll":
							app.lockAll();
							break;
						case "unlockAll":
							app.unlockAll();
							break;
						case "clearField":
							if ( !_.isEmpty( fld ) ) {
								app.field( fld ).clear();
							}
							break;
						case "selectAlternative":
							if ( !_.isEmpty( fld ) ) {
								app.field( fld ).selectAlternative( softlock );
							}
							break;
						case "selectExcluded":
							if ( !_.isEmpty( fld ) ) {
								app.field( fld ).selectExcluded( softlock );
							}
							break;
						case "selectField":
							if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
								app.field( fld ).selectMatch( val, true, false);
							}
							// console.log("selected");
							break;
						case "selectValues":
							if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
								app.field( fld ).selectValues(val.split(';').map(function(value) { return { qText: value }; }), true, false);
							}
							break;
						case "selectandLockField":
							if ( !_.isEmpty( fld ) && ( !_.isEmpty( val )) ) {
								app.field( fld ).selectMatch( val, true, false);
								app.field( fld ).lock();
							}
							break;
						case "lockField":
							if ( !_.isEmpty( fld ) ) {
								app.field( fld ).lock();
							}
							break;
						case "applyBookmark":
							if(!$scope.layout.props.byexpression && !_.isEmpty( $scope.layout.props['bookmark' + index] ))
								app.bookmark.apply( $scope.layout.props['bookmark' + index] );
							else {
								app.getList('BookmarkList', function ( items ) {
									for(let iBookmark=0; iBookmark < items.qBookmarkList.qItems.length; ++iBookmark) {
										if(items.qBookmarkList.qItems[iBookmark].qMeta.title === $scope.layout.props.bookmarkexpression)
											app.bookmark.apply( items.qBookmarkList.qItems[iBookmark].qInfo.qId);
									}
								});
							}
							break;
						case "setVariable":
							if ( !_.isEmpty( $scope.layout.props['variable' + index] ) ) {
								$scope.setVariableContent( $scope.layout.props['variable' + index], val );
							}
							break;
						default:
							break;
					}
				};

				$scope.go = function () {
					if ( !$scope.isEditMode() ) {
						$scope.doAction($scope.layout.props.actionBefore1, 1);
						setTimeout(function() {
							$scope.doAction($scope.layout.props.actionBefore2, 2);
						}, 1000);
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

	} );
