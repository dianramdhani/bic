(function () {
    'use strict';

    // Usage:
    // Video streaming view.

    window.app
        .component('videoStreaming', {
            template: require('./video-streaming.html'),
            controller: _,
        });

    _.$inject = ['$scope', '$interval', 'VideoRestService', 'UtilService'];
    function _($scope, $interval, VideoRestService, UtilService) {
        let $ctrl = this,
            interval;
        $ctrl.$onInit = () => {
            $scope.start = false;
            $scope.videoFrameUrl = '';
            $scope.form = {
                path: '',
                save: false
            };
            VideoRestService.stop();
        };

        $scope.toggle = () => {
            $scope.form['processingInterval'] = 1000;
            $scope.start = !$scope.start;
            if ($scope.start) {
                UtilService.trLoadingProcess(async () => {
                    await VideoRestService.start({ path: $scope.form.path, save: $scope.form.save, processingInterval: $scope.form.processingInterval });
                    interval = $interval(() => {
                        $scope.videoFrameUrl = VideoRestService.getFrameUrl();
                    }, $scope.form.processingInterval);
                });
            } else {
                VideoRestService.stop();
                $interval.cancel(interval);
            }
        };
    }
})();   