(function () {
    'use strict';

    window.app
        .service('ContainerRestService', ContainerRestService);

    ContainerRestService.$inject = ['$http', 'CONFIG'];
    function ContainerRestService($http, CONFIG) {
        this.findUrl = findUrl;
        this.enter = enter;

        const url = CONFIG.API;

        function findUrl() {
            return `${url}/container`;
        }

        function enter({ file }) {
            let fd = new FormData();
            fd.append('file', file[0]);
            return $http.post(`${url}/container`, fd, {
                transformResponse: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        }
    }
})();