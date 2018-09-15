/* global define */
define([
  './lib/external/lodash/lodash.min',
  'qlik',
  './lib/js/helpers',
  'text!./lib/data/icons-fa.json',
  'text!./lib/data/icons-lui.json'
], function (__, qlik, utils, iconListFa, iconListLui) { // eslint-disable-line max-params

  // ****************************************************************************************
  // Helper Promises
  // ****************************************************************************************

  // Helper method to return a list of icons in a format that can be used by the
  // dropdown component.
  function getIcons(iconListRaw) {
    const iconList = JSON.parse(iconListRaw).icons;
    let propDef = [];

    iconList.forEach(function (icon) {
      propDef.push(
        {
          value: icon.id,
          label: icon.name
        }
      );
    });
    propDef = __.sortBy(propDef, function (item) {
      return item.label;
    });
    propDef.unshift({
      value: '',
      label: '>> No icon <<'
    });
    return propDef;
  }

  // ****************************************************************************************
  // Layout
  // ****************************************************************************************
  const buttonTheme = {
    type: 'string',
    component: 'dropdown',
    label: 'Button theme',
    ref: 'props.buttonTheme',
    options: [
      {
        value: 'bs3',
        label: 'Bootstrap v3'
      },
      {
        value: 'lui',
        label: 'Leonardo UI'
      },
      {
        value: 'by-expr',
        label: 'Custom (by expression)'
      },
      {
        value: 'by-css',
        label: 'Custom (by CSS)'
      }
    ],
    defaultValue: 'lui'
  };

  // Todo: Should be renamed to buttonStyleBs3
  const buttonStyleBs = {
    type: 'string',
    component: 'dropdown',
    ref: 'props.buttonStyleBs',
    label: 'Bootstrap v3 style',
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
    ],
    show: function (data) {
      return data.props.buttonTheme === 'bs3';
    }
  };

  const buttonStyleLui = {
    type: 'string',
    component: 'dropdown',
    ref: 'props.buttonStyleLui',
    label: 'Leonardo UI style',
    defaultValue: 'default',
    options: [
      {
        value: 'default',
        label: 'Default'
      },
      {
        value: 'toolbar',
        label: 'Toolbar'
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
      }
    ],
    show: function (data) {
      return data.props.buttonTheme === 'lui';
    }
  };

  const buttonStyleExpression = {
    ref: 'props.buttonStyleExpression',
    label: 'Expression to define the button style',
    type: 'string',
    expression: 'optional',
    defaultValue: '=\'lui-default\'',
    show: function (data) {
      return data.props.buttonTheme === 'by-expr';
    }
  };

  const helpButtonStyleExpression = {
    text: 'The expression has to return one of the following values: bs3-default, bs3-primary, bs3-success, bs3-info, bs3-warning, bs3-danger, bs3-link, lui-default, lui-toolbar, lui-success, lui-info or lui-warning.',
    component: 'text',
    show: function (data) {
      return data.props.buttonTheme === 'by-expr';
    }
  };

  const buttonStyleCss = {
    ref: 'props.buttonStyleCss',
    label: 'Expression to define button\'s CSS',
    type: 'string',
    expression: 'optional',
    defaultValue: '=\'background-image: linear-gradient(to right, #FF512F 0%, #F09819 51%, #FF512F 100%)\'',
    show: function (data) {
      return data.props.buttonTheme === 'by-css';
    }
  };

  const buttonWidth = {
    type: 'boolean',
    component: 'buttongroup',
    label: 'Button width',
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

  // ****************************************************************************************
  // Icons
  // ****************************************************************************************

  const buttonShowIcon = {
    type: 'boolean',
    component: 'switch',
    label: 'Show icon',
    ref: 'props.buttonShowIcon',
    options: [
      {
        value: true,
        label: 'On'
      }, {
        value: false,
        label: 'Off'
      }
    ],
    defaultValue: false
  };

  const buttonIconSet = {
    type: 'string',
    component: 'dropdown',
    label: 'Icon set',
    ref: 'props.buttonIconSet',
    options: [
      {
        value: 'fa',
        label: 'Fontawesome Icons'
      }, {
        value: 'lui',
        label: 'Leonardo UI Icons'
      }
    ],
    defaultValue: 'fa',
    show: function (data) { /* eslint-disable-line object-shorthand */
      return data.props.buttonShowIcon === true;
    }
  };

  const buttonIconsFa = {
    type: 'string',
    component: 'dropdown',
    label: 'Icon (Fontawesome icon-set)',
    ref: 'props.buttonIconFa',
    options: function () {
      return getIcons(iconListFa);
    },
    show: function (data) { /* eslint-disable-line object-shorthand */
      return data.props.buttonShowIcon === true && data.props.buttonIconSet === 'fa';
    }
  };

  const buttonIconsLui = {
    type: 'string',
    component: 'dropdown',
    label: 'Icon (Leonardo UI icon-set)',
    ref: 'props.buttonIconLui',
    options: function () {
      return getIcons(iconListLui);
    },
    show: function (data) { /* eslint-disable-line object-shorthand */
      return data.props.buttonShowIcon === true && data.props.buttonIconSet === 'lui';
    }
  };

  const buttonTextAlign = {
    ref: 'props.buttonTextAlign',
    label: 'Label alignment',
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

  // ****************************************************************************************
  // Position, size & alignment
  // ****************************************************************************************

  const buttonAlignment = {
    ref: 'props.buttonAlignment',
    type: 'string',
    component: 'dropdown',
    label: 'Button position',
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
    label: 'Multiline label',
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
    label: 'Navigation action',
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
    ]
  };

  const sheetId = {
    ref: 'props.sheetId',
    label: 'Sheet Id',
    type: 'string',
    expression: 'optional',
    show: function (data) {
      return data.props.navigationAction === 'gotoSheetById';
    }
  };

  const appList = {
    type: 'string',
    component: 'dropdown',
    label: 'Select app',
    ref: 'props.selectedApp',
    options: utils.getAppList(),
    show: function (data) {
      return data.props.navigationAction === 'openApp';
    }
  };

  const sheetList = {
    type: 'string',
    component: 'dropdown',
    label: 'Select sheet',
    ref: 'props.selectedSheet',
    options: utils.getPPList({listType: 'sheet', sortBy: 'title'}),
    show: function (data) {
      return data.props.navigationAction === 'gotoSheet';
    }
  };

  const storyList = {
    type: 'string',
    component: 'dropdown',
    label: 'Select story',
    ref: 'props.selectedStory',
    options: utils.getPPList({listType: 'story', sortBy: 'title'}),
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
  // Action Options
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

  const actionsList = {
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
        options: utils.getBookmarkList({}),
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
          return utils.getFieldList().then(function (fieldList) {
            fieldList.splice(0, 0, {
              value: 'by-expr',
              label: '>> Define field by expression <<'
            });
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
      variable: {
        type: 'string',
        ref: 'variable',
        label: 'Variable name',
        expression: 'optional',
        show: function (data, defs) {
          const def = __.find(defs.layout.props.actionItems, {cId: data.cId});
          return def && variableEnabler.indexOf(def.actionType) > -1;
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
  const sectionAppearance = {
    uses: 'settings',
    items: {
      general: {
        items: {
          showTitles: {
            defaultValue: false
          }
        }
      }
    }
  };

  const sectionButtonLayout = {
    type: 'items',
    component: 'expandable-items',
    label: 'Button layout',
    items: {
      label: {
        type: 'items',
        label: 'Label',
        items: {
          buttonLabel: buttonLabel
        }
      },
      style: {
        type: 'items',
        label: 'Style',
        items: {
          buttonTheme: buttonTheme,
          buttonStyleBs: buttonStyleBs,
          buttonStyleLui: buttonStyleLui,
          buttonStyleExpression: buttonStyleExpression,
          helpButtonStyleExprBs: helpButtonStyleExpression,
          buttonStyleCss: buttonStyleCss
        }
      },
      icons: {
        type: 'items',
        label: 'Icon',
        items: {
          buttonShowIcon: buttonShowIcon,
          buttonIconTheme: buttonIconSet,
          buttonIconsFa: buttonIconsFa,
          buttonIconsLui: buttonIconsLui
        }
      },
      alignment: {
        type: 'items',
        label: 'Size & alignment',
        items: {
          buttonWidth: buttonWidth,
          buttonAlignment: buttonAlignment,
          buttonTextAlign: buttonTextAlign,
          buttonMultiLine: buttonMultiLine
        }
      }
    }
  };

  const sectionNavigationAndActions = {
    type: 'items',
    component: 'expandable-items',
    label: 'Navigation & actions',
    items: {
      actionsList: actionsList,
      navigationBehavior: {
        type: 'items',
        label: 'Navigation behavior',
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
  //   But seems to work well and using it is of low risk.
  const sectionAddOns = {
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

  // Const sectionAbout = {
  //   type: 'items',
  //   component: 'expandable-items',
  //   label: 'About',
  //   items: {
  //     about: {
  //       label: 'About this extension',
  //       items: {
  //         one: {
  //           label: 'sense-navigation brings the support to extend your Qlik Sense app with various navigation options (including actions).',
  //           component: 'text'
  //         },
  //         two: {
  //           label: 'For further information go here:',
  //           component: 'text'
  //         },
  //         three: {
  //           url: 'https://github.com/stefanwalther/sense-navigation',
  //           label: 'Documentation & Source',
  //           component: 'link'
  //         },
  //         four: {
  //           label: 'Current version: @@pkg.version',
  //           component: 'text'
  //         }
  //       }
  //     }
  //   }
  // };

  // ****************************************************************************************
  // Return Values
  // ****************************************************************************************
  return {
    type: 'items',
    component: 'accordion',
    items: {
      sectionAppearance: sectionAppearance,
      sectionButtonLayout: sectionButtonLayout,
      sectionNavigationAndActions: sectionNavigationAndActions,
      sectionAddOns: sectionAddOns
      // SectionAbout: sectionAbout
    },
    __test_only__: {
      getIcons: getIcons
    }
  };
});
