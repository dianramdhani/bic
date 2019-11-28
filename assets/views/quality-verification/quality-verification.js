require('./quality-verification.css');

(function () {
    'use strict';

    // Usage:
    // Quality verification view.

    window.app
        .component('qualityVerification', {
            template: require('./quality-verification.html'),
            controller: _
        });

    _.$inject = ['$scope', '$compile', '$element', '$timeout', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder', 'ContainerRestService', 'UtilService'];
    function _($scope, $compile, $element, $timeout, $filter, DTOptionsBuilder, DTColumnBuilder, ContainerRestService, UtilService) {
        let $ctrl = this,
            modalEdit,
            modalViewImage;

        const
            stringify = (o) => JSON.stringify(o).replace(/"/g, '@').replace(/\\n/g, '#'),
            parse = (s) => JSON.parse(s.replace(/@/g, '"').replace(/#/, '\\n')),
            imageLoaderReset = () => {
                const el = $element.find('#imageLoader');
                if (!el.is(':empty')) {
                    el.empty();
                }
                el.append($compile(`<image-loader upload="upload({imgFile})"></image-loader>`)($scope));
            };
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
                .withOption('order', [[1, 'desc']])
                .withOption('createdRow', (row, _, __) => { $compile(angular.element(row).contents())($scope); })
                .withOption('language', { search: 'Date' })
                .withPaginationType('simple_numbers');
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).withTitle('Image')
                    .renderWith((data, _, __, ___) => `<img src="${ContainerRestService.imageUrl({ id: data.id })}" alt="" style="height: 100px" ng-click="openImg('${stringify(data)}')">`),
                DTColumnBuilder.newColumn('date').withTitle('Date')
                    .renderWith((data, _, __, ___) => $filter('date')(data, 'medium')),
                DTColumnBuilder.newColumn('code').withTitle('Code'),
                DTColumnBuilder.newColumn(null).withTitle('').notSortable().withClass('text-center wd-50')
                    .renderWith((data, _, __, ___) => `<button class="btn btn-primary tr-btn-table" ng-click="openEdit('${stringify(data)}')">Edit</button>`)
            ];
            $scope.dtInstance = {};

            $timeout(() => {
                modalEdit = $element.find('#modalEdit');
                modalViewImage = $element.find('#modalViewImage');
                imageLoaderReset();
            });
        };

        $scope.upload = ({ imgFile }) => {
            UtilService.trLoadingProcess(async () => {
                const { data } = await ContainerRestService.enter({ file: imgFile });
                $scope.dtInstance.reloadData();
                imageLoaderReset();
                $scope.$apply();
                angular.element('.content-body').animate({ scrollTop: $element.find('table').offset().top }, 350);
                $timeout(() => $scope.openImg(stringify(JSON.parse(data))));
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

        $scope.openImg = (data) => {
            $scope.imgView = parse(data);
            $scope.imgView['imgUrl'] = ContainerRestService.imageUrl({ id: $scope.imgView.id });
            modalViewImage.modal({ show: true });
        }
    }
})();