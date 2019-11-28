(function () {
    'use strict';

    // Usage:
    // Video streaming view.

    window.app
        .component('videoStreaming', {
            template: require('./video-streaming.html'),
            controller: _,
        });

    _.$inject = ['$scope'];
    function _($scope) {
        let $ctrl = this;
        $ctrl.$onInit = () => { };
    }
})();