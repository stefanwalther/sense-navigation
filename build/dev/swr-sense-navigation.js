/*!

* sense-navigation - Sense Sheet Navigation + Actions visualization extension for Qlik Sense.
* --
* @version v1.0.0-alpha
* @link https://github.com/stefanwalther/sense-navigation
* @author Stefan Walther
* @license MIT
*/

/* global define,window */
define(
  [
    // Todo: Remove the jQuery dependency, not needed at all here ...
    'jquery',
    'underscore',
    'qlik',
    'angular',
    './lib/external/sense-extension-utils/general-utils',
    './properties',
    'text!./template.ng.html',
    'css!./lib/css/main.min.css',
    'css!./lib/external/fontawesome/css/font-awesome.min.css'
  ],
  function ($, _, qlik, angular, generalUtils, props, ngTemplate) { // eslint-disable-line max-params
    'use strict';

    var DEBUG = true;

    // Helper function to split numbers.
    function splitToStringNum(str, sep) {
      var a = str.split(sep);
      for (var i = 0; i < a.length; i++) {
        if (!isNaN(a[i])) {
          a[i] = Number(a[i]);
        }
      }
      return a;
    }

    return {

      definition: props,
      support: {
        export: false,
        exportData: false,
        snapshot: false
      },
      initialProperties: {},
      snapshot: {canTakeSnapshot: false},
      template: ngTemplate,
      controller: [
        '$scope', '$element', function ($scope, $element) { // eslint-disable-line no-unused-vars

          // Note: getPreferredSize is an undocumented method and not supported right now.
          // (Therefore it is not used in this extension)

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

          $scope.doNavigate = function () {

            switch ($scope.layout.props.navigationAction) {
              case 'gotoSheet':
                $scope.gotoSheet($scope.layout.props.selectedSheet);
                break;
              case 'gotoSheetById':
                $scope.gotoSheet($scope.layout.props.sheetId);
                break;
              case 'gotoStory':
                $scope.gotoStory($scope.layout.props.selectedStory);
                break;
              case 'nextSheet':
                $scope.nextSheet();
                break;
              case 'openWebsite':
                var url = $scope.layout.props.websiteUrl;
                if (!_.isEmpty(url)) {
                  if (url.startsWith('http://') || url.startsWith('https://') || (url.startsWith('mailto://'))) {
                    window.open(url);
                  } else {
                    window.open('http://' + url);
                  }
                }
                break;
              case 'prevSheet':
                $scope.prevSheet();
                break;
              // eslint-disable capitalized-comments
              // case "openApp":
              // 	console.log('Open', $scope.layout.props.selectedApp);
              // 	qlik.openApp( $scope.layout.props.selectedApp );
              // 	break;
              // eslint-enable capitalized-comments
              case 'switchToEdit':
                var result = qlik.navigation.setMode(qlik.navigation.EDIT);
                if (!result.success) {
                  window.console.error(result.errorMsg);
                }
                break;
              default:
                break;
            }
          };

          // Note for the extension certification process:
          //   This is not supported, but there is no other way to fetch the state from the
          //   official APIs
          $scope.isEditMode = function () {
            return $scope.$parent.$parent.editmode;
          };
          $scope.doAction = function () {

            var app = qlik.currApp(); // ARGHH: Why is this still sync instead of async

            var fld;
            var val;
            var actionType;
            var softLock;
            var bookmark;

            if ($scope.layout.props && $scope.layout.props.actionItems) {

              for (var i = 0; i < $scope.layout.props.actionItems.length; i++) {

                actionType = $scope.layout.props.actionItems[i].actionType;
                fld = _.isEmpty($scope.layout.props.actionItems[i].selectedField) ? $scope.layout.props.actionItems[i].field : $scope.layout.props.actionItems[i].selectedField;
                val = $scope.layout.props.actionItems[i].value;
                softLock = $scope.layout.props.actionItems[i].softLock;
                bookmark = $scope.layout.props.actionItems[i].selectedBookmark;

                if (DEBUG) {
                  window.console.group('DEBUG');
                  window.console.log('actionItems', $scope.layout.props.actionItems);
                  window.console.log('actionType: ', actionType);
                  window.console.log('fld: ', fld);
                  window.console.groupEnd();
                }

                switch (actionType) {
                  case 'applyBookmark':
                    if (!_.isEmpty(bookmark)) {
                      app.bookmark.apply(bookmark);
                    }
                    break;
                  case 'back':
                    app.back().catch(function (err) {
                      window.console.error(err);
                    });
                    break;
                  case 'clearAll':
                    app.clearAll();
                    break;
                  case 'clearField':
                    if (!_.isEmpty(fld)) {
                      app.field(fld).clear();
                    }
                    break;
                  case 'clearOther':
                    app.field(fld).clearOther(softLock);
                    break;
                  case 'forward':
                    app.forward()
                      .catch(function (err) {
                        window.console.error(err);
                      });
                    break;
                  case 'lockAll':
                    app.lockAll();
                    break;
                  case 'lockField':
                    if (!_.isEmpty(fld)) {
                      app.field(fld).lock();
                    }
                    break;
                  case 'replaceBookmark':
                    if (!_.isEmpty(bookmark)) {
                      app.bookmark.apply(bookmark);
                    }
                    break;
                  case 'selectAll':
                    if (!_.isEmpty(fld)) {
                      app.field(fld).selectAll(softLock);
                    }
                    break;
                  case 'selectAlternative':
                    if (!_.isEmpty(fld)) {
                      app.field(fld).selectAlternative(softLock);
                    }
                    break;
                  case 'selectAndLockField':
                    if (!_.isEmpty(fld) && (!_.isEmpty(val))) {
                      app.field(fld).selectMatch(val, true);
                      app.field(fld).lock();
                    }
                    break;
                  case 'selectExcluded':
                    if (!_.isEmpty(fld)) {
                      app.field(fld).selectExcluded(softLock);
                    }
                    break;
                  case 'selectField':
                    if (!_.isEmpty(fld) && (!_.isEmpty(val))) {
                      app.field(fld).selectMatch(val, false);
                    }
                    break;
                  case 'selectValues':
                    if (!_.isEmpty(fld) && (!_.isEmpty(val))) {
                      var vals = splitToStringNum(val, ';');
                      app.field(fld).selectValues(vals, false);
                    }
                    break;
                  case 'selectPossible':
                    if (!_.isEmpty(fld)) {
                      app.field(fld).selectPossible(softLock);
                    }
                    break;
                  case 'setVariable':
                    if (!_.isEmpty($scope.layout.props['variable' + i])) {
                      $scope.setVariableContent($scope.layout.props['variable' + i], val);
                    }
                    break;
                  case 'toggleSelect':
                    if (!_.isEmpty(fld) && (!_.isEmpty(val))) {
                      app.field(fld).toggleSelect(val, softLock);
                    }
                    break;
                  case 'unlockAll':
                    app.unlockAll();
                    break;
                  case 'unlockAllAndClearAll':
                    $scope.unlockAllAndClearAll();
                    break;
                  case 'unlockField':
                    if (!_.isEmpty(fld)) {
                      app.field(fld).unlock();
                    }
                    break;
                  default:
                    break;
                }
              }
            }
          };

          $scope.go = function () {
            if (!$scope.isEditMode()) {
              $scope.doAction();
              $scope.doNavigate();
            }
          };

          $scope.nextSheet = function () {
            if ($scope.checkQlikNavigation()) {
              qlik.navigation.nextSheet();
            }
          };

          $scope.prevSheet = function () {
            if ($scope.checkQlikNavigation()) {
              qlik.navigation.prevSheet();
            }
          };

          $scope.gotoSheet = function (sheetId) {
            if ($scope.checkQlikNavigation() && !_.isEmpty(sheetId)) {
              var r = qlik.navigation.gotoSheet(sheetId);
              if (!r.success) {
                window.console.error(r.errorMsg);
              }
            }
          };

          $scope.gotoStory = function (storyId) {
            if ($scope.checkQlikNavigation() && !_.isEmpty(storyId)) {
              qlik.navigation.gotoStory(storyId);
            }
          };

          // Todo: Use method from sense-extension-utils/variable-utils.js
          $scope.setVariableContent = function (variableName, variableValue) {
            var app = qlik.currApp();
            app.variable.setContent(variableName, variableValue)
              .then(function (/* reply */) {
                angular.noop();
              })
              .catch(function (err) {
                window.console.error(err);
              });
          };

          $scope.checkQlikNavigation = function () {
            if (!qlik.navigation) {
              window.console.error('Capability API qlik.navigation is not supported in the current version of Qlik Sense.');
              return false;
            }
            return true;
          };

          $scope.unlockAllAndClearAll = function () {
            var app = qlik.currApp();
            app.unlockAll();
            app.clearAll();
          };

        }
      ]
    };
  });
