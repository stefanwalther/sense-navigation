/*global define*/
/**
 * @todo: Refactor the make it easier to understand immediately the difference between actions and navigation-behavior + dependencies
 */
define( [
	'jquery',
	'underscore',
	'qlik',
	'./lib/js/extUtils',
	'ng!$q',
	'ng!$http'
], function ( $, _, qlik, extUtils, $q, $http ) {

	var app = qlik.currApp();

	// ****************************************************************************************
	// Helper Promises
	// ****************************************************************************************
	var getBookmarkList = function () {
		var defer = $q.defer();

		app.getList( 'BookmarkList', function ( items ) {
			defer.resolve( items.qBookmarkList.qItems.map( function ( item ) {
					return {
						value: item.qInfo.qId,
						label: item.qData.title
					}
				} )
			);
		} );
		return defer.promise;
	};

	var getSheetList = function () {

		var defer = $q.defer();

		app.getAppObjectList( function ( data ) {
			var sheets = [];
			var sortedData = _.sortBy( data.qAppObjectList.qItems, function ( item ) {
				return item.qData.rank;
			} );
			_.each( sortedData, function ( item ) {
				sheets.push( {
					value: item.qInfo.qId,
					label: item.qMeta.title
				} );
			} );
			return defer.resolve( sheets );
		} );

		return defer.promise;
	};

	var getStoryList = function () {

		var defer = $q.defer();

		app.getList( 'story', function ( data ) {
			var stories = [];
			if ( data && data.qAppObjectList && data.qAppObjectList.qItems ) {
				data.qAppObjectList.qItems.forEach( function ( item ) {
					stories.push( {
						value: item.qInfo.qId,
						label: item.qMeta.title
					} );
				} )
			}
			return defer.resolve( _.sortBy( stories, function ( item ) {
				return item.label;
			} ) );

		} );

		return defer.promise;

	};
	var getIcons = function () {
		var defer = $q.defer();

		//Todo: replace with extUtils.getExtensionPath/
		$http.get( extUtils.getExtensionPath('swr-sheetnavigation') + '/lib/data/icons-fa.json' )
			.then( function ( res ) {

				var sortedIcons = _.sortBy(res.data.icons, function ( o ) {
					return o.name;
				});

				var propDef = [];
				propDef.push( {
						"value": "",
						"label": ">> No icon <<"
					} );

				sortedIcons.forEach( function ( icon ) {
					propDef.push(
						{
							"value": icon.id,
							"label": icon.name
						}
					)
				} );
				defer.resolve( propDef );

			} );

		return defer.promise;
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
		component: "buttongroup",
		label: "Button Width",
		ref: "fullWidth",
		options: [
			{
				value: true,
				label: "Full Width",
				tooltip: "Button has the same width as the element."
			},
			{
				value: false,
				label: "Auto Width",
				tooltip: "Auto width depending on the label defined."
			}
		],
		defaultValue: false
	};

	var icons = {
		type: "string",
		component: "dropdown",
		label: "Icon",
		ref: "buttonIcon",
		options: function () {
			return getIcons().then( function ( items ) {
				return items;
			} );
		}
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
		show: function () {
			return true;
		},
		defaultValue: "Your Label"
	};

	// ****************************************************************************************
	// Behavior
	// ****************************************************************************************
	var action = {
		ref: "action",
		label: "Navigation Action",
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
			},
			{
				value: "gotoStory",
				label: "Go to a story"
			},
			{
				value: "openWebsite",
				label: "Open Website"
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
			} );
		},
		show: function ( data ) {
			return data.action === 'gotoSheet';
		}
	};

	var storyList = {
		type: "string",
		component: "dropdown",
		label: "Select Story",
		ref: "selectedStory",
		options: function () {
			return getStoryList().then( function ( items ) {
				return items;
			} );
		},
		show: function ( data ) {
			return data.action === 'gotoStory'
		}
	};

	var websiteUrl = {
		ref: "websiteUrl",
		label: "Website Url:",
		type: "string",
		expression: "optional",
		show: function ( data ) {
			return data.action === 'openWebsite';
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
			return value1Enabler.indexOf( data.actionBefore1 ) > -1;
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
			} );
		},
		show: function ( data ) {
			return bookmark1Enabler.indexOf( data.actionBefore1 ) > -1;
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
					align: align,
					icons: icons
				}
			},
			behavior: {
				type: "items",
				label: "Navigation Behavior",
				items: {
					action: action,
					sheetId: sheetId,
					sheetList: sheetList,
					storyList: storyList,
					websiteUrl: websiteUrl
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
		type: "items",
		component: "accordion",
		items: {
			settings: settings
		}
	};

	// ****************************************************************************************
	// Return Values
	// ****************************************************************************************
	return panelDefinition;

} );
