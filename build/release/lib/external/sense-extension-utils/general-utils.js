/*!

* sense-navigation - Sense Sheet Navigation + Actions visualization extension for Qlik Sense.
* --
* @version v1.0.0-rc1-07
* @link https://github.com/stefanwalther/sense-navigation
* @author Stefan Walther
* @license MIT
*/

/*!

* sense-extension-utils - Sugar methods on top of Qlik Sense' Capability APIs to be used in visualization extensions and mashups.
* --
* @version v0.5.4
* @link https://github.com/stefanwalther/sense-extension-utils
* @author Stefan Walther (https://github.com/stefanwalther)
* @license MIT
*/
define(["qlik","jquery","underscore"],function(qlik,$,_){"use strict";var $injector=angular.injector(["ng"]),$q=$injector.get("$q"),$http=$injector.get("$http");function getBasePath(){var prefix=window.location.pathname.substr(0,window.location.pathname.toLowerCase().lastIndexOf("/sense")+1),url=window.location.href;return(url=url.split("/"))[0]+"//"+url[2]+("/"===prefix[prefix.length-1]?prefix.substr(0,prefix.length-1):prefix)}return"function"!=typeof String.prototype.startsWith&&(String.prototype.startsWith=function(str){if(null==str)return!1;var i=str.length;if(this.length<i)return!1;for(--i;i>=0&&this[i]===str[i];--i);return i<0}),{addStyleToHeader:function(cssContent,id){id&&"string"==typeof id?$("#"+id).length||$("<style>").attr("id",id).html(cssContent).appendTo("head"):$("<style>").html(cssContent).appendTo("head")},addStyleLinkToHeader:function(linkUrl,id){if(id&&!_.isEmpty(id)&&!$("#"+id).length){var $styleLink=$(document.createElement("link"));$styleLink.attr("rel","stylesheet"),$styleLink.attr("type","text/css"),$styleLink.attr("href",linkUrl),id&&!_.isEmpty(id)&&$styleLink.attr("id",id),$("head").append($styleLink)}},getExtensionInfo:function(extensionUniqueName){var defer=$q.defer(),url=getBasePath()+"/extensions/"+extensionUniqueName+"/"+extensionUniqueName+".qext";return $http.get(url).then(function(response){defer.resolve(response.data)}).catch(function(err){defer.reject(err)}),defer.promise},getExtensionPath:function(extensionUniqueName){return window.location.pathname.substr(0,window.location.pathname.toLowerCase().lastIndexOf("/sense")+1)+"extensions/"+extensionUniqueName},getProductVersion:function(){var defer=$q.defer();return qlik.getGlobal({}).getProductVersion(function(reply){for(var v=reply.qReturn,lastDot=xIndexOf(v,".",2),chars=v.substr(lastDot+1).split(),numDigitsAfterRest=0,i=0;i<chars.length;i++)if(!_.isNumber(chars[i])){numDigitsAfterRest=i+1;break}defer.resolve(v.substr(0,lastDot+1+numDigitsAfterRest))}),defer.promise},getBasePath:getBasePath}});