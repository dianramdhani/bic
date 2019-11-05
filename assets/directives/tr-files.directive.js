(function () {
    'use strict';

    window.app
        .directive('trFiles', trFiles);

    trFiles.$inject = [];
    function trFiles() {
        // Usage:
        // For input type file.
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            element.on('change', () => {
                let files = Array.from(element[0].files), label = '';
                files.forEach((file, i) => {
                    label = `${label}${file.name}`
                    if (i !== files.length - 1) {
                        label = `${label}, `
                    }
                });
                element.next('.custom-file-label').html(label);
                ngModel.$setViewValue(files);
            });
        }
    }
})();