(function () {
    'use strict';

    window.app
        .service('ContainerRestService', ContainerRestService);

    ContainerRestService.$inject = ['$http', 'CONFIG'];
    function ContainerRestService($http, CONFIG) {
        this.findUrl = findUrl;

        const url = CONFIG.API;

        function findUrl() {
            console.log('testing', url);
        }
    }
})();