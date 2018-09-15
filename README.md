# sense-navigation
> Sense Sheet Navigation + Actions visualization extension for Qlik Sense.

![](https://raw.githubusercontent.com/stefanwalther/sense-navigation/master/docs/images/sense-navigation.png)

---
## Table of Contents

- [Functionality](#functionality)
- [Layout](#layout)
- [Installation & Download](#installation--download)
- [Examples](#examples)
- [Configuration](#configuration)
- [Compatibility](#compatibility)
- [Related projects](#related-projects)
- [About](#about)
  * [Room for improvements / contribution](#room-for-improvements--contribution)
  * [Authors & Contributors](#authors--contributors)
  * [Contributors](#contributors)
  * [Contributing](#contributing)
  * [License](#license)
  * [Change log](#change-log)

---

## Functionality
The Visualization Extension ***sense-navigation*** for Qlik Sense allows you to add a button to a Qlik Sense sheet to navigate in your app:

* Go to first sheet
* Go to next sheet
* Go to previous sheet
* Go to last sheet
* Go to a sheet
* Go to a sheet (defined by sheet Id)
* Go to a story
* Open a website / eMail
* Switch to the Edit mode

The button can be easily styled nicely by selecting some of the predefined designs ([Leonardo UI](https://qlik-oss.github.io/leonardo-ui/) or [Bootstrap](https://getbootstrap.com/)) or modified with custom CSS.

Furthermore ***sense-navigation*** offers the option to define a **chain of 1-n actions** which will be executed **before** the navigation happens.  

For example be:

* Apply a bookmark
* Clear selections
* Lock selections
* Unlock selections
* Select value(s) in a field
* Select alternatives
* Select possible values in a field
* Set a variable value

See [here](./docs/actions.md) for a complete list of all available 20 actions.

Note: The main difference between version 0.x and 1.x of sense-navigation is that with v1.x you can define a chain of unlimited actions instead of just two.

## Layout
### Button Themes

There are several predefined styles available, you can choose from:

> ![](docs/images/sense_navigation__button_themes.png)
### Button icons

Every button can also include an icon:

> ![](docs/images/sense_navigation__button_icons.png)

***sense-navigation*** offers in total 851 icons to use:
 
- Icon library [Fontawesome icons](http://fontawesome.io/): 675 icons
- Icon library [Leonardo UI icons](https://qlik-oss.github.io/leonardo-ui/icons.html): 176 icons

<!-- Todo: Has to be removed, is a duplicate ... -->
<!-- See here: https://github.com/stefanwalther/sense-navigation/blob/v1.0/docs/config-layout.md#predefined-styles-by-expression -->
### Button Style by Qlik Expression

Buttons can also be [styled based on a custom expression](docs/config-layout.md#advanced-styling):

> ![](docs/images/sense_navigation__style_by_expression.png)

The expression has to result into on of the following values:

- `bs3-
### Custom Styles (Custom CSS)

If you want to have full freedom over designing your button, just use CSS:

> ![](docs/images/sense_navigation__style_by_css.png)

Result:

> ![](docs/images/sense_navigation__style_by_css_result.png)

## Installation & Download
### Fresh Installation

0. ⚠️ **Do not download the entire Github repository, this will not work!**
1. Download the [latest version](https://github.com/stefanwalther/sense-navigation/raw/master/build/sense-navigation_latest.zip) or [any other version](https://github.com/stefanwalther/sense-navigation/tree/master/build) you want to install.
2. Then install on either *Qlik Sense Desktop* or *Qlik Sense Server*:

* Qlik Sense Desktop
	* To install, unzip all files and copy the content to the folder folder `"C:\Users\%USERNAME%\Documents\Qlik\Sense\Extensions\sense-navigation"`
* Qlik Sense Server
	* See instructions [how to import an extension on Qlik Sense Server](http://help.qlik.com/sense/2.0/en-US/online/#../Subsystems/ManagementConsole/Content/import-extensions.htm)

If you are running into any troubles, see [here for some FAQ](https://github.com/stefanwalther/sense-extension-install).

### You are already using an ***sense-navigation*** version < 1.x?

* I have unfortunately bad news: All versions < 1.x of ***sense-navigation*** do not seamlessly upgrade to version v1.x!
* If you upgrade to v1.x, you will have to
  * First install new new version of ***sense-navigation***.
  * Delete existing old instances of ***sense-navigation***.
  * Add it again to your sheets and apply the previous configurations.
  
### Should I upgrade?

See [here for more information](./docs/why-upgrade.md) what v1.x gives you and whether you should upgrade or not.

### Where do I find the 0.8x version of sense-navigation

Please go [https://github.com/stefanwalther/sense-navigation/tree/v0.8.x](here).

## Examples
### Example Application

If you want to try the various options of this extension, download the [sample application](https://github.com/stefanwalther/sense-navigation/tree/master/example)

<details>
<summary>Some screenshots of the sample application</summary>

![](./docs/images/example_bootstrap.png)
![](./docs/images/example_bootstrap_icons.png)
![](./docs/images/example_lui.png)
![](./docs/images/example_lui_icons.png)
![](./docs/images/example_button_by_css.png)
![](./docs/images/example_button_by_expression.png)

</details>

## Configuration
Drag & drop the object onto a sheet (as you would do it with any other native object or visualization extension).
Then define how the ***sense-navigation*** should behave:

- [Layout Options](./docs/config-layout.md)
- [Actions](./docs/config-actions.md)
- [Navigation Behavior](./docs/config-navigation-behavior.md)

## Compatibility
**sense-navigation** is designed to work with Qlik Sense *September 2017* or higher.
If you want to use _sense-navigation_ in older versions, install an older version than v1.0.

### ***sense-navigation*** & Mashups

***sense-navigation*** it built to be used within the Qlik Sense Client.
Any usage in a mashup-based solution might work, but there are many features in ***sense-navigation*** which can never work in a mashup-based solution (e.g. "Go to next sheet", "Go to edit mode", etc.).
So use ***sense-navigation*** in a mashup-based solution only at your own risk!

### ***sense-navigation*** & DevHub

If you want use & modify the extension in DevHub, then you have two options:

- Use the file `./build/*_dev.zip`, this always represents the latest development build (so no minimized/uglified files, etc.)
- Fork the entire repository and follow the [instructions how to build the extensions](https://github.com/stefanwalther/sense-extension-contrib)

## Related projects
Some related projects (Qlik Sense Visualization Extensions) I have recently created:

- [qliksense-extension-tutorial](https://www.npmjs.com/package/qliksense-extension-tutorial): Comprehensive tutorial to start developing Qlik Sense Extensions. | [homepage](https://github.com/stefanwalther/qliksense-extension-tutorial "Comprehensive tutorial to start developing Qlik Sense Extensions.")
- [sense-calendar-heatmap](https://www.npmjs.com/package/sense-calendar-heatmap): Qlik Sense Visualization Extension with a diverging color scale. The values are displayed as colored… [more](https://github.com/stefanwalther/qsCalendarHeatmap) | [homepage](https://github.com/stefanwalther/qsCalendarHeatmap "Qlik Sense Visualization Extension with a diverging color scale. The values are displayed as colored cells per day. Days are arranged into columns by week, then grouped by month and years.")
- [sense-extension-recipes](https://www.npmjs.com/package/sense-extension-recipes): Recipes on working with Qlik Sense Visualization Extensions. | [homepage](https://github.com/stefanwalther/sense-extension-recipes "Recipes on working with Qlik Sense Visualization Extensions.")
- [sense-funnel-chart](https://www.npmjs.com/package/sense-funnel-chart): Funnel Chart for Qlik Sense. | [homepage](https://github.com/stefanwalther/sense-funnel-chart "Funnel Chart for Qlik Sense.")
- [sense-media-box](https://www.npmjs.com/package/sense-media-box): Include web pages, videos, images and much more into your Qlik Sense app. | [homepage](https://github.com/stefanwalther/sense-media-box "Include web pages, videos, images and much more into your Qlik Sense app.")
- [sense-on-off-switch](https://www.npmjs.com/package/sense-on-off-switch): Set a variable in Qlik Sense to true/false using an on-off switch. | [homepage](https://github.com/stefanwalther/sense-on-off-switch "Set a variable in Qlik Sense to true/false using an on-off switch.")
- [sense-qr-code](https://www.npmjs.com/package/sense-qr-code): QR Code to be embedded into Qlik Sense. | [homepage](https://github.com/stefanwalther/qsQRCode "QR Code to be embedded into Qlik Sense.")
- [sense-range-slider](https://www.npmjs.com/package/sense-range-slider): Slider object for Qlik Sense to manipulate one or two variables. | [homepage](https://github.com/QlikDev/qsRangeSlider "Slider object for Qlik Sense to manipulate one or two variables.")
- [sense-themable-kpi-tile](https://www.npmjs.com/package/sense-themable-kpi-tile): KPI Tile for Qlik Sense with the ability to use themes or to customize background… [more](https://github.com/stefanwalther/sense-themable-kpi-tile) | [homepage](https://github.com/stefanwalther/sense-themable-kpi-tile "KPI Tile for Qlik Sense with the ability to use themes or to customize background color, comparison indicator, etc.")  

## About

### Room for improvements / contribution
Is there **anything else you'd like to see** in this visualization extension?

* Don't hesitate to add the feature and create a pull request!
* You don't have the time or skills to implement this specific feature? No problem, [drop a note here](https://github.com/stefanwalther/sense-navigation/issues).

### Authors & Contributors
**Stefan Walther**

* [qliksite.io](http://qliksite.io) - Qlik Sense / QAP related blog
* [qlikblog.at](http://qlikblog.at) - QlikView related blog
* [stefanwalther.io](http://stefanwalther.io) - Private blog
* [twitter/waltherstefan](http://twitter.com/waltherstefan)  
* [github.com/stefanwalther](http://github.com/stefanwalther)  

### Contributors
- [rvaheldendaten](https://github.com/rvaheldendaten)
- [rjriel](https://github.com/rjriel)

### Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/stefanwalther/sense-navigation/issues).
The process for contributing is outlined below:

1. Create a fork of the project
2. Work on whatever bug or feature you wish
3. Create a pull request (PR)

I cannot guarantee that I will merge all PRs but I will evaluate them all.

### Building the project

See [https://github.com/stefanwalther/sense-extension-contrib](https://github.com/stefanwalther/sense-extension-contrib)

### License
MIT

### Change log
See [CHANGELOG.yml](https://github.com/stefanwalther/sense-navigation/blob/master/CHANGELOG.yml)  

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on September 15, 2018._

