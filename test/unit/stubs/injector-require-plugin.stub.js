define(['angular'], function (angular) {

  return {

    load: function (name, req, onload, config) {

      var injector = angular.injector(['ng']);
      var service = injector.get(name);

      onload(service);

    }
  };
});
