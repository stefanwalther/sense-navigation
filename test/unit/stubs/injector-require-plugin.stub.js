define(['angular'], function (angular) {

  return {

    load: function (name, req, onload, config) {

      const injector = angular.injector(['ng']);
      const service = injector.get(name);

      onload(service);

    }
  };
});
