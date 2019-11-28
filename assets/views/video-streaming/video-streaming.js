(function () {
    'use strict';

    // Usage:
    // Video streaming view.

    window.app
        .component('videoStreaming', {
            template: require('./video-streaming.html'),
            controller: _,
        });

    _.$inject = ['$scope', '$interval', '$compile', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder', 'VideoRestService', 'ContainerRestService', 'UtilService'];
    function _($scope, $interval, $compile, $filter, DTOptionsBuilder, DTColumnBuilder, VideoRestService, ContainerRestService, UtilService) {
        const
            videoInit = () => {
                $scope.start = false;
                $scope.videoFrameUrl = '';
                $scope.form = {
                    path: '',
                    save: false
                };
                VideoRestService.stop();
            },
            tableInit = () => {
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('ajax', {
                        url: ContainerRestService.findUrl(),
                        dataFilter: (data) => {
                            data = angular.fromJson(data);
                            return angular.toJson({
                                recordsTotal: data.totalElements,
                                recordsFiltered: data.totalElements,
                                data: data.content
                            });
                        },
                        dataSrc: 'data',
                        data: (data) => {
                            let params = {
                                limit: data.length,
                                page: data.start / data.length
                            };
                            if (data.order.length !== 0) {
                                params['sortBy'] = data.columns[data.order[0].column].data;
                                params['sortOrder'] = data.order[0].dir;
                            }
                            return params;
                        }
                    })
                    .withOption('processing', true)
                    .withOption('serverSide', true)
                    .withOption('searching', false)
                    .withOption('lengthMenu', [10, 20, 30])
                    .withOption('order', [[1, 'desc']])
                    .withOption('createdRow', (row, _, __) => { $compile(angular.element(row).contents())($scope); })
                    .withOption('language', { search: 'Date' })
                    .withPaginationType('simple_numbers');
                $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).withTitle('')
                        .renderWith((data, _, __, ___) => `<img src="${ContainerRestService.imageUrl({ id: data.id })}" style="height: 100px">`),
                    DTColumnBuilder.newColumn('date').withTitle('Date')
                        .renderWith((data, _, __, ___) => $filter('date')(data, 'medium')),
                    DTColumnBuilder.newColumn('code').withTitle('Code')
                ];
                $scope.dtInstance = {};
            };
        let $ctrl = this,
            interval;
        $ctrl.$onInit = () => {
            videoInit();
            tableInit();
        };

        $scope.toggle = () => {
            $scope.form['processingInterval'] = 1000;
            $scope.start = !$scope.start;
            if ($scope.start) {
                UtilService.trLoadingProcess(async () => {
                    await VideoRestService.start({ path: $scope.form.path, save: $scope.form.save, processingInterval: $scope.form.processingInterval });
                    $scope.videoFrameUrl = VideoRestService.getFrameUrl();
                    interval = $interval(() => {
                        $scope.videoFrameUrl = VideoRestService.getFrameUrl();
                        if ($scope.form.save) {
                            $scope.dtInstance.reloadData();
                        }
                    }, $scope.form.processingInterval);
                });
            } else {
                VideoRestService.stop();
                $interval.cancel(interval);
            }
        };
    }
})();   