(function () {
    'use strict';

    window.app
        .config(AppRoute);

    AppRoute.$inject = ['$stateProvider'];

    function AppRoute($stateProvider) {
        [
            { name: 'user', url: '', component: 'userContainer' },
        ]
            .forEach(state => $stateProvider.state(state));
    }
})();