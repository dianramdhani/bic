(function () {
    'use strict';

    window.app
        .config(UserRoute);

    UserRoute.$inject = ['$stateProvider'];

    function UserRoute($stateProvider) {
        [
            { name: 'user.qualityVerification', url: 'bic-code-recognition', component: 'qualityVerification' },
            { name: 'user.videoStreaming', url: 'video-streaming', component: 'videoStreaming' },
        ]
            .forEach(state => $stateProvider.state(state));
    }
})();