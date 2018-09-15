/* global define */
define(['qlik'], function (qlik) {

  const Utils = {

    splitToStringNum: function (str, sep) {
      let a = str.split(sep);
      for (let i = 0; i < a.length; i++) {
        if (!isNaN(a[i])) {
          a[i] = Number(a[i]);
        }
      }
      return a;
    },

    fixUrl: function (url) {
      if (url.startsWith('http://') || url.startsWith('https://') || (url.startsWith('mailto://'))) {
        return url;
      }
      return 'http://' + url;
    },

    isEmpty: function (obj) {
      for (let key in obj) {
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
     * @param p - Object
     * @returns {function(*=): *}
     */
    get: function (p, o) {
      return p.reduce(function (xs, x) {
        return xs && xs[x] ? xs[x] : null;
      }, o);
    },

    getAppList: function () {

      const promise = qlik.Promise;

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

    getFirstSheet: function (app) {
      const defer = qlik.Promise.defer();
      if (!app) {
        app = qlik.currApp();
      }

      app.getAppObjectList(function (data) {

        let sortedData = data.qAppObjectList.qItems.sort(function (a, b) {
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

    getLastSheet: function (app) {
      const defer = qlik.Promise.defer();
      if (!app) {
        app = qlik.currApp();
      }

      app.getAppObjectList(function (data) {
        let sortedData = data.qAppObjectList.qItems.sort(function (a, b) {
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

    getBookmarkList: function (opts) {
      const defer = qlik.Promise.defer();
      let app = Utils.get(['app'], opts);
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

    getFieldList: function (opts) {
      const defer = qlik.Promise.defer();
      let app = Utils.get(['app'], opts);
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

    /*
     * Return a list of values for the property panel.
     */
    getPPList: function (opts) {
      const defer = qlik.Promise.defer();
      let app = Utils.get(['app'], opts);
      if (!app) {
        app = qlik.currApp();
      }

      app.getList(Utils.get(['listType'], opts), function (data) {
        let sheets = [];
        let sortBy = (Utils.get(['sortBy'], opts) || 'rank');
        if (data && data.qAppObjectList && data.qAppObjectList.qItems) {
          let sortedData = data.qAppObjectList.qItems.sort(function (a, b) {
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

