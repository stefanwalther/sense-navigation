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
      const promise = qlik.Promise;
      if (!app) {
        app = qlik.currApp();
      }

      app.getAppObjectList(function (data) {
        let sortedData = data.qAppObjectList.qItems.sort(function (a, b) {
          return a.qData.rank > b.qData.rank;
        });

        if (sortedData.length > 0) {
          return promise.resolve({
            id: sortedData[0].qInfo.qId,
            title: sortedData[0].qMeta.title
          });
        }
      });
      return promise;
    },
    getLastSheet: function (app) {
      const promise = qlik.Promise;
      if (!app) {
        app = qlik.currApp();
      }

      app.getAppObjectList(function (data) {
        let sortedData = data.qAppObjectList.qItems.sort(function (a, b) {
          return a.qData.rank < b.qData.rank;
        });

        if (sortedData.length > 0) {
          return promise.resolve({
            id: sortedData[0].qInfo.qId,
            title: sortedData[0].qMeta.title
          });
        }
      });
      return promise;
    },

    getSheetList: function (app) {
      const defer = qlik.Promise.defer();
      if (!app) {
        app = qlik.currApp();
      }

      app.getList('sheet', function (data) {
        let sheets = [];
        let sortedData = data.qAppObjectList.qItems.sort(function (a, b) {
          return a.qData.rank > b.qData.rank;
        });
        sortedData.forEach(function (item) {
          sheets.push({
            value: item.qInfo.qId,
            label: item.qMeta.title
          });
        });
        return defer.resolve(sheets);
      });
      return defer.promise;
    },

    getStoryList: function (app) {
      const defer = qlik.Promise.defer();
      if (!app) {
        app = qlik.currApp();
      }

      app.getList('story', function (data) {
        let stories = [];
        if (data && data.qAppObjectList && data.qAppObjectList.qItems) {
          data.qAppObjectList.qItems.forEach(function (item) {
            stories.push({
              value: item.qInfo.qId,
              label: item.qMeta.title
            });
          });
        }
        return defer.resolve(stories.sort(function (a, b) {
          return a.item.label > b.item.label;
        }));
      });
      return defer.promise;

    }
  };

  return Utils;
});

