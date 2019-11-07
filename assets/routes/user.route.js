(function () {
    'use strict';

    window.app
        .config(UserRoute);

    UserRoute.$inject = ['$stateProvider'];

    function UserRoute($stateProvider) {
        [
            { name: 'user.qualityVerification', url: 'bic-code-recognition', component: 'qualityVerification' },
        ]
            .forEach(state => $stateProvider.state(state));
    }
})();