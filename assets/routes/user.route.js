(function () {
    'use strict';

    window.app
        .config(UserRoute);

    UserRoute.$inject = ['$stateProvider'];

    function UserRoute($stateProvider) {
        [
            { name: 'user.qualityVerification', url: 'quality-verification', component: 'qualityVerification' },
        ]
            .forEach(state => $stateProvider.state(state));
    }
})();