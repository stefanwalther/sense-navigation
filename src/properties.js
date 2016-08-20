/*global window,define*/
define( [
	'angular',
	'underscore',
	'qlik',
	'./lib/external/sense-extension-utils/extUtils'
], function ( angular, _, qlik, extUtils, $q, $http ) {

	var $injector = angular.injector( ['ng'] );
	var $q = $injector.get( "$q" );
	var $http = $injector.get( "$http" );

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
						label: item.qData.title //Todo: Remove the .qvf
					}
				} )
			);
		} );
		return defer.promise;
	};

	var getAppList = function () {
		var defer = $q.defer();

		qlik.getAppList( function ( items ) {
			console.log( 'appList', items );
			defer.resolve( items.map( function ( item ) {
					return {
						value: item.qDocId,
						label: item.qTitle
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

				var sortedIcons = _.sortBy( res.data.buttonIcons, function ( o ) {
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

	var buttonIcons = {
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

	var buttonTextAlign = {
		ref: "props.buttonTextAlign",
		label: "Label Alignment",
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
			return data.props.fullWidth;
		}
	};

	var buttonMultiLine = {
		ref: "props.isButtonMultiLine",
		label: "Multiline Label",
		type: "boolean",
		defaultValue: false
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
	// Navigation Action
	// ****************************************************************************************

	var navigationAction = {
		ref: "props.navigationAction",
		label: "Navigation Action",
		type: "string",
		component: "dropdown",
		default: "nextSheet",
		options: [
			{
				label: "None",
				value: "none"
			},
			{
				label: "Go to next sheet",
				value: "nextSheet"
			},
			{
				label: "Go to previous sheet",
				value: "prevSheet"
			},
			{
				label: "Go to a specific sheet",
				value: "gotoSheet"
			},
			{
				label: "Go to a sheet (defined by Sheet Id)",
				value: "gotoSheetById"
			},
			{
				label: "Go to a story",
				value: "gotoStory"
			},
			{
				label: "Open website",
				value: "openWebsite"
			},
			{
				label: "Switch to Edit Mode",
				value: "switchToEdit"
			}
			// ,
			// {
			// 	label: "Open app",
			// 	value: "openApp"
			// }
		]
	};

	var sheetId = {
		ref: "props.sheetId",
		label: "Sheet ID",
		type: "string",
		expression: "optional",
		show: function ( data ) {
			return data.props.navigationAction === 'gotoSheetById';
		}
	};

	var appList = {
		type: "string",
		component: "dropdown",
		label: "Select App",
		ref: "props.selectedApp",
		options: function () {
			return getAppList()
				.then( function ( items ) {
					return items;
				} )
				.catch( function ( err ) {
					window.console.log( err );
				} );
		},
		show: function ( data ) {
			return data.props.navigationAction === 'openApp';
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
			return data.props.navigationAction === 'gotoSheet';
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
			return data.props.navigationAction === 'gotoStory'
		}
	};

	var websiteUrl = {
		ref: "props.websiteUrl",
		label: "Website Url:",
		type: "string",
		expression: "optional",
		show: function ( data ) {
			return data.props.navigationAction === 'openWebsite';
		}

	};

	// ****************************************************************************************
	// Action-Group
	// ****************************************************************************************

	var actionOptions = [
		{
			value: "applyBookmark",
			label: "Apply Bookmark",
			group: "bookmark"
		},
		{
			value: "clearAll",
			label: "Clear All Selections",
			group: "selection"
		},
		{
			value: "clearOther",
			label: "Clear Other Fields",
			group: "selection"
		},
		{
			value: "forward",
			label: "Forward (in your Selections)",
			group: "selection"
		},
		{
			value: "back",
			label: "Back (in your Selections)",
			group: "selection"
		},
		{
			value: "clearField",
			label: "Clear Selection in Field",
			group: "selection"
		},
		{
			value: "lockAll",
			label: "Lock All",
			group: "selection"
		},
		{
			value: "lockField",
			label: "Lock Field",
			group: "selection"
		},
		{
			value: "selectAll",
			label: "Select All Values in Field",
			group: "selection"
		},
		{
			value: "selectAlternative",
			label: "Select Alternatives",
			group: "selection"
		},
		{
			value: "selectAndLockField",
			label: "Select and Lock in Field",
			group: "selection"
		},
		{
			value: "selectExcluded",
			label: "Select Excluded",
			group: "selection"
		},
		{
			value: "selectField",
			label: "Select Value in Field",
			group: "selection"
		},
		{
			value: "selectPossible",
			label: "Select Possible Values in Field",
			group: "selection"
		},
		{
			value: "selectValues",
			label: "Select Multiple Values in Field",
			group: "selection"
		},
		{
			value: "setVariable",
			label: "Set Variable Value",
			group: "variables"
		},
		{
			value: "toggleSelect",
			label: "Toggle Field Selection",
			group: "selection"
		},
		{
			value: "unlockAll",
			label: "Unlock All",
			group: "selection"
		},
		{
			value: "unlockField",
			label: "Unlock Field",
			group: "selection"

		}
	];

	// ****************************************************************************************
	// n-actions
	// ****************************************************************************************
	var bookmarkEnabler = ['applyBookmark'];
	var fieldEnabler = ['clearField', 'clearOther', 'lockField', 'selectAll', 'selectAlternative', 'selectExcluded', 'selectField', 'selectPossible', 'selectValues', 'selectAndLockField', 'toggleSelect', 'unlockField'];
	var valueEnabler = ['selectField', 'selectValues', 'setVariable', 'selectAndLockField', 'toggleSelect'];
	var valueDescEnabler = ['selectValues'];
	var variableEnabler = ['setVariable'];
	var overwriteLockedEnabler = ['clearOther', 'selectAll', 'selectAlternative', 'selectExcluded', 'selectPossible', 'toggleSelect'];

	var actionGroup = {
		ref: "actionGroup",
		label: "Selection Action Type",
		type: "string",
		component: "dropdown",
		defaultValue: "selection",
		options: [
			{
				label: "Selection",
				value: "selection"
			},
			{
				label: "Bookmark",
				value: "bookmark"
			},
			{
				label: "Variables",
				value: "variables"
			}
		]
	};

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
			//actionGroup: actionGroup,
			actionType: {
				type: "string",
				ref: "actionType",
				component: "dropdown",
				defaultValue: "none",
				options: actionOptions
			},
			bookmark: {
				type: "string",
				ref: "bookmark",
				label: "Bookmark Id",
				expression: "optional",
				show: function ( data, defs ) {
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
				ref: "valueDesc",
				label: "Define multiple values separated with a semi-colon (;).",
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && valueDescEnabler.indexOf( def.actionType ) > -1;
				}
			},
			variable: {
				type: "string",
				ref: "variable",
				label: "Variable Name",
				expression: "optional",
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && variableEnabler.indexOf( def.actionType ) > -1;
				}
			},
			overwriteLocked: {
				type: "boolean",
				ref: "softLock",
				label: "Overwrite locked selections",
				defaultValue: false,
				show: function ( data, defs ) {
					var def = _.findWhere( defs.layout.props.actionItems, {cId: data.cId} );
					return def && overwriteLockedEnabler.indexOf( def.actionType ) > -1;
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
					buttonTextAlign: buttonTextAlign,
					buttonMultiLine: buttonMultiLine,
					buttonIcons: buttonIcons
				}
			},
			actionsList: actions,
			behavior: {
				type: "items",
				label: "Navigation Behavior",
				items: {
					action: navigationAction,
					sheetId: sheetId,
					sheetList: sheetList,
					storyList: storyList,
					websiteUrl: websiteUrl,
					appList: appList
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
