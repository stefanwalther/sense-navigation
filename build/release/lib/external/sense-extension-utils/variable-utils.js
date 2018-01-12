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
define(["angular"],function(angular){"use strict";var $q=angular.injector(["ng"]).get("$q");return new function(){var self=this;this.updateEngineVars=function(app,varDefs){var defer=$q.defer();return varDefs.forEach(function(varDef){self.ensureEngineVarExists(app,varDef.name).then(function(isVarExisting){app.variable.setContent(varDef.name,varDef.value).then(function(reply){angular.noop()})}).catch(function(err){})}),defer.promise},this.ensureEngineVarExists=function(app,varName){var defer=$q.defer();return this.engineVarExists(app,varName).then(function(result){if(!result)return self.createEngineSessionVar(app,varName);defer.resolve(!0)}).catch(function(err){defer.reject(err)}),defer.promise},this.createEngineSessionVar=function(app,varName){return app.variable.create({qName:varName})},this.engineVarExists=function(app,varName){var defer=$q.defer();return app.variable.getByName(varName).then(function(model){defer.resolve(model)},function(errorObject){defer.resolve(null)}),defer.promise},this.getEngineVarListValues=function(app,varList){if(varList&&Array.isArray(varList)){var promises=[];return varList.forEach(function(variable){promises.push(self.getEngineVarValue(app,variable))}),$q.all(promises)}return $q.reject(new Error("getEngineVarListValues variable list passed."))},this.getEngineVarValue=function(app,varName){var defer=$q.defer();return app.variable.getByName(varName).then(function(result){defer.resolve({success:!0,varName:varName,result:result})}).catch(function(err){defer.resolve({success:!1,varName:varName,err:err})}),defer.promise}}});