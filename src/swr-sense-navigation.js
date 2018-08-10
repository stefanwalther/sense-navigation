/* global define,window */
define(
  [
    'qlik',
    './lib/js/helpers',
    './properties',
    'text!./template.ng.html',
    'css!./lib/css/main.min.css',
    'css!./lib/external/font-awesome/css/font-awesome.min.css'
  ],
  function (qlik, utils, props, ngTemplate) { // eslint-disable-line max-params
    'use strict';

    const DEBUG = true;

    /*
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
              case 'openWebsite':
                let url = $scope.layout.props.websiteUrl; // eslint-disable-line no-case-declarations
                const same = $scope.layout.props.sameWindow; // eslint-disable-line no-case-declarations
                if (!utils.isEmpty(url)) {
                  const isIframe = inIframe();
                  let target = '';
                  if (same && isIframe) {
                    target = '_parent';
                  } else if (same) {
                    target = '_self';
                  }
                  window.open(utils.fixUrl(url), target);
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
              case 'switchToEdit':
                const result = qlik.navigation.setMode(qlik.navigation.EDIT); // eslint-disable-line no-case-declarations
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

          /*
           * Executes the actions
           *
           * @returns a promise
           */
          $scope.doAction = function () { // eslint-disable-line complexity

            if ($scope.layout.props && $scope.layout.props.actionItems) {

              let actionPromises = [];
              window.console.log('$scope', $scope);

              for (let i = 0; i < $scope.layout.props.actionItems.length; i++) {

                let actionType = $scope.layout.props.actionItems[i].actionType;
                let fld = (utils.isEmpty($scope.layout.props.actionItems[i].selectedField) || $scope.layout.props.actionItems[i].selectedField === 'by-expr') ? $scope.layout.props.actionItems[i].field : $scope.layout.props.actionItems[i].selectedField;
                let val = $scope.layout.props.actionItems[i].value;
                let softLock = $scope.layout.props.actionItems[i].softLock;
                let bookmark = $scope.layout.props.actionItems[i].selectedBookmark;
                let variable = $scope.layout.props.actionItems[i].variable;

                let l = actionPromises.length;

                switch (actionType) {
                  case 'applyBookmark':
                    if (!utils.isEmpty(bookmark)) {
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
                    if (!utils.isEmpty(fld)) {
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
                    if (!utils.isEmpty(fld)) {
                      actionPromises.push($scope.actions.lockField.bind(this, fld));
                    }
                    break;
                  case 'selectAll':
                    if (!utils.isEmpty(fld)) {
                      actionPromises.push($scope.actions.selectAll.bind(this, fld, softLock));
                    }
                    break;
                  case 'selectAlternative':
                    if (!utils.isEmpty(fld)) {
                      actionPromises.push($scope.actions.selectAlternative.bind(this, fld, softLock));
                    }
                    break;
                  case 'selectAndLockField':
                    if (!utils.isEmpty(fld) && (!utils.isEmpty(val))) {
                      actionPromises.push($scope.actions.selectField.bind(this, fld, val));
                      actionPromises.push($scope.actions.wait.bind(null, 100));
                      actionPromises.push($scope.actions.lockField.bind(this, fld));
                    }
                    break;
                  case 'selectExcluded':
                    if (!utils.isEmpty(fld)) {
                      actionPromises.push($scope.actions.selectExcluded.bind(this, fld, softLock));
                    }
                    break;
                  case 'selectField':
                    if (!utils.isEmpty(fld) && (!utils.isEmpty(val))) {
                      actionPromises.push($scope.actions.selectField.bind(this, fld, val));
                    }
                    break;
                  case 'selectValues':
                    if (!utils.isEmpty(fld) && (!utils.isEmpty(val))) {
                      actionPromises.push($scope.actions.selectValues.bind(this, fld, val));
                    }
                    break;
                  case 'selectPossible':
                    if (!utils.isEmpty(fld)) {
                      actionPromises.push($scope.actions.selectPossible.bind(this, fld, softLock));
                    }
                    break;
                  case 'setVariable':
                    if (!utils.isEmpty(variable)) {
                      actionPromises.push($scope.actions.setVariableContent.bind(this, variable, val));
                    }
                    break;
                  case 'toggleSelect':
                    if (!utils.isEmpty(fld) && (!utils.isEmpty(val))) {
                      actionPromises.push($scope.actions.toggleSelect.bind(this, fld, val, softLock));
                    }
                    break;
                  case 'unlockAll':
                    actionPromises.push($scope.actions.unlockAll.bind(this));
                    break;
                  case 'unlockAllAndClearAll':
                    actionPromises.push($scope.actions.unlockAll.bind(this));
                    actionPromises.push($scope.actions.wait.bind(null, 100));
                    actionPromises.push($scope.actions.clearAll.bind(this));
                    break;
                  case 'unlockField':
                    if (!utils.isEmpty(fld)) {
                      actionPromises.push($scope.actions.unlockField.bind(this, fld));
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

          // Todo(refactor): break out to utils
          // Helper function to be used in the template, defining the button class.
          $scope.getButtonClassesBs3 = function (props) {

            let classes = [];

            classes.push('btn');
            classes.push('btn-sm');

            if (props.buttonTheme === 'by-expr') {
              classes.push('btn-' + props.buttonStyleExpression.substr(props.buttonStyleExpression.indexOf('-') + 1));
            } else if (props.buttonStyleBs) {
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

            classes.push('lui-button');

            if (props.buttonTheme === 'by-expr') {
              classes.push('lui-button--' + props.buttonStyleExpression.substr(props.buttonStyleExpression.indexOf('-') + 1));
            } else if (props.buttonStyleLui) {
              classes.push('lui-button--' + props.buttonStyleLui);
            } else {
              classes.push('lui-button--default');
            }

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

          $scope.getButtonTheme = function (props) {
            switch (props.buttonTheme) {
              case 'lui':
                return 'lui';
              case 'bs3':
                return 'bs3';
              case 'by-css':
                return 'by-css';
              case 'by-expr':
                return props.buttonStyleExpression.substr(0, props.buttonStyleExpression.indexOf('-'));
              default:
                return 'lui';
            }
          };

          $scope.getButtonCustomCss = function (props) {
            if (props.buttonStyle === 'by-css') {
              return props.buttonStyleCss;
            }
            return '';
          };

          $scope.getButtonClassesCustom = function (props) {
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
              return cApp.bookmark.apply(bookmarkId);
            },
            back: function () {
              let cApp = qlik.currApp();
              return cApp.back();
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
            lockField: function (field) {
              let cApp = qlik.currApp();
              return cApp.field(field).lock();
            },
            selectAll: function (field, softLock) {
              let cApp = qlik.currApp();
              return cApp.field(field).selectAll(softLock);
            },
            selectAlternative: function (field, softLock) {
              let cApp = qlik.currApp();
              return cApp.field(field).selectAlternative(softLock);
            },
            selectExcluded: function (field, softLock) {
              let cApp = qlik.currApp();
              return cApp.field(field).selectExcluded(softLock);
            },
            selectField: function (field, value) {
              let cApp = qlik.currApp();
              return cApp.field(field).selectMatch(value, false);
            },
            selectPossible: function (field, softLock) {
              let cApp = qlik.currApp();
              return cApp.field(field).selectPossible(softLock);
            },
            selectValues: function (field, values) {
              let cApp = qlik.currApp();
              let valsToSelect = utils.splitToStringNum(values, ';');
              return cApp.field(field).selectValues(valsToSelect, false);
            },
            setVariableContent: function (varName, varVal) {
              const cApp = qlik.currApp();
              return cApp.variable.setContent(varName, varVal);
            },
            toggleSelect: function (field, value, softLock) {
              let cApp = qlik.currApp();
              return cApp.field(field).toggleSelect(value, softLock);
            },
            unlockAll: function () {
              let cApp = qlik.currApp();
              return cApp.unlockAll();
            },
            unlockField: function (field) {
              let cApp = qlik.currApp();
              return cApp.field(field).unlock();
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

          // Todo(refactor): Move all stuff here, this is much cleaner
          $scope.navigationAction = {};

          $scope.firstSheet = function () {
            if ($scope.checkQlikNavigation()) {
              utils.getFirstSheet(qlik.currApp()).then(function (result) {
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
              utils.getLastSheet(qlik.currApp()).then(function (result) {
                qlik.navigation.gotoSheet(result.id);
              });
            }
          };

          $scope.gotoSheet = function (sheetId) {
            if ($scope.checkQlikNavigation() && !utils.isEmpty(sheetId)) {
              let r = qlik.navigation.gotoSheet(sheetId);
              if (!r.success) {
                window.console.error(r.errorMsg);
              }
            }
          };

          $scope.gotoStory = function (storyId) {
            if ($scope.checkQlikNavigation() && !utils.isEmpty(storyId)) {
              qlik.navigation.gotoStory(storyId);
            }
          };

          $scope.checkQlikNavigation = function () {
            if (!qlik.navigation) {
              window.console.error('Capability API qlik.navigation is not supported in the current version of Qlik Sense.');
              return false;
            }
            return true;
          };

        }
      ]
    };
  });
