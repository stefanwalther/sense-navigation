/*global define*/
define( [
	'jquery',
	'underscore',
	'qlik',
	'./lib/external/sense-extension-utils/extUtils',
	'ng!$q',
	'ng!$http'
], function ( $, _, qlik, extUtils, $q, $http ) {

	const app = qlik.currApp();

	// ****************************************************************************************
	// Helper Promises
	// ****************************************************************************************
	const getBookmarkList = function () {
		const defer = $q.defer();

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

	const getSheetList = function () {

		const defer = $q.defer();

		app.getAppObjectList( function ( data ) {
			const sheets = [];
			const sortedData = _.sortBy( data.qAppObjectList.qItems, function ( item ) {
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

	const getStoryList = function () {

		const defer = $q.defer();

		app.getList( 'story', function ( data ) {
			const stories = [];
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
	const getIcons = function () {
		const defer = $q.defer();

		$http.get( extUtils.getExtensionPath( 'swr-sense-navigation' ) + '/lib/data/icons-fa.json' )
			.then( function ( res ) {

				const sortedIcons = _.sortBy( res.data.icons, function ( o ) {
					return o.name;
				} );

				const propDef = [];
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
	const style = {
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

	const buttonWidth = {
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

	const buttonIcon = {
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

	const buttonAlign = {
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

	const buttonMultiLine = {
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

	const buttonLabel = {
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
	const action = {
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

	const sheetId = {
		ref: "props.sheetId",
		label: "Sheet ID",
		type: "string",
		expression: "optional",
		show: function ( data ) {
			return data.props.action === 'gotoSheetById';
		}
	};

	const sheetList = {
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

	const storyList = {
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

	const websiteUrl = {
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
	const isActionsBefore = {
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

	const actionOptions = [
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

	const actionBefore1 = {
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

	const actionBefore2 = {
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

	const fieldEnabler = ['selectField', 'selectValues', 'clearField', 'selectandLockField', 'lockField', 'selectAlternative', 'selectExcluded'];
	const field1 = {
		type: "string",
		ref: "props.field1",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	const field2 = {
		type: "string",
		ref: "props.field2",
		label: "Field",
		expression: "optional",
		show: function ( data ) {
			return fieldEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};

	const bookmarkEnabler = ['applyBookmark'];
	const bookmark1 = {
		type: "string",
		ref: "props.bookmark1",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	const bookmark2 = {
		type: "string",
		ref: "props.bookmark2",
		label: "Bookmark Id",
		expression: "optional",
		show: function ( data ) {
			return bookmarkEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};
	
	const constiableEnabler = ['setVariable'];
	const constiable1 = {
		type: "string",
		ref: "props.constiable1",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return constiableEnabler.indexOf( data.props.actionBefore1 ) > -1
		}
	};
	const constiable2 = {
		type: "string",
		ref: "props.constiable2",
		label: "Variable Name",
		expression: "optional",
		show: function ( data ) {
			return constiableEnabler.indexOf( data.props.actionBefore2 ) > -1
		}
	};

	const valueEnabler = ['selectField', 'selectValues', 'setVariable', 'selectandLockField'];
	const value1 = {
		type: "string",
		ref: "props.value1",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	const value2 = {
		type: "string",
		ref: "props.value2",
		label: "Value",
		expression: "optional",
		show: function ( data ) {
			return valueEnabler.indexOf( data.props.actionBefore2 ) > -1;
		}
	};

	const valueDescEnabler = ['selectValues'];
	const value1Desc = {
		type: "text",
		component: "text",
		ref: "props.value1Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore1) > -1;
		}
	};
	const value2Desc = {
		type: "string",
		component: "text",
		ref: "props.value2Desc",
		label: "Define multiple values separated with a semi-colon (;).",
		show: function ( data ) {
			return valueDescEnabler.indexOf( data.props.actionBefore2) > -1;
		}
	};

	const bookmarkselection = {
		type: "string",
		ref: "props.byexpression",
		component: "switch",
		label: "Select Bookmark Via",
		defaultValue: "",
		options: [
			{ value: true,  label: "Expression" },
			{ value: false, label: "Manual Selection" }
		]
	};
	const bookmark1Enabler = ['applyBookmark'];
	const bookmark1 = {
		type: "string",
		component: "dropdown",
		label: "Select Bookmark",
		ref: "props.bookmark1",
		options: function () {
			return getBookmarkList()
				.then( function ( items ) {
					return items;
				});
		},
		show: function(data) { return !data.props.byexpression && bookmark1Enabler.indexOf( data.props.actionBefore1 ) > -1; }
	};
	const bookmarkexpression = {
		type: "string",
		expression: "always",
		label: "Bookmark Expression",
		defaultValue: "",
		ref: "props.bookmarkexpression",
		show: function(data) { return data.props.byexpression && bookmark1Enabler.indexOf( data.props.actionBefore1 ) > -1; }
	}

	const softLockEnabler = ['selectAlternative', 'selectExcluded'];
	const softlock1 = {
		type: "boolean",
		label: "Soft Lock",
		ref: "props.softlock1",
		defaultValue: false,
		show: function ( data ) {
			return softLockEnabler.indexOf( data.props.actionBefore1 ) > -1;
		}
	};
	const softlock2 = {
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
	const settings = {
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
					constiable1: constiable1,
					value1: value1,
					value1Desc: value1Desc,
					bookmarkselection: bookmarkselection, 
					bookmark1: bookmark1,
					softlock1: softlock1,
					bookmarkexpression: bookmarkexpression,
					actionBefore2: actionBefore2,
					field2: field2,
					constiable2: constiable2,
					value2: value2,
					value2Desc: value2Desc,
					bookmark2: bookmark2,
					softlock2: softlock2
				}
			}
		}
	};

	const panelDefinition = {
		type: "items",
		component: "accordion",
		items: {
			settings: settings
		}
	};

	return panelDefinition;
} );
