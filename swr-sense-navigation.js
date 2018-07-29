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
