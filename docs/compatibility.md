**sense-navigation** is designed to work with Qlik Sense 2.1.1 or higher.
If you use the extension in an older version of Qlik Sense some functionality (like navigating to another sheet, etc.) will simply not work because the [Capability APIs](https://help.qlik.com/sense/2.1/en-US/developer/Subsystems/APIs/Content/mashup-api-reference.htm) used in this extension are not available in earlier versions.

### **sense-navigation** & Mashups

**sense-navigation** it built to be used within the Qlik Sense Client.
Any usage in a mashup-based solution might work, but there are many features in **sense-navigation** which can never work in a mashup-based solution (e.g. "Go to next sheet", "Go to edit mode", etc.).
So use **sense-navigation** in a mashup-based solution only at your own risk!
