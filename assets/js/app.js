window.app = angular.module('BIC', ['ui.router', 'ngCookies', 'datatables']);

// RUN
(function () {
    'use strict';

    window.app
        .run(Run);

    Run.$inject = ['$state', '$rootScope', '$cookies', '$http'];
    function Run($state, $rootScope, $cookies, $http) {
        // $rootScope['global'] = {
        //     user: angular.fromJson($cookies.get('user')),
        //     menu: angular.fromJson($cookies.get('menu'))
        // } || {};
        // if (typeof $rootScope.global.user === 'undefined') {
        //     $state.go('login');
        // } else {
        //     // $http.defaults.headers.common = { token: $rootScope.global.user.token };
        //     $state.go('etl');
        // }
        $state.go('user');
    }
})();

// SERVICES
require('../services/container-rest.service');
require('../services/util.service');
require('../services/video-rest.service');

// ROUTES
require('../routes/app.route');
require('../routes/user.route');

// DIRECTIVES
require('../directives/tr-files.directive');

// COMPONENTS
require('../components/tr-wrapper/tr-wrapper');
require('../components/tr-loading/tr-loading');

// VIEWS
require('../views/user-container/user-container');
require('../views/quality-verification/quality-verification');
require('../views/quality-verification/image-loader/image-loader');
require('../views/video-streaming/video-streaming');