/*!

* sense-navigation - Sense Sheet Navigation + Actions visualization extension for Qlik Sense.
* --
* @version v1.0.0-rc1-01
* @link https://github.com/stefanwalther/sense-navigation
* @author Stefan Walther
* @license MIT
*/

/*!

* sense-extension-utils - Sugar methods on top of Qlik Sense' Capability APIs to be used in visualization extensions and mashups.
* --
* @version v0.4.1
* @link https://github.com/stefanwalther/sense-extension-utils
* @author Stefan Walther (https://github.com/stefanwalther)
* @license MIT
*/

/*global window,define*/
define(["angular","underscore","qlik"],function(angular,_,qlik){var $injector=angular.injector(["ng"]),$q=$injector.get("$q"),app=qlik.currApp(),PPHelper=function(){this.getAppList=function(){var defer=$q.defer();return qlik.getAppList(function(items){defer.resolve(items.map(function(item){return{value:item.qDocId,label:item.qTitle}}))}),defer.promise},this.getBookmarkList=function(){var defer=$q.defer();return app.getList("BookmarkList",function(items){defer.resolve(items.qBookmarkList.qItems.map(function(item){return{value:item.qInfo.qId,label:item.qData.title}}))}),defer.promise},this.getFieldList=function(){var defer=$q.defer();return app.getList("FieldList",function(items){defer.resolve(items.qFieldList.qItems.map(function(item){return{value:item.qName,label:item.qName}}))}),defer.promise},this.getSheetList=function(){var defer=$q.defer();return app.getAppObjectList(function(data){var sheets=[],sortedData=_.sortBy(data.qAppObjectList.qItems,function(item){return item.qData.rank});return _.each(sortedData,function(item){sheets.push({value:item.qInfo.qId,label:item.qMeta.title})}),defer.resolve(sheets)}),defer.promise},this.getStoryList=function(){var defer=$q.defer();return app.getList("story",function(data){var stories=[];return data&&data.qAppObjectList&&data.qAppObjectList.qItems&&data.qAppObjectList.qItems.forEach(function(item){stories.push({value:item.qInfo.qId,label:item.qMeta.title})}),defer.resolve(_.sortBy(stories,function(item){return item.label}))}),defer.promise}};return new PPHelper});