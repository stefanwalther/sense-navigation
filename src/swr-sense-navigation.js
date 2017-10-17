/*global define*/
define( [
		'qlik',
		'angular',
		'core.utils/deferred',
		'./lib/external/sense-extension-utils/extUtils',
		'./properties',
		'./initialproperties',
		'text!./lib/css/main.css',
		'text!./template.ng.html'
	],
	function (qlik, angular, Deferred, extUtils, props, initProps, cssContent, ngTemplate ) {
		'use strict';

		extUtils.addStyleToHeader( cssContent );
		var faUrl = extUtils.getBasePath() + '/extensions/swr-sense-navigation/lib/external/fontawesome/css/font-awesome.min.css';
		extUtils.addStyleLinkToHeader( faUrl, 'swr-sense-navigation__fontawesome' );

		// Helper function to split numbers.
		function splitToStringNum ( str, sep ) {
			var a = str.split( sep );
			for ( var i = 0; i < a.length; i++ ) {
				if ( !isNaN( a[i] ) ) {
					a[i] = Number( a[i] );
				}
			}
			return a;
		}

		if (typeof String.prototype.isEmpty != 'function') {
			String.prototype.isEmpty = function(obj) {
				if (obj == null) return true
				return obj.length === 0
			}
		}

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
							var url = $scope.layout.props.websiteUrl;
							if ( !url.isEmpty() ) {
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
					var softlock = null;

					for ( var i = 1; i <= 2; i++ ) {

						fld = $scope.layout.props['field' + i];
						val = $scope.layout.props['value' + i];
						softlock = $scope.layout.props['softlock' + i];


						switch ( $scope.layout.props['actionBefore' + i] ) {
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
								if ( !fld.isEmpty() ) {
									app.field( fld ).clear();
								}
								break;
							case "selectAlternative":
								console.log('selectAlternative', fld, softlock);
								if ( !fld.isEmpty() ) {
									app.field( fld ).selectAlternative( softlock );
								}
								break;
							case "selectExcluded":
								console.log('selectExcluded', fld, softlock);
								if ( !fld.isEmpty() ) {
									app.field( fld ).selectExcluded( softlock );
								}
								break;
							case "selectField":
								if ( !fld.isEmpty() && ( !val.isEmpty()) ) {
									app.field( fld ).selectMatch( val, false );
								}
								break;
							case "selectValues":
								if ( !fld.isEmpty() && ( !val.isEmpty()) ) {
									var vals = splitToStringNum( val, ';' );
									app.field( fld ).selectValues( vals, false );
								}
								break;
							case "selectandLockField":
								if ( !fld.isEmpty() && ( !val.isEmpty()) ) {
									app.field( fld ).selectMatch( val, true );
									app.field( fld ).lock()
								}
								break;
							case "lockField":
								if ( !fld.isEmpty() ) {
									app.field( fld ).lock()
								}
								break;
							case "applyBookmark":
								if ( !$scope.layout.props['bookmark' + i].isEmpty() ) {
									app.bookmark.apply( $scope.layout.props['bookmark' + i] );
								}
								break;
							case "setVariable":
								if ( !$scope.layout.props['variable' + i].isEmpty() ) {
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
					if ( $scope.checkQlikNavigation() && !sheetId.isEmpty() ) {
						qlik.navigation.gotoSheet( sheetId );
					}
				};

				$scope.gotoStory = function ( storyId ) {
					if ( $scope.checkQlikNavigation() && !storyId.isEmpty() ) {
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
