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
        if (obj.hasOwnProperty(key)) {
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
    getLastSheet: function (qlik, app) {
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
    }
  };

  return Utils;
});

