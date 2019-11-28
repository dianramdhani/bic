(function () {
    'use strict';

    window.app
        .service('VideoRestService', VideoRestService);

    VideoRestService.$inject = ['$http', 'CONFIG'];
    function VideoRestService($http, CONFIG) {
        this.start = start;
        this.stop = stop;
        this.getFrameUrl = getFrameUrl;

        const url = CONFIG.API;

        function start({ path, save, processingInterval }) {
            return $http.get(`${url}/video/start`, { params: { path, save, processingInterval } });
        }

        function stop() {
            return $http.get(`${url}/video/stop`);
        }

        function getFrameUrl() {
            return `${url}/video/frame?time=${(new Date()).toISOString()}`;
        }
    }
})();