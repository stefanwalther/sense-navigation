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

