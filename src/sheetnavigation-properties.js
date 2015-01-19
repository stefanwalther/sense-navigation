/*global define*/
define([
    'jquery',
    'underscore',
    'qlik'
], function ($, _, qlik) {

    var bookmarks = undefined;


    //var app = qlik.currApp();
    //console.log('qlik', qlik );
    ////console.log('qlik.global', qlik.getGlobal() );
    //console.log('app', qlik.currApp() );
    //console.log('app(this)', qlik.currApp(this) );

    // ****************************************************************************************
    // Layout
    // ****************************************************************************************
    var style = {
        type: "string",
        component: "dropdown",
        ref: "style",
        label: "Style",
        defaultValue: "default",
        options: [
            {
                value: "default",
                label: "Default"
            },
            {
                value: "primary",
                label: "Primary"
            },
            {
                value: "success",
                label: "Success"
            },
            {
                value: "info",
                label: "Info"
            },
            {
                value: "warning",
                label: "Warning"
            },
            {
                value: "danger",
                label: "Danger"
            },
            {
                value: "link",
                label: "Link"
            }
        ]

    };

    var buttonWidth =  {
        type: "string",
        component: "dropdown",
        ref: "buttonWidth",
        label: "Width",
        defaultValue: "default",
        options: [
            {
                value: "default",
                label: "Default (Dynamic)"
            },
            {
                value: "fullwidth",
                label: "Full Width"
            }
        ]
    };

    var align = {
        ref: "align",
        label: "Alignment",
        type: "string",
        component: "dropdown",
        defaultValue: "left",
        options: [
            {
                value: "center",
                label: "Center"
            },
            {
                value: "left",
                label: "Left"
            },
            {
                value: "right",
                label: "Right"
            }
        ]
    };

    var label = {
        ref: "label",
        label: "Label",
        type: "string",
        expression: "optional",
        show: function ( ) {
            return true;
        },
        defaultValue: "Your Label"
    };

    var sheetId = {
        ref: "sheetId",
        label: "Sheet ID:",
        type: "string",
        show: function ( data ) {
            return true;//data.action === 'gotoSheet';
        }
    };

    // ****************************************************************************************
    // Behavior
    // ****************************************************************************************
    var action = {
        ref: "action",
        label: "Action",
        type: "string",
        component: "dropdown",
        default: "nextSheet",
        options: [
            {
                value: "nextSheet",
                label: "Go to next sheet"
            },
            {
                value: "prevSheet",
                label: "Go to previous sheet"
            },
            {
                value: "gotoSheet",
                label: "Go to a specific sheet ..."
            }
        ]
    };

    // ****************************************************************************************
    // Actions
    // ****************************************************************************************
    var isActionsBefore = {
        type: "boolean",
        component: "switch",
        label: "Actions before navigating",
        ref: "isActionsBefore",
        defaultValue: false,
        options: [
            {
                value: true,
                label: "Enabled"
            },
            {
                value: false,
                label: "Disabled"
            }
        ]
    };

    var actionBefore = {
        type: "string",
        component: "dropdown",
        label: "First Action",
        ref: "actionBefore1",
        defaultValue: "none",
        show: function ( data ) {
            return true;//data.isActionsBefore;
        },
        options: [
            {
                value: "none",
                label: "None"
            },
            {
                value: "clearAll",
                label: "Clear All Selections"
            },
            {
                value: "unlockAll",
                label: "Unlock All Selections"
            },
            {
                value: "clearField",
                label: "Clear Selection in Field"
            },
            {
                value: "selectField",
                label: "Select in Field"
            },
            {
                value: "setVariable",
                label: "Set Variable Value"
            }
            //,
            //{
            //    value: "applyBookmark",
            //    label: "Apply Bookmark"
            //}

        ]
    };


    var field1Enabler = ['selectField', 'clearField'];
    var field1 = {
        type: "string",
        ref: "field1",
        label: "Field",
        expression: "optional",
        show: function ( data ) {
            return true;//field1Enabler.indexOf( data.actionBefore1 ) > -1;
        }
    };

    var bookmark1Enabler = ['applyBookmark'];
    var bookmark1 = {
        type: "string",
        ref: "bookmark1",
        label: "Bookmark Id",
        expression: "optional",
        show: function ( data ) {
            return true; //bookmark1Enabler.indexOf( data.actionBefore1 ) > -1;
        }
    };

    var variable1Enabler = ['setVariable'];
    var variable1 = {
        type: "string",
        ref: "variable1",
        label: "Variable Name",
        expression: "optional",
        show: function ( data ) {
            return true;//variable1Enabler.indexOf( data.actionBefore1 ) > -1
        }
    };

    var value1Enabler = ['selectField', 'setVariable'];
    var value1 = {
        type: "string",
        ref: "value1",
        label: "Value",
        expression: "optional",
        show: function ( data ) {
            return true;//value1Enabler.indexOf(data.actionBefore1) > -1;
        }
    };

    // ****************************************************************************************
    // Setup
    // ****************************************************************************************
    var settings = {
        uses: "settings",
        items: {
            layout: {
                type: "items",
                label: "Layout",
                items: {
                    label: label,
                    style: style,
                    align: align
                }
            }
            //,
            //behavior: {
            //    type: "items",
            //    label: "Behavior",
            //    items: {
            //        action: action,
            //        sheetId: sheetId
            //    }
            //},
            //actionsBefore: {
            //    type: "items",
            //    label: "Actions",
            //    items: {
            //        isActionsBefore: isActionsBefore,
            //        actions: actionBefore,
            //        bookmarks: bookmarks,
            //        field1: field1,
            //        variable1: variable1,
            //        value1: value1,
            //        bookmark1: bookmark1
            //    }
            //}
        }
    };


    var panelDefinition = {
        type     : "items",
        component: "accordion",
        items    : {
            settings: settings
        }
    };

    // ****************************************************************************************
    // Return Values
    // ****************************************************************************************
    return panelDefinition;

});