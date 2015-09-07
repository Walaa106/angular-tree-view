/**
 * @file treeViewItem directive
 * @author 862802759@qq.com
 */
angular.module('TreeView', ['RecursionHelper']).directive('treeViewItem',
function (RecursionHelper) {

    return {
        replace: true,
        templateUrl: 'angular-tree-view-item.tpl',
        controller: function ($scope, $attrs) {
            $scope.$watch(function () {
                return $scope.$eval($attrs.datas);
            }, function (value) {
                $scope.datas = value;
            });
        },
        compile: function (element) {
            return RecursionHelper.compile(element);
        }
    };
});
