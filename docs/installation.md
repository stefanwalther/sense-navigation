### Fresh Installation

0. **Do not download the entire Github repository, this will not work!**
1. Download the [latest version]({%= verb.buildLatest %}) or [any other version](https://github.com/stefanwalther/sense-navigation/tree/master/build) you want to install.
2. Then install on either *Qlik Sense Desktop* or *Qlik Sense Server*:

* Qlik Sense Desktop
	* To install, unzip all files and copy the content to the folder folder `"C:\Users\%USERNAME%\Documents\Qlik\Sense\Extensions\sense-navigation"`
* Qlik Sense Server
	* See instructions [how to import an extension on Qlik Sense Server](http://help.qlik.com/sense/2.0/en-US/online/#../Subsystems/ManagementConsole/Content/import-extensions.htm)

### You are already using an ***sense-navigation*** version 0.x?

* I have unfortunately bad news: Version 0.x of **sense-navigation** does not seamlessly upgrade to version v1.x of **sense-navigation**!
* If you upgrade to v1.x, you will have to
  * First install new new version of ***sense-navigation***.
  * Delete existing old instances of ***sense-navigation***.
  * Add it again to your sheets and apply the previous configurations.
