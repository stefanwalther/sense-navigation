/*global define*/
define( [
	'jquery',
	'underscore',
	'qlik',
	'./lib/external/sense-extension-utils/extUtils',
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

		$http.get( extUtils.getExtensionPath( 'swr-sense-navigation' ) + '/lib/data/icons-fa.json' )
			.then( function ( res ) {

				var sortedIcons = _.sortBy( res.data.icons, function ( o ) {
					return o.name;
				} );

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
		ref: "props.buttonStyle",
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
		ref: "props.fullWidth",
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

	var buttonIcon = {
		type: "string",
		component: "dropdown",
		label: "Icon",
		ref: "props.buttonIcon",
		options: function () {
			return getIcons().then( function ( items ) {
				return items;
			} );
		}
	};

	var buttonAlign = {
		ref: "props.buttonAlign",
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
			return data.props.fullWidth === false;
		}
	};

	var buttonMultiLine = {
		ref: "props.isButtonMultiLine",
		label: "Multiline",
		type: "boolean",
		component: "switch",
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

	var buttonLabel = {
		ref: "props.buttonLabel",
		label: "Label",
		type: "string",
		expression: "optional",
		show: function () {
			return true;
		},
		defaultValue: "My Button"
	};

	// ****************************************************************************************
	// Behavior
	// ****************************************************************************************
	var action = {
		ref: "props.action",
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
				label: "Open website"
			}
		]
	};

	var sheetId = {
		ref: "props.sheetId",
		label: "Sheet ID",
		type: "string",
		expression: "optional",
		show: function ( data ) {
			return data.props.action === 'gotoSheetById';
		}
	};

	var sheetList = {
		type: "string",
		component: "dropdown",
		label: "Select Sheet",
		ref: "props.selectedSheet",
		options: function () {
			return getSheetList().then( function ( items ) {
				return items;
			} );
		},
		show: function ( data ) {
			return data.props.action === 'gotoSheet';
		}
	};

	var storyList = {
		type: "string",
		component: "dropdown",
		label: "Select Story",
		ref: "props.selectedStory",
		options: function () {
			return getStoryList().then( function ( items ) {
				return items;
			} );
		},
		show: function ( data ) {
			return data.props.action === 'gotoStory'
		}
	};

	var websiteUrl = {
		ref: "props.websiteUrl",
		label: "Website Url:",
		type: "string",
		expression: "optional",
		show: function ( data ) {
			return data.props.action === 'openWebsite';
		}

	};

	// ****************************************************************************************
	// Actions
	// ****************************************************************************************
	var isActionsBefore = {
		type: "boolean",
		component: "switch",
		label: "Actions before navigating",
		ref: "props.isActionsBefore",
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

	var actionOptions = [
		{
			value: "none",
			label: "None"
		},
		{
			value: "applyBookmark",
			label: "Apply Bookmark"
		},
		{
			value: "clearAll",
			label: "Clear All Selections"
		},
		{
			value: "clearField",
			label: "Clear Selection in Field"
		},
		{
			value: "lockField",
			label: "Lock Field"
		},
		{
			value: "selectExcluded",
			label: "Select Excluded Values"
		},
		{
			value: "selectAlternative",
			label: "Select Alternative Values"
		},
		{
			value: "selectandLockField",
			label: "Select and Lock in Field"
		},
		{
			value: "selectField",
			label: "Select Value in Field"
		},
		{
			value: "selectValues",
			label: "Select Multiple Values in Field"
		},
		{
			value: "setVariable",
			label: "Set Variable Value"
		},
		{
			value: "lockAll",
			label: "Lock All Selections"
		},
		{
			value: "unlockAll",
			label: "Unlock All Selections"
		}
	];

	var actionBefore1 = {
		type: "string",
		component: "dropdown",
		label: "First Action",
		ref: "props.actionBefore1",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.isActionsBefore;
		},
		options: actionOptions
	};

	var actionBefore2 = {
		type: "string",
		component: "dropdown",
		label: "Second Action",
		ref: "props.actionBefore2",
		defaultValue: "none",
		show: function ( data ) {
			return data.props.isActionsBefore && data.props.actionBefore1 !== 'none';
		},
		options: actionOptions
	};

	var fieldEnabler = ['selectField', 'selectValues', 'clearField', 'selectandLockField', 'lockField', 'selectAlternative', 'selectExcluded'];
	var field1 = {
		type: "string",
		ref: "props.field1",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	var field2 = {
		type: "string",
		ref: "props.field2",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};

	var bookmarkEnabler = ['applyBookmark'];
	var bookmark1 = {
		type: "string",
		ref: "props.bookmark1",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	var bookmark2 = {
		type: "string",
		ref: "props.bookmark2",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};

	var variableEnabler = ['setVariable'];
	var variable1 = {
		type: "string",
		ref: "props.variable1",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore1 ) > -1
		}
	};
	var variable2 = {
		type: "string",
		ref: "props.variable2",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return variableEnabler.indexOf( data.props.actionBefore2 ) > -1
		}
	};

	var valueEnabler = ['selectField', 'selectValues', 'setVariable', 'selectandLockField'];
	var value1 = {
		type: "string",
		ref: "props.value1",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	var value2 = {
		type: "string",
		ref: "props.value2",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};

	var valueDescEnabler = ['selectValues'];
	var value1Desc = {
		type: "text",
		component: "text",
		ref: "props.value1Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore1) > -1;
		}
	};
	var value2Desc = {
		type: "string",
		component: "text",
		ref: "props.value2Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore2) > -1;
		}
	};


	var bookmark1Enabler = ['applyBookmark'];
	var bookmark1 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark1",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				} );
		},
		show: function ( data ) {
			return bookmark1Enabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};

	var softLockEnabler = ['selectAlternative', 'selectExcluded'];
	var softlock1 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock1",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	var softlock2 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock2",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};

	// ****************************************************************************************
	// Setup
	// ****************************************************************************************
	var settings = {
		uses: "settings",
		items: {
			general: {
				items: {
					showTitles: {
						defaultValue: false
					}
				}
			},
			layout: {
				type: "items",
				label: "Layout",
				items: {
					label: buttonLabel,
					style: style,
					buttonWidth: buttonWidth,
					align: buttonAlign,
					buttonMultiLine: buttonMultiLine,
					icons: buttonIcon
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
					actionBefore1: actionBefore1,
					field1: field1,
					variable1: variable1,
					value1: value1,
					value1Desc: value1Desc,
					bookmark1: bookmark1,
					softlock1: softlock1,
					actionBefore2: actionBefore2,
					field2: field2,
					variable2: variable2,
					value2: value2,
					value2Desc: value2Desc,
					bookmark2: bookmark2,
					softlock2: softlock2
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
