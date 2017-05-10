# sense-navigation
> Sense Sheet Navigation + Actions visualization extension for Qlik Sense.

HEADS-UP:
I am working on a major revision of sense-navigation, which is already available as v1.0-alpha.
Please have a look at this branch [v1.0 - Alpha](https://github.com/stefanwalther/sense-navigation/tree/v1.0) resp. [this pull request](https://github.com/stefanwalther/sense-navigation/pull/58)

![](https://raw.githubusercontent.com/stefanwalther/sense-navigation/master/docs/images/sense-navigation.png)

## Purpose and Description
The Visualization Extension ***sense-navigation*** for Qlik Sense allows you to add a button to a Qlik Sense sheet to navigate in your app:

* Go to the next sheet
* Go to the previous sheet
* Go to a specific sheet
* Go to a sheet (defined by the sheet Id)
* Go to a story
* Open a website

The button can be easily styled nicely by selecting some of the predefined designs.

Furthermore ***sense-navigation*** offers the option to define **up to two basic actions** which will be executed before the navigation happens. The following actions are possible:

* Apply a bookmark
* Clear all selections
* Clear selections in a field
* Lock field
* Unlock all selections
* Select a value in a field
* Select multiple values in a field
* Select excluded values
* Select alternative values
* Set a variable value
* Apply a bookmark
* Select and lock field

## Screenshots
### Button styles

There are several predefined styles available from which you can choose:

> ![](https://raw.githubusercontent.com/stefanwalther/sense-navigation/master/docs/images/sense_navigation_styles.png)

### Button icons
Every button can also include an icon:

> ![](https://raw.githubusercontent.com/stefanwalther/sense-navigation/master/docs/images/sense_navigation_button_icons.png)

## Installation & Download
1. Download the [latest version](https://github.com/stefanwalther/sense-navigation/raw/master/build/sense-navigation_latest.zip) or [any other version](https://github.com/stefanwalther/sense-navigation/tree/master/build) you want to install.
2. Then install on either *Qlik Sense Desktop* or *Qlik Sense Server*:

* Qlik Sense Desktop
	* To install, unzip all files and copy the content to the folder folder `"C:\Users\%USERNAME%\Documents\Qlik\Sense\Extensions\sense-navigation"`
* Qlik Sense Server
	* See instructions [how to import an extension on Qlik Sense Server](http://help.qlik.com/sense/2.0/en-US/online/#../Subsystems/ManagementConsole/Content/import-extensions.htm)

## Configuration
Drag & drop the object onto a sheet (as you would do it with any other native object or visualization extension).
Then define how the **sense-navigation** should behave:

### Layout

> ![](https://raw.githubusercontent.com/stefanwalther/sense-navigation/master/docs/images/sense_navigation_props_layout.png)

* **Label** - The buttons label.
* **Style** - Select one of the predefined styles.
* **Button Width** - Whether the button should spread of the entire grid column or just be as wide as necessary.
* **Alignment** - Align the button to "Left", "Center" or right of the parent container.
* **Multiline** - Whether the button can take one than more line.
* **Icon** - Choose one of the provided icons (based on [Font Awesome](https://fortawesome.github.io/Font-Awesome/))

### Navigation Behavior
Define the behavior of the button. The following options are available:

> ![](https://raw.githubusercontent.com/stefanwalther/sense-navigation/master/docs/images/sense_navigation_behavior.png) 

* Go to the next sheet
* Go to the previous sheet
* Go to a specific sheet (if selected you'll see a list of sheets you can select from)
* Go to a story (if selected you'll see a list of stories you can select from)
* Open website (if selected, you'll have to enter the URL in the appearing text box)

### Actions
You can furthermore define up to two action which will be executed before the navigation behavior will be performed.

First enable this option:

> ![](https://raw.githubusercontent.com/stefanwalther/sense-navigation/master/docs/images/sense_navigation_actions_enable.png)

Then select from the list of predefined actions:

> ![](https://raw.githubusercontent.com/stefanwalther/sense-navigation/master/docs/images/sense_navigation_actions.png)

Depending on the selected action you'll see additional settings you can define, e.g. define the name of a variable and its value:

> ![](https://raw.githubusercontent.com/stefanwalther/sense-navigation/master/docs/images/sense_navigation_actions_settings.png)

As soon as you have defined the first action, you will also be able to define a second action.

## Compatibility
**sense-navigation** is designed to work with Qlik Sense 2.1.1 or higher.
If you use the extension in an older version of Qlik Sense some functionality (like navigating to another sheet, etc.) will simply not work because the [Capability APIs](https://help.qlik.com/sense/2.1/en-US/developer/Subsystems/APIs/Content/mashup-api-reference.htm) used in this extension are not available in earlier versions.

## Room for improvement / contribution
* Allow to add **additional styles for the button** (very similar to [sense-themable-kpi-tile](https://github.com/stefanwalther/sense-themable-kpi-tile))
* Allow templates for buttons ([see here](https://github.com/stefanwalther/sense-navigation/issues/14))
* **Additional actions**, e.g.
	* Reload the app
	* Opening another app and pass the current selections to the app (similar to "document chaining in QlikView")
* Allow icons instead of images ([see here](https://github.com/stefanwalther/sense-navigation/issues/37))
* Select fields instead of defining fields in the expression editor ([see here](https://github.com/stefanwalther/sense-navigation/issues/25))
	
Is there **anything else you'd like to see** in this visualization extension?

* Don't hesitate to add the feature and create a pull request!
* You don't have the time or skills to implement this specific feature? No problem, [drop a note here](https://github.com/stefanwalther/sense-navigation/issues).

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/stefanwalther/sense-navigation/issues).
The process for contributing is outlined below:

1. Create a fork of the project
2. Work on whatever bug or feature you wish
3. Create a pull request (PR)

I cannot guarantee that I will merge all PRs but I will evaluate them all.

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

## Author
**Stefan Walther**

* [qliksite.io](http://qliksite.io)  
* [twitter/waltherstefan](http://twitter.com/waltherstefan)  
* [github.com/stefanwalther](http://github.com/stefanwalther)  

## License
Released under the MIT license.

## Change log
See [CHANGELOG.yml](https://github.com/stefanwalther/sense-navigation/blob/master/CHANGELOG.yml)  

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on July 27, 2016._

