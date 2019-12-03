(function () {
    'use strict';

    // Usage:
    // Video streaming view.

    window.app
        .component('videoStreaming', {
            template: require('./video-streaming.html'),
            controller: _,
        });

    _.$inject = ['$scope', '$interval', '$compile', '$filter', '$timeout', '$element', 'DTOptionsBuilder', 'DTColumnBuilder', 'VideoRestService', 'ContainerRestService', 'UtilService'];
    function _($scope, $interval, $compile, $filter, $timeout, $element, DTOptionsBuilder, DTColumnBuilder, VideoRestService, ContainerRestService, UtilService) {
        const
            delay = 500,
            stringify = (o) => JSON.stringify(o).replace(/"/g, '@').replace(/\\n/g, '#'),
            parse = (s) => JSON.parse(s.replace(/@/g, '"').replace(/#/, '\\n')),
            videoInit = () => {
                $scope.start = true;
                $scope.videoFrameUrl = '';
                $scope.form = {
                    path: '',
                    save: false
                };
                interval = $interval(async () => {
                    $scope.videoFrameUrl = VideoRestService.getFrameUrl();
                }, delay);
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
                    DTColumnBuilder.newColumn(null).withTitle('Image').notSortable()
                        .renderWith((data, _, __, ___) => `<img src="${ContainerRestService.imageUrl({ id: data.id })}" style="height: 100px" ng-click="openImg('${stringify(data)}')">`),
                    DTColumnBuilder.newColumn(null).withTitle('Date / Code').notSortable()
                        .renderWith((data, _, __, ___) => `
                            ${$filter('date')(data.date, 'medium')}
                            <br>
                            ${data.code}
                        `)
                ];
                $scope.dtInstance = {};
            };
        let $ctrl = this,
            interval,
            modalViewImage;
        $ctrl.$onInit = () => {
            videoInit();
            tableInit();
            $timeout(() => modalViewImage = $element.find('#modalViewImage'));
        };

        $scope.play = () => {
            UtilService.trLoadingProcess(async () => {
                $scope.form['processingInterval'] = delay;
                await $timeout(async () => {
                    await VideoRestService.start({ path: $scope.form.path, save: $scope.form.save, processingInterval: $scope.form.processingInterval });
                    interval = $interval(async () => {
                        $scope.videoFrameUrl = VideoRestService.getFrameUrl();
                        if ($scope.form.save) {
                            $scope.dtInstance.reloadData();
                        }
                    }, $scope.form.processingInterval);
                }, 1000);
                $scope.start = true;
            });
        };

        $scope.stop = () => {
            VideoRestService.stop();
            $interval.cancel(interval);
            $scope.start = false;
        };

        $scope.openImg = (data) => {
            $scope.imgView = parse(data);
            $scope.imgView['imgUrl'] = ContainerRestService.imageUrl({ id: $scope.imgView.id });
            modalViewImage.modal({ show: true });
        };
    }
})();   