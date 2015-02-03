/*global define,console*/
define([
    'jquery',
    'underscore',
    'qlik',
    'ng!$q'
], function ($, _, qlik, $q) {

    var app = qlik.currApp();

	// ****************************************************************************************
	// Helper Promises
	// ****************************************************************************************
	var getBookmarkList = function (  ) {
		var deferred = $q.defer();

		app.getList( 'BookmarkList', function ( items ) {
			console.log(' Bookmarklist - callback', items);
			deferred.resolve( items.qBookmarkList.qItems.map( function ( item ) {
					return {
						value: item.qInfo.qId,
						label: item.qData.title
					}
				})
			);
		});

		return deferred.promise;
	};

	var getSheetList = function () {

		var deferred = $q.defer();

		app.getAppObjectList( function ( data ) {
			console.log('sheetList', data );
			var sheets = [];
			var sortedData = _.sortBy( data.qAppObjectList.qItems, function ( item ) {
				return item.qData.rank;
			});
			_.each( sortedData, function ( element ) {
				//console.log('sheet elem:', element);
				sheets.push( {
					value: element.qInfo.qId,
					label: element.qMeta.title
				} );
			} );
			return deferred.resolve( sheets );
		} );

		return deferred.promise;

	};

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

	var buttonWidth = {
		type: "boolean",
		component: "switch",
		label: "Full Width",
		ref: "fullWidth",
		options: [
			{
				value: true,
				label: "On"
			},
			{
				value: false,
				label: "Off"
			}
		],
		defaultValue: false
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
        ],
		show: function ( data ) {
			return data.fullWidth === false;
		}
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
				value: "none",
				label: "None"
			},
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
                label: "Go to a specific sheet"
            },
			{
				value: "gotoSheetById",
				label: "Go to a sheet (defined by Sheet Id)"
			}
        ]
    };

	var sheetId = {
		ref: "sheetId",
		label: "Sheet ID:",
		type: "string",
		expression: "optional",
		show: function ( data ) {
			return data.action === 'gotoSheetById';
		}
	};

	var sheetList = {
		type: "string",
		component: "dropdown",
		label: "Select Sheet",
		ref: "selectedSheet",
		options: function () {
			return getSheetList().then( function ( items ) {
				return items;
			});
		},
		show: function ( data ) {
			return data.action === 'gotoSheet';
		}
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

    var actionBefore1 = {
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
            },
            {
                value: "setVariable",
                label: "Set Variable Value"
            },
            {
                value: "applyBookmark",
                label: "Apply Bookmark"
            }

        ]
    };


    var field1Enabler = ['selectField', 'clearField'];
    var field1 = {
        type: "string",
        ref: "field1",
        label: "Field",
        expression: "optional",
        show: function ( data ) {
            return field1Enabler.indexOf( data.actionBefore1 ) > -1;
        }
    };

    var bookmark1Enabler = ['applyBookmark'];
    var bookmark1 = {
        type: "string",
        ref: "bookmark1",
        label: "Bookmark Id",
        expression: "optional",
        show: function ( data ) {
            return bookmark1Enabler.indexOf( data.actionBefore1 ) > -1;
        }
    };

    var variable1Enabler = ['setVariable'];
    var variable1 = {
        type: "string",
        ref: "variable1",
        label: "Variable Name",
        expression: "optional",
        show: function ( data ) {
            return variable1Enabler.indexOf( data.actionBefore1 ) > -1
        }
    };

    var value1Enabler = ['selectField', 'setVariable'];
    var value1 = {
        type: "string",
        ref: "value1",
        label: "Value",
        expression: "optional",
        show: function ( data ) {
            return value1Enabler.indexOf(data.actionBefore1) > -1;
        }
    };

    //var bookmarkDropdown = {
    //    type: "string",
    //    component: "dropdown",
    //    label: "Bookmark",
    //    ref: "gotoBookmark",
    //    options: function () {
    //        return app.getList( 'BookmarkList' ).then( function ( items ) {
    //            //console.log('bookmarklist-items', items);
    //            //var bookmarkList = items.layout.qBookmarkList;
    //            return items.layout.qBookmarkList.qItems.map( function ( item ) {
    //                return {
    //                    value: item.qInfo.qId,
    //                    label: item.qData.title
    //                };
    //            } );
    //        } );
    //    }
    //};

    //var bookmarkDropdown = {
    //    type: "string",
    //    component: "dropdown",
    //    label: "Bookmark",
    //    ref: "gotoBookmark",
    //    options: function () {
    //        return app.getList( 'BookmarkList' , function ( items ) {
    //            return items.qBookmarkList.qItems.map( function ( item ) {
    //                return {
    //                    value: item.qInfo.qId,
    //                    label: item.qData.title
    //                };
    //            } );
    //        } );
    //    }
    //};

    var bookmark1Enabler = ['applyBookmark'];
    var bookmark1 = {
        type: "string",
        component: "dropdown",
        label: "Select Bookmark",
        ref: "bookmark1",
        options: function () {
            return getBookmarkList().then( function ( items ) {
                return items;
            });
        },
        show: function ( data ) {
            return bookmark1Enabler.indexOf(data.actionBefore1) > -1;
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
                    buttonWidth: buttonWidth,
                    align: align
                }
            },
            behavior: {
                type: "items",
                label: "Behavior",
                items: {
                    action: action,
                    sheetId: sheetId,
					sheetList: sheetList
                }
            },
            actionsBefore: {
                type: "items",
                label: "Actions",
                items: {
                    isActionsBefore: isActionsBefore,
                    actions: actionBefore1,
                    field1: field1,
                    variable1: variable1,
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