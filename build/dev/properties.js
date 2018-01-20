/*!

* sense-navigation - Sense Sheet Navigation + Actions visualization extension for Qlik Sense.
* --
* @version v1.0.0-rc1-07
* @link https://github.com/stefanwalther/sense-navigation
* @author Stefan Walther
* @license MIT
*/

/* global define */
define([
  'angular',
  './lib/external/lodash/lodash.min',
  'qlik',
  './lib/external/sense-extension-utils/index',
  'text!./lib/data/icons-fa.json'
], function (angular, __, qlik, extHelper, iconListRaw) { // eslint-disable-line max-params

  // const $injector = angular.injector(['ng']);
  // const $timeout = $injector.get('$timeout');

  // ****************************************************************************************
  // Helper Promises
  // ****************************************************************************************

  /**
   * Helper method to return a list of icons in a format that can be used by the
   * dropdown component.
   *
   * @returns {Array<value,label>}
   */
  function getIcons() {
    debugger
    const iconList = JSON.parse(iconListRaw).icons;
    const propDef = [];
    propDef.push({
      value: '',
      label: '>> No icon <<'
    });

    iconList.forEach(function (icon) {
      propDef.push(
        {
          value: icon.id,
          label: icon.name
        }
      );
    });
    // Can be replaced by iconList.sort
    return __.sortBy(propDef, function (item) {
      return item.label;
    });
  }

  // ****************************************************************************************
  // Layout
  // ****************************************************************************************
  const buttonStyle = {
    type: 'string',
    component: 'dropdown',
    ref: 'props.buttonStyle',
    label: 'Style',
    defaultValue: 'default',
    options: [
      {
        value: 'default',
        label: 'Default'
      },
      {
        value: 'primary',
        label: 'Primary'
      },
      {
        value: 'success',
        label: 'Success'
      },
      {
        value: 'info',
        label: 'Info'
      },
      {
        value: 'warning',
        label: 'Warning'
      },
      {
        value: 'danger',
        label: 'Danger'
      },
      {
        value: 'link',
        label: 'Link'
      }
    ]

  };

  const buttonWidth = {
    type: 'boolean',
    component: 'buttongroup',
    label: 'Button Width',
    ref: 'props.fullWidth',
    options: [
      {
        value: true,
        label: 'Full Width',
        tooltip: 'Button has the same width as the element.'
      },
      {
        value: false,
        label: 'Auto Width',
        tooltip: 'Auto width depending on the label defined.'
      }
    ],
    defaultValue: false
  };

  const buttonIcons = {
    type: 'string',
    component: 'dropdown',
    label: 'Icon',
    ref: 'props.buttonIcon',
    options: function () {
      return getIcons();
    }
  };

  const buttonTextAlign = {
    ref: 'props.buttonTextAlign',
    label: 'Label Alignment',
    type: 'string',
    component: 'dropdown',
    defaultValue: 'left',
    options: [
      {
        value: 'center',
        label: 'Center'
      },
      {
        value: 'left',
        label: 'Left'
      },
      {
        value: 'right',
        label: 'Right'
      }
    ],
    show: function (data) { /* eslint-disable-line object-shorthand */
      return data.props.fullWidth;
    }
  };

  const buttonAlignment = {
    ref: 'props.buttonAlignment',
    type: 'string',
    component: 'dropdown',
    defaultValue: 'top-left',
    options: [
      {
        label: 'Top left',
        value: 'top-left'
      },
      {
        label: 'Top middle',
        value: 'top-middle'
      },
      {
        label: 'Top right',
        value: 'top-right'
      },
      {
        label: 'Left middle',
        value: 'left-middle'
      },
      {
        label: 'Centered',
        value: 'centered'
      },
      {
        label: 'Right middle',
        value: 'right-middle'
      },
      {
        label: 'Bottom left',
        value: 'bottom-left'
      },
      {
        label: 'Bottom middle',
        value: 'bottom-middle'
      },
      {
        label: 'Bottom right',
        value: 'bottom-right'
      }
    ]
  };

  const buttonMultiLine = {
    ref: 'props.isButtonMultiLine',
    label: 'Multiline Label',
    type: 'boolean',
    defaultValue: false
  };

  const buttonLabel = {
    ref: 'props.buttonLabel',
    label: 'Label',
    type: 'string',
    expression: 'optional',
    show: function () {
      return true;
    },
    defaultValue: 'My Button'
  };

  // ****************************************************************************************
  // Navigation Action
  // ****************************************************************************************

  const navigationAction = {
    ref: 'props.navigationAction',
    label: 'Navigation Action',
    type: 'string',
    component: 'dropdown',
    default: 'nextSheet',
    options: [
      {
        label: 'None',
        value: 'none'
      },
      {
        label: 'Go to first sheet',
        value: 'firstSheet'
      },
      {
        label: 'Go to next sheet',
        value: 'nextSheet'
      },
      {
        label: 'Go to previous sheet',
        value: 'prevSheet'
      },
      {
        label: 'Go to last sheet',
        value: 'lastSheet'
      },
      {
        label: 'Go to a sheet',
        value: 'gotoSheet'
      },
      {
        label: 'Go to a sheet (defined by sheet Id)',
        value: 'gotoSheetById'
      },
      {
        label: 'Go to a story',
        value: 'gotoStory'
      },
      {
        label: 'Open a website / eMail',
        value: 'openWebsite'
      },
      {
        label: 'Switch to edit mode',
        value: 'switchToEdit'
      }
      // ,
      // {
      // 	label: "Open app",
      // 	value: "openApp"
      // }
    ]
  };

  const sheetId = {
    ref: 'props.sheetId',
    label: 'Sheet ID',
    type: 'string',
    expression: 'optional',
    show: function (data) {
      return data.props.navigationAction === 'gotoSheetById';
    }
  };

  const appList = {
    type: 'string',
    component: 'dropdown',
    label: 'Select App',
    ref: 'props.selectedApp',
    options: extHelper.getAppList(),
    show: function (data) {
      return data.props.navigationAction === 'openApp';
    }
  };

  const sheetList = {
    type: 'string',
    component: 'dropdown',
    label: 'Select Sheet',
    ref: 'props.selectedSheet',
    options: extHelper.getSheetList(),
    show: function (data) {
      return data.props.navigationAction === 'gotoSheet';
    }
  };

  const storyList = {
    type: 'string',
    component: 'dropdown',
    label: 'Select Story',
    ref: 'props.selectedStory',
    options: extHelper.getStoryList(),
    show: function (data) {
      return data.props.navigationAction === 'gotoStory';
    }
  };

  const websiteUrl = {
    ref: 'props.websiteUrl',
    label: 'Website Url:',
    type: 'string',
    expression: 'optional',
    show: function (data) {
      return data.props.navigationAction === 'openWebsite';
    }
  };

  const sameWindow = {
    ref: 'props.sameWindow',
    label: 'Open in same window',
    type: 'boolean',
    defaultValue: true,
    show: function (data) {
      return data.props.navigationAction === 'openWebsite';
    }
  };

  // ****************************************************************************************
  // Action-Group
  // ****************************************************************************************

  const actionOptions = [
    {
      value: 'applyBookmark',
      label: 'Apply a bookmark',
      group: 'bookmark'
    },
    {
      value: 'clearAll',
      label: 'Clear all selections',
      group: 'selection'
    },
    {
      value: 'clearOther',
      label: 'Clear selections in other fields',
      group: 'selection'
    },
    {
      value: 'forward',
      label: 'Move forwards (in your selections)',
      group: 'selection'
    },
    {
      value: 'back',
      label: 'Move backwards (in your selections)',
      group: 'selection'
    },
    {
      value: 'clearField',
      label: 'Clear selections in field',
      group: 'selection'
    },
    {
      value: 'lockAll',
      label: 'Lock all selections',
      group: 'selection'
    },
    {
      value: 'lockField',
      label: 'Lock a specific field',
      group: 'selection'
    },
    {
      value: 'unlockAll',
      label: 'Unlock all selections',
      group: 'selection'
    },
    {
      value: 'unlockField',
      label: 'Unlock a specific field',
      group: 'selection'
    },
    {
      value: 'unlockAllAndClearAll',
      label: 'Unlock all and clear all',
      group: 'selection'
    },
    {
      value: 'selectField',
      label: 'Select a value in a field',
      group: 'selection'
    },
    {
      value: 'selectAll',
      label: 'Select all values in a field',
      group: 'selection'
    },
    {
      value: 'selectValues',
      label: 'Select multiple values in a field',
      group: 'selection'
    },
    {
      value: 'selectAlternative',
      label: 'Select alternatives',
      group: 'selection'
    },
    {
      value: 'selectAndLockField',
      label: 'Select a value and lock field',
      group: 'selection'
    },
    {
      value: 'selectExcluded',
      label: 'Select excluded',
      group: 'selection'
    },
    {
      value: 'selectPossible',
      label: 'Select possible values in a field',
      group: 'selection'
    },
    {
      value: 'setVariable',
      label: 'Set variable value',
      group: 'variables'
    },
    {
      value: 'toggleSelect',
      label: 'Toggle field selection',
      group: 'selection'
    }
  ];

  // ****************************************************************************************
  // n-actions
  // ****************************************************************************************
  const bookmarkEnabler = ['applyBookmark'];
  const fieldEnabler = ['clearField', 'clearOther', 'lockField', 'selectAll', 'selectAlternative', 'selectExcluded', 'selectField', 'selectPossible', 'selectValues', 'selectAndLockField', 'toggleSelect', 'unlockField'];
  const valueEnabler = ['selectField', 'selectValues', 'setVariable', 'selectAndLockField', 'toggleSelect'];
  const valueDescEnabler = ['selectValues'];
  const variableEnabler = ['setVariable'];
  const overwriteLockedEnabler = ['clearOther', 'selectAll', 'selectAlternative', 'selectExcluded', 'selectPossible', 'toggleSelect'];

  // Just an idea for now:
  // const actionGroup = {
  //   ref: 'actionGroup',
  //   label: 'Selection Action Type',
  //   type: 'string',
  //   component: 'dropdown',
  //   defaultValue: 'selection',
  //   options: [
  //     {
  //       label: 'Selection',
  //       value: 'selection'
  //     },
  //     {
  //       label: 'Bookmark',
  //       value: 'bookmark'
  //     },
  //     {
  //       label: 'Variables',
  //       value: 'variables'
  //     }
  //   ]
  // };

  const actions = {
    type: 'array',
    ref: 'props.actionItems',
    label: 'Actions',
    itemTitleRef: function (data) {
      let v = __.filter(actionOptions, {value: data.actionType});
      return (v && v.length > 0) ? v[0].label : data.actionType;
    },
    allowAdd: true,
    allowRemove: true,
    addTranslation: 'Add Item',
    grouped: true,
    items: {
      // ActionGroup: actionGroup, // eslint-disable-line capitalized-comments
      actionType: {
        type: 'string',
        ref: 'actionType',
        component: 'dropdown',
        defaultValue: 'none',
        options: actionOptions
      },
      bookmarkList: {
        type: 'string',
        ref: 'selectedBookmark',
        component: 'dropdown',
        label: 'Select bookmark',
        expression: 'optional',
        options: extHelper.getBookmarkList(),
        show: function (data, defs) {
          const def = __.find(defs.layout.props.actionItems, {cId: data.cId});
          return def && bookmarkEnabler.indexOf(def.actionType) > -1;
        }
      },
      fieldList: {
        type: 'string',
        ref: 'selectedField',
        component: 'dropdown',
        label: 'Select field',
        defaultValue: '',
        options: function () {
          return extHelper.getFieldList().then(function (fieldList) {
            fieldList.splice(0, 0, {
              value: 'by-expr',
              label: '>> Define field by expression <<'
            });
            // Ugly workaround/fix for bug in Qlik Sense 2.1 - 3.1 that will cause
            // the loading of the field not to be finished
            // $timeout(function () {
            //   $('.cell').trigger('mouseover');
            // }, 0);
            return fieldList;
          });
        },
        show: function (data, defs) {
          const def = __.find(defs.layout.props.actionItems, {cId: data.cId});
          return def && fieldEnabler.indexOf(def.actionType) > -1;
        }
      },
      field: {
        type: 'string',
        ref: 'field',
        label: 'Field',
        expression: 'optional',
        show: function (data, defs) {
          const def = __.find(defs.layout.props.actionItems, {cId: data.cId});
          return def && fieldEnabler.indexOf(def.actionType) > -1 && def.selectedField === 'by-expr';
        }
      },
      value: {
        type: 'string',
        ref: 'value',
        label: 'Value',
        expression: 'optional',
        show: function (data, defs) {
          const def = __.find(defs.layout.props.actionItems, {cId: data.cId});
          return def && valueEnabler.indexOf(def.actionType) > -1;
        }
      },
      valueDesc: {
        type: 'text',
        component: 'text',
        ref: 'valueDesc',
        label: 'Define multiple values separated with a semi-colon (;).',
        show: function (data, defs) {
          const def = __.find(defs.layout.props.actionItems, {cId: data.cId});
          return def && valueDescEnabler.indexOf(def.actionType) > -1;
        }
      },
      variable: {
        type: 'string',
        ref: 'variable',
        label: 'Variable Name',
        expression: 'optional',
        show: function (data, defs) {
          const def = __.find(defs.layout.props.actionItems, {cId: data.cId});
          return def && variableEnabler.indexOf(def.actionType) > -1;
        }
      },
      overwriteLocked: {
        type: 'boolean',
        ref: 'softLock',
        label: 'Overwrite locked selections',
        defaultValue: false,
        show: function (data, defs) {
          const def = __.find(defs.layout.props.actionItems, {cId: data.cId});
          return def && overwriteLockedEnabler.indexOf(def.actionType) > -1;
        }
      }

    }
  };

  // ****************************************************************************************
  // Setup
  // ****************************************************************************************
  const appearanceSettings = {
    uses: 'settings',
    items: {
      general: {
        items: {
          showTitles: {
            defaultValue: false
          }
        }
      },
      layout: {
        type: 'items',
        label: 'Layout',
        items: {
          label: buttonLabel,
          style: buttonStyle,
          buttonWidth: buttonWidth,
          buttonAlignment: buttonAlignment,
          buttonTextAlign: buttonTextAlign,
          buttonMultiLine: buttonMultiLine,
          buttonIcons: buttonIcons
        }
      },
      actionsList: actions,
      behavior: {
        type: 'items',
        label: 'Navigation Behavior',
        items: {
          action: navigationAction,
          sheetId: sheetId,
          sheetList: sheetList,
          storyList: storyList,
          websiteUrl: websiteUrl,
          sameWindow: sameWindow,
          appList: appList
        }
      }
    }
  };

  // Note for the extension certification process:
  //   Using the calculation condition is not officially supported!
  const addons = {
    type: 'items',
    component: 'expandable-items',
    translation: 'properties.addons',
    items: {
      dataHandling: {
        uses: 'dataHandling',
        items: {
          suppressZero: null
        }
      }
    }
  };

  // ****************************************************************************************
  // Return Values
  // ****************************************************************************************
  return {
    type: 'items',
    component: 'accordion',
    items: {
      settings: appearanceSettings,
      addons: addons
    },
    __test_only__: {
      getIcons: getIcons
    }
  };
});
