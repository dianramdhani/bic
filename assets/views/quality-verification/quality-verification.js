(function () {
    'use strict';

    // Usage:
    // Quality verification view.

    window.app
        .component('qualityVerification', {
            template: require('./quality-verification.html'),
            controller: _
        });

    _.$inject = ['$scope', '$compile', '$element', '$timeout', 'DTOptionsBuilder', 'DTColumnBuilder', 'ContainerRestService', 'UtilService'];
    function _($scope, $compile, $element, $timeout, DTOptionsBuilder, DTColumnBuilder, ContainerRestService, UtilService) {
        const
            stringify = (o) => JSON.stringify(o).replace(/"/g, '@').replace(/\\n/g, '#'),
            parse = (s) => JSON.parse(s.replace(/@/g, '"').replace(/#/, '\\n'));

        let $ctrl = this,
            modalEdit;
        $ctrl.$onInit = () => {
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
                .withOption('order', [[0, 'desc']])
                .withOption('createdRow', (row, _, __) => { $compile(angular.element(row).contents())($scope); })
                .withOption('language', { search: 'Date' })
                .withPaginationType('simple_numbers');
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').withTitle('')
                    .renderWith((data, _, __, ___) => `<img src="${ContainerRestService.imageUrl({ id: data })}" alt="" style="height: 200px">`),
                DTColumnBuilder.newColumn('date').withTitle('Date')
                    .renderWith((data, _, __, ___) => (new Date(data)).toString()),
                DTColumnBuilder.newColumn('code').withTitle('Code'),
                DTColumnBuilder.newColumn(null).withTitle('').notSortable().withClass('text-right')
                    .renderWith((data, _, __, ___) => `<button class="btn btn-primary tr-btn-table" ng-click="openEdit('${stringify(data)}')">Edit</button>`)
            ];
            $scope.dtInstance = {};

            $timeout(() => {
                modalEdit = $element.find('#modalEdit');
            });
        };

        $scope.upload = () => {
            UtilService.trLoadingProcess(async () => {
                await ContainerRestService.enter({ file: $scope.imgFile });
                $scope._imgFile = window.URL.createObjectURL($scope.imgFile[0]);
                $scope.dtInstance.reloadData();
                $scope.$apply();
                angular.element('.content-body').animate({ scrollTop: $element.find('table').offset().top }, 350);
            });
        };

        $scope.openEdit = (data) => {
            $scope.dataEdit = parse(data);
            modalEdit.modal({ show: true });
        };

        $scope.edit = async () => {
            await ContainerRestService.update({ data: $scope.dataEdit });
            $scope.dtInstance.reloadData();
            $scope.$apply();
            modalEdit.modal('hide');
        };
    }
})();