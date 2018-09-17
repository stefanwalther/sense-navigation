**sense-navigation** is designed to work with Qlik Sense *September 2017* or higher.

This extension has been extensively tested with the following versions of Qlik Sense:

- Qlik Sense Desktop June 2018
- Qlik Sense Enterprise June 2018
- Qlik Sense Desktop September 2018
- Qlik Sense Enterprise June 2018

If you want to use _sense-navigation_ in older versions, install an older version than v1.0.

The following browsers have been tested:

- Internet Explorer 11
- Firefox
- Edge
- Chrome

### ***sense-navigation*** & Mashups

***sense-navigation*** it built to be used within the Qlik Sense Client.
Any usage in a mashup-based solution ***might work***, but there are many features in ***sense-navigation*** which can just never work in a mashup-based solution (e.g. "Go to next sheet", "Go to edit mode", etc.).
So use ***sense-navigation*** in a mashup-based solution only at your own risk!

### ***sense-navigation*** & DevHub

If you want use & modify the extension in DevHub, do the following:

- Use the file `./build/*_dev.zip`, this always represents the latest development build (so no minimized/uglified files, etc.)
