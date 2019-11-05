(function () {
    'use strict';

    // Usage:
    // Quality verification view.

    window.app
        .component('qualityVerification', {
            template: require('./quality-verification.html'),
            controller: _
        });

    _.$inject = ['$scope', 'ContainerRestService'];
    function _($scope, ContainerRestService) {
        let $ctrl = this;
        $ctrl.$onInit = () => {
            ContainerRestService.findUrl();
        };

        $scope.upload = () => {
            // $scope._imgStd = window.URL.createObjectURL($scope.imgStd[0]);
            // $scope._imgCheck = window.URL.createObjectURL($scope.imgCheck[0]);
            // $scope._imgRes = await ImageService.compareImagesAndDownload({ imgStd: $scope.imgStd, imgCheck: $scope.imgCheck });
            // $scope.$apply();
            $scope._imgFile = window.URL.createObjectURL($scope.imgFile[0]);
            // $scope.$apply();
        };
    }
})();