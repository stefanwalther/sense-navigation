/* global define,window */
define(
  [
    './lib/external/lodash/lodash.min',
    'qlik',
    'angular',
    './lib/external/sense-extension-utils/index',
    './properties',
    './lib/js/helpers',
    'text!./template.ng.html',
    'css!./lib/css/main.min.css',
    'css!./lib/external/font-awesome/css/font-awesome.min.css'
  ],
  function (__, qlik, angular, extUtils, props, helpers, ngTemplate) { // eslint-disable-line max-params
    'use strict';

    const DEBUG = true;

    // Todo: Break out to lib/js/helpers
    // Helper function to split numbers.
    function splitToStringNum(str, sep) {
      let a = str.split(sep);
      for (let i = 0; i < a.length; i++) {
        if (!isNaN(a[i])) {
          a[i] = Number(a[i]);
        }
      }
      return a;
    }

    // Todo: Break out to lib/js/helpers
    function fixUrl(url) {
      if (url.startsWith('http://') || url.startsWith('https://') || (url.startsWith('mailto://'))) {
        return url;
      }
      return 'http://' + url;
    }

    // Todo: Break out to lib/js/helpers
    /**
     * Check if running in an iframe.
     *
     * Catching the error is necessary as browsers could block access to window.top due to the same-origin-policy.
     * (see same origin policy)
     *
     * @link https://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
     *
     * @returns {boolean}
     */
    function inIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }

    return {

      definition: props,
      support: {
        export: true,
        exportData: false,
        snapshot: false
      },
      initialProperties: {},
      snapshot: {canTakeSnapshot: false},
      template: ngTemplate,
      controller: [
        '$scope', '$element', function ($scope, $element) { // eslint-disable-line no-unused-vars

          const DELAY_ACTIONS = 100;

          $scope.doNavigate = function () {

            if (DEBUG) {
              window.console.group('DEBUG');
              window.console.log('navigationAction', $scope.layout.props.navigationAction);
              window.console.groupEnd();
            }

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
              case 'firstSheet':
                $scope.firstSheet();
                break;
              case 'nextSheet':
                $scope.nextSheet();
                break;
              case 'openWebsite': // eslint-disable-line no-case-declarations
                let url = $scope.layout.props.websiteUrl;
                const same = $scope.layout.props.sameWindow;
                if (!__.isEmpty(url)) {
                  const isIframe = inIframe();
                  let target = '';
                  if (same && isIframe) {
                    target = '_parent';
                  } else if (same) {
                    target = '_self';
                  }
                  window.open(fixUrl(url), target);
                }
                break;
              case 'prevSheet':
                $scope.prevSheet();
                break;
              case 'lastSheet':
                $scope.lastSheet();
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

          /**
           * Executes the actions
           *
           * @returns a promise
           */
          $scope.doAction = function () { // eslint-disable-line complexity

            const app = qlik.currApp(); // ARGHH: Why is this still sync instead of async

            if ($scope.layout.props && $scope.layout.props.actionItems) {

              let actionPromises = [];
              window.console.log('$scope', $scope);

              for (let i = 0; i < $scope.layout.props.actionItems.length; i++) {

                let actionType = $scope.layout.props.actionItems[i].actionType;
                let fld = (__.isEmpty($scope.layout.props.actionItems[i].selectedField) || $scope.layout.props.actionItems[i].selectedField === 'by-expr') ? $scope.layout.props.actionItems[i].field : $scope.layout.props.actionItems[i].selectedField;
                let val = $scope.layout.props.actionItems[i].value;
                let softLock = $scope.layout.props.actionItems[i].softLock;
                let bookmark = $scope.layout.props.actionItems[i].selectedBookmark;
                let variable = $scope.layout.props.actionItems[i].variable;

                let l = actionPromises.length;

                switch (actionType) {
                  case 'applyBookmark':
                    if (!__.isEmpty(bookmark)) {
                      actionPromises.push($scope.actions.applyBookmark.bind(this, bookmark));
                    }
                    break;
                  case 'back':
                    actionPromises.push($scope.actions.back.bind(this));
                    break;
                  case 'clearAll':
                    actionPromises.push($scope.actions.clearAll.bind(this));
                    break;
                  case 'clearField':
                    if (!__.isEmpty(fld)) {
                      actionPromises.push($scope.actions.clearField.bind(this, fld));
                    }
                    break;
                  case 'clearOther':
                    actionPromises.push($scope.actions.clearOther.bind(this, fld, softLock));
                    break;
                  case 'forward':
                    actionPromises.push($scope.actions.forward.bind(this));
                    break;
                  case 'lockAll':
                    actionPromises.push($scope.actions.lockAll.bind(this));
                    break;
                  case 'lockField':
                    if (!__.isEmpty(fld)) {
                      app.field(fld).lock();
                    }
                    break;
                  case 'replaceBookmark':
                    if (!__.isEmpty(bookmark)) {
                      app.bookmark.apply(bookmark);
                    }
                    break;
                  case 'selectAll':
                    if (!__.isEmpty(fld)) {
                      app.field(fld).selectAll(softLock);
                    }
                    break;
                  case 'selectAlternative':
                    if (!__.isEmpty(fld)) {
                      app.field(fld).selectAlternative(softLock);
                    }
                    break;
                  case 'selectAndLockField':
                    if (!__.isEmpty(fld) && (!__.isEmpty(val))) {
                      app.field(fld).selectMatch(val, true);
                      app.field(fld).lock();
                    }
                    break;
                  case 'selectExcluded':
                    if (!__.isEmpty(fld)) {
                      app.field(fld).selectExcluded(softLock);
                    }
                    break;
                  case 'selectField':
                    if (!__.isEmpty(fld) && (!__.isEmpty(val))) {
                      app.field(fld).selectMatch(val, false);
                    }
                    break;
                  case 'selectValues':
                    if (!__.isEmpty(fld) && (!__.isEmpty(val))) {
                      let vals = splitToStringNum(val, ';');
                      app.field(fld).selectValues(vals, false);
                    }
                    break;
                  case 'selectPossible':
                    if (!__.isEmpty(fld)) {
                      app.field(fld).selectPossible(softLock);
                    }
                    break;
                  case 'setVariable':
                    if (!__.isEmpty(variable)) {
                      $scope.setVariableContent(variable, val);
                    }
                    break;
                  case 'toggleSelect':
                    if (!__.isEmpty(fld) && (!__.isEmpty(val))) {
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
                    if (!__.isEmpty(fld)) {
                      app.field(fld).unlock();
                    }
                    break;
                  default:
                    break;
                }

                if (l < actionPromises.length) {
                  actionPromises.push($scope.actions.wait.bind(null, 100));
                }

                if (DEBUG) {
                  window.console.group('DEBUG');
                  window.console.log('actionItems', $scope.layout.props.actionItems);
                  window.console.log('actionType: ', actionType);
                  window.console.log('actionPromises', actionPromises);
                  window.console.log('fld: ', fld);
                  window.console.log('val: ', val);
                  window.console.groupEnd();
                }
              }

              window.console.log('actionPromises', actionPromises);

              const seed = qlik.Promise.resolve(null);
              return actionPromises.reduce(function (a, b) {
                return a.then(b);
              }, seed);

            }
          };

          // Todo: break out to utils
          // Helper function to be used in the template, defining the button class.
          $scope.getButtonClassesBs = function (props) {

            let classes = [];

            // Todo: needs to be changed
            // if (props.buttonStyleBs === 'by-expression') {
            //   classes.push('btn-' + props.buttonStyleExpression);
            // }

            // Todo: We can probably just omit this
            if (props.buttonStyleBs) {
              classes.push('btn-' + props.buttonStyleBs);
            } else {
              classes.push('btn-default');
            }

            // Width
            if (props.fullWidth) {
              classes.push('full-width');
            } else {
              classes.push('auto-width'); // Todo: in case of LUI we could/should use the block style buttons
            }

            // Multiline
            if (props.isButtonMultiLine) {
              classes.push('multiline');
            }

            return classes.join(' ');
          };

          $scope.getButtonClassesLui = function (props) {
            let classes = [];

            if (props.fullWidth) {
              classes.push('full-width');
            } else {
              classes.push('auto-width');
            }
            if (props.isButtonMultiLine) {
              classes.push('multiline');
            }
            return classes.join(' ');
          };

          $scope.getIconClasses = function (props) {
            console.log('props', props);
            let classes = [];
            switch (props.buttonIconSet) {
              case 'fa':
                classes.push('fa');
                classes.push('fa-' + props.buttonIconFa);
                break;
              case 'lui':
                classes.push('lui-icon');
                classes.push('lui-icon--small');
                classes.push('lui-icon--' + props.buttonIconLui);
                break;
              default:
                break;
            }
            return classes.join(' ');
          };

          $scope.getButtonCustomCss = function (props) {
            if (props.buttonStyle === 'by-css') {
              return props.buttonStyleCss;
            }
            return '';
          };

          $scope.go = function () {
            if (!$scope.isEditMode()) {
              $scope.doAction()
                .then(function () {
                  $scope.doNavigate();
                })
                .catch(function (err) {
                  window.console.error(err);
                });
            }
          };

          $scope.actions = {
            applyBookmark: function (bookmarkId) {
              let cApp = qlik.currApp();
              cApp.bookmark.apply(bookmarkId);
            },
            back: function () {
              let cApp = qlik.currApp();
              return cApp.back()
            },
            clearAll: function () {
              let cApp = qlik.currApp();
              return cApp.clearAll();
            },
            clearField: function (field) {
              let cApp = qlik.currApp();
              return cApp.field(field).clear();
            },
            clearOther: function (field, softLock) {
              let cApp = qlik.currApp();
              return cApp.field(field).clearOther(softLock);
            },
            forward: function () {
              let cApp = qlik.currApp();
              return cApp.forward();
            },
            lockAll: function () {
              let cApp = qlik.currApp();
              return cApp.lockAll();
            },
            wait: function (ms) {
              let waitMs = ms || DELAY_ACTIONS;
              console.log('wait for ', waitMs);
              return new qlik.Promise(function (resolve) {
                let wait = setTimeout(() => {
                  clearTimeout(wait);
                  resolve();
                }, waitMs);
              });
            }
          };

          $scope.firstSheet = function () {
            if ($scope.checkQlikNavigation()) {
              extUtils.getFirstSheet().then(function (result) {
                qlik.navigation.gotoSheet(result.id);
              });
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

          $scope.lastSheet = function () {
            if ($scope.checkQlikNavigation()) {
              extUtils.getLastSheet().then(function (result) {
                qlik.navigation.gotoSheet(result.id);
              });
            }
          };

          $scope.gotoSheet = function (sheetId) {
            if ($scope.checkQlikNavigation() && !__.isEmpty(sheetId)) {
              let r = qlik.navigation.gotoSheet(sheetId);
              if (!r.success) {
                window.console.error(r.errorMsg);
              }
            }
          };

          $scope.gotoStory = function (storyId) {
            if ($scope.checkQlikNavigation() && !__.isEmpty(storyId)) {
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
