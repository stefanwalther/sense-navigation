/*global define*/
define([
    'underscore',
    'jquery',
    'qlik'
], function ($, _, qlik) {

    var bookmarks = undefined;
    var app = qlik.currApp();
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
        show: true,
        defaultValue: "Your Label"
    };

    var sheetId = {
        ref: "sheetId",
        label: "Sheet ID:",
        type: "string",
        show: function ( data ) {
            return data.action === 'gotoSheet';
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
            return data.isActionsBefore;
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
        show: function ( data ) {
            return field1Enabler.indexOf(data.actionBefore1) > -1;
        }
    };

    var bookmark1Enabler = ['applyBookmark'];
    var bookmark1 = {
        type: "string",
        ref: "bookmark1",
        label: "Bookmark Id",
        show: function ( data ) {
            return bookmark1Enabler.indexOf(data.actionBefore1) > -1;
        }
    };


    var value1Enabler = ['selectField'];
    var value1 = {
        type: "string",
        ref: "value1",
        label: "Value",
        show: function ( data ) {
            return value1Enabler.indexOf(data.actionBefore1) > -1;
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
            },
            behavior: {
                type: "items",
                label: "Behavior",
                items: {
                    action: action,
                    sheetId: sheetId
                }
            },
            actionsBefore: {
                type: "items",
                label: "Actions",
                items: {
                    isActionsBefore: isActionsBefore,
                    actions: actionBefore,
                    bookmarks: bookmarks,
                    field1: field1,
                    value1: value1,
                    bookmark1: bookmark1


                }
            }
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