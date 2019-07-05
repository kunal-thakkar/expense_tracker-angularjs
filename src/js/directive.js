app.directive('flot', function () {
    return {
        scope: { graphdata: '=flot', click: '&' },
        replace: false,
        link: function (scope, elm) {
            scope.$watch('graphdata', function (data) {
                if (!data.series || !data.options) return;
                $.plot(elm, data.series, data.options);
            }, true);
            elm.bind('plotclick', function (event, pos, item) {
                var callback = scope.click();
                callback(item);
                scope.$apply();
            });
            elm.bind('plotselected', function (event, ranges) {
                console.log([event, ranges]);
            });
        }
    };
});
app.directive('myTable', function () {
    return {
        restrict: 'E, A, C',
        link: function (scope, element, attrs) {
            var dataTable = $(element).DataTable(scope.options);
            $.fn.dataTable.ext.errMode = 'throw';
            scope.$parent.ctrl.dataTable = dataTable;
            element.on('click', 'tr', function(e){
                if ( $(this).hasClass('selected') ) {
                    $(this).removeClass('selected');
                    scope.$parent.ctrl.selectedRow = false;
                }
                else {
                    dataTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    scope.$parent.ctrl.selectedRow = dataTable.row(this);
                }
                //scope.$apply()
            });
            scope.$watch('options.data', function(newData){
                var data = newData || null;
                if (data) {
                    dataTable.clear();
                    dataTable.rows.add(data);
                    dataTable.draw();
                }
            }, true);
        },
        scope: {
            options: "="
        }
    };
});
