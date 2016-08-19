/*global define*/
//Todo: Instead of using ng!, use the $inject solution, which is more aligned with AngularJS standards.
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

	//Todo: Move to sense-extension-utils
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

	//Todo: Move to sense-extension-utils
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

	// Todo: Move to sense-extension-utils
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

	// ****************************************************************************************
	// n-actions
	// ****************************************************************************************
	var bookmarkEnabler = ['applyBookmark'];
	var fieldEnabler = ['selectField', 'selectValues', 'clearField', 'selectandLockField', 'lockField'];
	var valueEnabler = ['selectField', 'selectValues', 'setVariable', 'selectandLockField'];
	var valueDescEnabler = ['selectValues'];
	var variableEnabler = ['setVariable'];

	var actions = {
		type: "array",
		ref: "props.actionItems",
		label: "Actions",
		itemTitleRef: function ( data ) {
			var v = _.where( actionOptions, {value: data.actionType} );
			return (v && v.length > 0) ? v[0].label : data.actionType;
		},
		allowAdd: true,
		allowRemove: true,
		addTranslation: "Add Item",
		grouped: true,
		items: {
			actionType: {
				type: "string",
				ref: "actionType",
				component: "dropdown",
				defaultValue: "none",
				options: actionOptions,
				action: function ( data ) {
					//console.log( 'data', data );
				}
			},
			bookmark: {
				type: "string",
				ref: "bookmark",
				label: "Bookmark Id",
				expression: "optional",
				show: function ( data, defs ) {
					// console.log( '--' );
					// console.log( 'this', this );
					// console.log( 'data', data );
					// console.log( 'defs', defs );
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && bookmarkEnabler.indexOf( def.actionType ) > -1;
				}
			},
			field: {
				type: "string",
				ref: "field",
				label: "Field",
				expression: "optional",
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && fieldEnabler.indexOf( def.actionType ) > -1;
				}
			},
			value: {
				type: "string",
				ref: "value",
				label: "Value",
				expression: "optional",
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && valueEnabler.indexOf( def.actionType ) > -1;
				}
			},
			valueDesc: {
				type: "text",
				component: "text",
				ref: "props.valueDesc",
				label: "Define multiple values separated with a semi-colon (;).",
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && valueDescEnabler.indexOf( def.actionType ) > -1;
				}
			},
			variable: {
				type: "string",
				ref: "props.variable1",
				label: "Variable Name",
				expression: "optional",
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && variableEnabler.indexOf( def.actionType ) > -1;
				}
			}

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
			actionsList: actions,
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
