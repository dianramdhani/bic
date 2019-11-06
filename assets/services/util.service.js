(function () {
    'use strict';

    window.app
        .service('UtilService', UtilService);

    UtilService.$inject = ['$compile', '$rootScope', '$document'];
    function UtilService($compile, $rootScope, $document) {
        this.trLoading = trLoading;
        this.trLoadingProcess = trLoadingProcess;

        const loadingContainer = angular.element($document[0].body),
            loadingComponent = '<tr-loading></tr-loading>';
        let loadingScope, loadingCompile;
        /**
         * Loading for slow request.
         * @param {Boolean} show Required. True if you want to show loading.
         */
        function trLoading(show) {
            if (show === true) {
                loadingScope = $rootScope.$new();
                loadingCompile = $compile(loadingComponent)(loadingScope);
                loadingContainer.prepend(loadingCompile);
            } else {
                loadingScope.$destroy();
                loadingCompile.remove();
            }
        }

        async function trLoadingProcess(process) {
            trLoading(true);
            try {
                await process();
            } catch (error) {
                alert(error.statusText || error.xhrStatus);
                console.error(error);
            }
            trLoading(false);
        }
    }
})();