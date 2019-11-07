(function () {
    'use strict';

    // Usage:
    // Card image loader and viewer.
    // Creates:
    // Call by qulity-verification.

    window.app
        .component('imageLoader', {
            template: require('./image-loader.html'),
            controller: _,
            controllerAs: '$ctrl',
            bindings: {
                upload: '&',
            },
        });

    _.$inject = ['$scope'];
    function _($scope) {
        let $ctrl = this;
        $ctrl.$onInit = () => {
            $scope.$watch('imgFile', () => {
                if ($scope.imgFile)
                    $scope.imgLink = window.URL.createObjectURL($scope.imgFile[0]);
            });
        };
    }
})();