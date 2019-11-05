(function () {
    'use strict';

    // Usage:
    // User container.

    window.app
        .component('userContainer', {
            template: require('./user-container.html'),
            controller: ControllerController
        });

    ControllerController.$inject = ['$scope', '$rootScope'];
    function ControllerController($scope, $rootScope) {
        let $ctrl = this;
        $ctrl.$onInit = () => {
            $scope.menu = {
                sidebar: [
                    // {
                    //     type: 'title | link | has-sub-link',
                    //     label: '',
                    //     icon: '',
                    //     state: {
                    //         to: '',
                    //         params: {}
                    //     },
                    //     active: true
                    // },
                    {
                        type: 'link',
                        label: 'Quality Verification',
                        icon: 'monitor',
                        state: {
                            to: 'user.qualityVerification',
                            params: {}
                        },
                        active: true
                    },
                ]
            };

            // $scope.menu = $rootScope.global.menu || {
            //     sidebar: [
            //         // {
            //         //     type: 'title | link | has-sub-link',
            //         //     label: '',
            //         //     icon: '',
            //         //     state: {
            //         //         to: '',
            //         //         params: {}
            //         //     },
            //         //     active: true
            //         // },
            //         {
            //             type: 'link',
            //             label: 'Quality Verification',
            //             icon: 'monitor',
            //             state: {
            //                 to: 'user.qualityVerification',
            //                 params: {}
            //             },
            //             active: true
            //         },
            //     ]
            // };
        };
    }
})();