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

The button can be easily styled nicely by selecting some of the predefined designs ([Leonardo UI](https://qlik-oss.github.io/leonardo-ui/) or [Bootstrap](https://getbootstrap.com/)) or modified with your custom CSS.

Furthermore ***sense-navigation*** offers the option to define a **chain of 1-n actions** which will be executed **before** the navigation happens.  

For example:

* Apply a bookmark
* Clear selections
* Lock selections
* Unlock selections
* Select value(s) in a field
* Select alternatives
* Select possible values in a field
* Set a variable value

See [here](./docs/actions.md) for a complete list of all available **20 actions**.

_Note: The main difference between version 0.x and 1.x of sense-navigation is that with v1.x you can define a chain of unlimited actions instead of just two._
