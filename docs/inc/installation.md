### Fresh Installation

0. ⚠️ **Do not download the entire Github repository, this will not work!**
1. Download the [latest version]({%= verb.buildLatest %}) version (or [any other version](https://github.com/stefanwalther/sense-navigation/tree/master/build) you want to install).
2. Then install on either *Qlik Sense Desktop* or *Qlik Sense Server*:

* Qlik Sense Desktop
	* To install, unzip all files and copy the content to the folder folder `"C:\Users\%USERNAME%\Documents\Qlik\Sense\Extensions\sense-navigation"`
* Qlik Sense Server
	* See instructions [how to import an extension on Qlik Sense Server](https://help.qlik.com/en-US/sense/September2018/Subsystems/ManagementConsole/Content/Sense_QMC/import-extensions.htm)

If you are running into any troubles, see [here for some FAQs](https://github.com/stefanwalther/sense-extension-install).

### You are already using an ***sense-navigation*** version < 1.x?

* I have unfortunately bad news: All versions < 1.x of ***sense-navigation*** are completely incompatible with version v1.x!
* If you upgrade to v1.x, you will have to
  * First uninstall the old ***sense-navigation*** extension (delete the folder in Qlik Sense Desktop or use QMC in Qlik Sense Server to remove the extension)
  * First install the new version of ***sense-navigation***.
  * Delete existing old instances of ***sense-navigation*** object in your apps.
  * Add it again to your sheets and apply the previous configurations.
  
### Should I upgrade?

See [here for more information](./docs/why-upgrade.md) what v1.x gives you and whether you should upgrade or not.

### Where do I find the 0.8x version of sense-navigation

Version v8.x of sense-navigation is available [here](https://github.com/stefanwalther/sense-navigation/tree/v0.8.x).
