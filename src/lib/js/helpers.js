/* global define */
define(['qlik'], function (qlik) {

  var Utils = {

    /**
     * Split a string with a list of number, delimited by a separator and return and array of numbers.
     * @param {string} str - The string to parse.
     * @param {char} sep - The separator.
     * @returns {Array|*|string[]} - Returns an array of numbers.
     */
    splitToStringNum: function (str, sep) {
      var a = str.split(sep);
      for (var i = 0; i < a.length; i++) {
        if (!isNaN(a[i])) {
          a[i] = Number(a[i]);
        }
      }
      return a;
    },

    /**
     * Ensures that the given Url starts with a proper protocol.
     * @param {string} url - The url to fix.
     * @returns {string} - The fixed url.
     */
    fixUrl: function (url) {
      if (url.startsWith('http://') || url.startsWith('https://') || (url.startsWith('mailto://'))) {
        return url;
      }
      return 'http://' + url;
    },

    /**
     * Checks whether an object is empty or not.
     * @param {object} obj - The object to check.
     * @returns {boolean} - Whether the object is empty or not.
     */
    isEmpty: function (obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) { // eslint-disable-line no-prototype-builtins
          return false;
        }
      }
      return true;
    },

    /**
     * Safely get a nested object.
     *
     * @see https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
     * @param {string[]} p  - An array of the names of the desired objects.
     * @param {object} o - The object to fetch items from.
     * @returns {object} - The resulting object or null.
     */
    get: function (p, o) {
      return p.reduce(function (xs, x) {
        return xs && xs[x] ? xs[x] : null;
      }, o);
    },

    /**
     * Get a list of apps.
     *
     * @returns {promise.Promise} - Returns a promise to a list of apps.
     */
    getAppList: function () {

      var promise = qlik.Promise;

      qlik.getGlobal().getAppList(function (items) {
        promise.resolve(items.map(function (item) {
          return {
            value: item.qDocId,
            label: item.qTitle
          };
        })
        );
      });
      return promise;
    },

    /**
     * Get the first sheet.
     *
     * @param {object} app - The app to use. If none is passed, `qlik.currApp()` will be used.
     * @returns {promise.Promise} - Returns a promise of a sheet.
     */
    getFirstSheet: function (app) {
      var defer = qlik.Promise.defer();
      if (!app) {
        app = qlik.currApp();
      }

      app.getAppObjectList(function (data) {

        var sortedData = data.qAppObjectList.qItems.sort(function (a, b) {
          return a.qData.rank - b.qData.rank;
        });
        if (sortedData.length > 0) {
          defer.resolve({
            id: sortedData[0].qInfo.qId,
            title: sortedData[0].qMeta.title
          });
        }
      });
      return defer.promise;
    },

    /**
     * Get the last sheet.
     *
     * @param {object} app - The app to use. If none is passed, `qlik.currApp()` will be used.
     * @returns {promise.Promise} - Returns a promise of a sheet.
     */
    getLastSheet: function (app) {
      var defer = qlik.Promise.defer();
      if (!app) {
        app = qlik.currApp();
      }

      app.getAppObjectList(function (data) {
        var sortedData = data.qAppObjectList.qItems.sort(function (a, b) {
          return b.qData.rank - a.qData.rank;
        });

        if (sortedData.length > 0) {
          defer.resolve({
            id: sortedData[0].qInfo.qId,
            title: sortedData[0].qMeta.title
          });
        }
      });
      return defer.promise;
    },

    /**
     * Get the list of bookmarks.
     *
     * @param {object} opts - The options to use.
     * @param {object} opts.app - The app to use. If none is passed, `qlik.currApp()` will be used.
     * @returns {promise.Promise} - Returns a promise, being resolved with an array of bookmarks.
     */
    getBookmarkList: function (opts) {
      var defer = qlik.Promise.defer();
      var app = Utils.get(['app'], opts);
      if (!app) {
        app = qlik.currApp();
      }

      app.getList('BookmarkList', function (items) {
        defer.resolve(items.qBookmarkList.qItems.map(function (item) {
          return {
            value: item.qInfo.qId,
            label: item.qData.title
          };
        }));
      });
      return defer.promise;
    },

    /**
     * Get the list of fields in the given app.
     *
     * @param {object} opts - The options to use.
     * @param {object} opts.app - The app to use. If none is passed, `qlik.currApp()` will be used.
     * @returns {promise.Promise} - Returns a promise, being resolved with an array of apps.
     */
    getFieldList: function (opts) {
      var defer = qlik.Promise.defer();
      var app = Utils.get(['app'], opts);
      if (!app) {
        app = qlik.currApp();
      }

      app.getList('FieldList', function (items) {

        defer.resolve(items.qFieldList.qItems.map(function (item) {
          return {
            value: item.qName,
            label: item.qName
          };
        }));
      });

      return defer.promise;
    },

    /**
     * Get a list of type X to be used in the property panel.
     * @param {object} opts - The options to use.
     * @returns {promise.Promise} - Returns a promise, being resolved with an array of type X.
     */
    getPPList: function (opts) {
      var defer = qlik.Promise.defer();
      var app = Utils.get(['app'], opts);
      if (!app) {
        app = qlik.currApp();
      }

      app.getList(Utils.get(['listType'], opts), function (data) {
        var sheets = [];
        var sortBy = (Utils.get(['sortBy'], opts) || 'rank');
        if (data && data.qAppObjectList && data.qAppObjectList.qItems) {
          var sortedData = data.qAppObjectList.qItems.sort(function (a, b) {
            return a.qData[sortBy] - b.qData[sortBy];
          });
          sortedData.forEach(function (item) {
            sheets.push({
              value: item.qInfo.qId,
              label: item.qMeta.title
            });
          });
          return defer.resolve(sheets);
        }
        return defer.reject('qItems is undefined (listType: ' + Utils.get(['listType'], opts) + ')');
      });
      return defer.promise;
    }
  };

  return Utils;
});

