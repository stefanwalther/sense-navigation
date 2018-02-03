'use strict';

(function setupAndRun() { // eslint-disable-line func-names
  function run() {
    requirejs(window.awFiles, function () {
      if (window.awDevtools) {
        // We need to wait for Chrome to open the `devtools`
        setTimeout(function () {
          mocha.run();
        }, 200);
        return;
      }
      mocha.run();
    });
  }
  requirejs(['./requirejs-config'], run);
})();
