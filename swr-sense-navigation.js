/*
  Many users don't read the README ;-)
  Then it happens that they download the entire GitHub repository of this extension
   and then weird things happen as I created several builds for the extension in the
   ./build directory, see also here: https://github.com/stefanwalther/sense-extension-install#i-am-getting-error-xyz
  This all results in frustration:
   - On the user side: Because it does not work out of the box
   - On my side: Because I get the same "issues" again an again
  The solution:
   - I am providing a "default version" of this extension if somebody downloads and imports the entire repo
   - Showing a default helping message, what went wrong ...
 */

/* global define,window */
define(
  [
    'jquery'
  ],
  function ($) { // eslint-disable-line max-params
    'use strict';

    return {

      support: {
        export: false,
        exportData: false,
        snapshot: false
      },
      initialProperties: {},
      snapshot: {canTakeSnapshot: false},
      paint: function ($element, layout) {
        var msg = $(document.createElement('div'));

        let html = '<strong>Thanks for using <i>sense-navigation</i></strong>';
        html += '<br/><br/>';
        html += '<div style="color:red;">Unfortunately something went wrong ...</div>';
        html += '<br/>';
        html += '<strong>Resolution:</strong>';
        html += '<ul style="padding: 10px; margin-left: 20px;">'
        html += '<li>Don\'t download the entire GitHub repository ...</li>';
        html += '<li><a href="https://github.com/stefanwalther/sense-extension-install#i-am-getting-error-xyz" target="_blank">See here to resolve the issue ...</a></li>';
        html += '</ul>';
        html += '<br/>';
        html += '<strong>Good luck!</strong>';

        msg.html(html);
        $element.html(msg);
      }
    };
  });
