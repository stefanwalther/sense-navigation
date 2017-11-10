/* global define,window */
define(
  [
    // Todo: Remove the jQuery dependency, not needed at all here ...
    'jquery',
    'qlik',
    'angular',
    './lib/external/sense-extension-utils/general-utils',
    './properties',
    'text!./template.ng.html',
    'css!./lib/css/main.min.css',
    'css!./lib/external/fontawesome/css/font-awesome.min.css'
  ],
  function ($, qlik, angular, generalUtils, props, ngTemplate) { // eslint-disable-line max-params
    'use strict';

    const DEBUG = true;

    // Helper function to split numbers.
    function splitToStringNum(str, sep) {
      const a = str.split(sep);
      for (let i = 0; i < a.length; i++) {
        if (!isNaN(a[i])) {
          a[i] = Number(a[i]);
        }
      }
      return a;
    }

    if (typeof String.prototype.isEmpty != 'function') {
      String.prototype.isEmpty = function() {
        if (this == null) return true
        return this.length === 0
      }
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
                const url = $scope.layout.props.websiteUrl;
                if (!url.isEmpty()) {
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
              case 'switchToEdit': // eslint-disable-line no-case-declarations
                const result = qlik.navigation.setMode(qlik.navigation.EDIT);
                if (!result.success) {
                  window.console.error(result.errorMsg);
                }
                break;
              default:
                break;
            }
          };

          $scope.isEditMode = function () {
            return qlik.navigation.getMode() === qlik.navigation.EDIT;
          };
          $scope.doAction = function () { // eslint-disable-line complexity

            const app = qlik.currApp(); // ARGHH: Why is this still sync instead of async

            let fld;
            let val;
            let actionType;
            let softLock;
            let bookmark;

            if ($scope.layout.props && $scope.layout.props.actionItems) {

              for (let i = 0; i < $scope.layout.props.actionItems.length; i++) {

                actionType = $scope.layout.props.actionItems[i].actionType;
                fld = $scope.layout.props.actionItems[i].selectedField.isEmpty() ? $scope.layout.props.actionItems[i].field : $scope.layout.props.actionItems[i].selectedField;
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
                    if (!bookmark.isEmpty()) {
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
                    if (!fld.isEmpty()) {
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
                    if (!fld.isEmpty()) {
                      app.field(fld).lock();
                    }
                    break;
                  case 'replaceBookmark':
                    if (!bookmark.isEmpty()) {
                      app.bookmark.apply(bookmark);
                    }
                    break;
                  case 'selectAll':
                    if (!fld.isEmpty()) {
                      app.field(fld).selectAll(softLock);
                    }
                    break;
                  case 'selectAlternative':
                    if (!fld.isEmpty()) {
                      app.field(fld).selectAlternative(softLock);
                    }
                    break;
                  case 'selectAndLockField':
                    if (!fld.isEmpty() && (!val.isEmpty())) {
                      app.field(fld).selectMatch(val, true);
                      app.field(fld).lock();
                    }
                    break;
                  case 'selectExcluded':
                    if (!fld.isEmpty()) {
                      app.field(fld).selectExcluded(softLock);
                    }
                    break;
                  case 'selectField':
                    if (!fld.isEmpty() && (!val.isEmpty())) {
                      app.field(fld).selectMatch(val, false);
                    }
                    break;
                  case 'selectValues':
                    if (!fld.isEmpty() && (!val.isEmpty())) {
                      let vals = splitToStringNum(val, ';');
                      app.field(fld).selectValues(vals, false);
                    }
                    break;
                  case 'selectPossible':
                    if (!fld.isEmpty()) {
                      app.field(fld).selectPossible(softLock);
                    }
                    break;
                  case 'setVariable':
                    if (!$scope.layout.props['variable' + i].isEmpty()) {
                      $scope.setVariableContent($scope.layout.props['variable' + i], val);
                    }
                    break;
                  case 'toggleSelect':
                    if (!fld.isEmpty() && (!val.isEmpty())) {
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
                    if (!fld.isEmpty()) {
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
            if ($scope.checkQlikNavigation() && !sheetId.isEmpty()) {
              var r = qlik.navigation.gotoSheet(sheetId);
              if (!r.success) {
                window.console.error(r.errorMsg);
              }
            }
          };

          $scope.gotoStory = function (storyId) {
            if ($scope.checkQlikNavigation() && !storyId.isEmpty()) {
              qlik.navigation.gotoStory(storyId);
            }
          };

          // Todo: Use method from sense-extension-utils/variable-utils.js
          $scope.setVariableContent = function (variableName, variableValue) {
            const app = qlik.currApp();
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
            const app = qlik.currApp();
            app.unlockAll();
            app.clearAll();
          };

        }
      ]
    };
  });
