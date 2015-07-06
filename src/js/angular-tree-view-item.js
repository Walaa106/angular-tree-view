/**
 * @file treeViewItem directive
 * @author 862802759@qq.com
 */
angular.module('TreeView', ['RecursionHelper']).directive('treeViewItem',
function (RecursionHelper) {

    function link($scope) {
        $scope.getIcon = function (data) {
            if (!data.children) {
                return $scope.iconLeaf;
            }
            if ($scope.helperObject[data[$scope.valueProperty]].expanded === true) {
                return $scope.iconExpand;
            }
            return $scope.iconCollapse;
        };

        $scope.toggleExpanded = function (data, event) {
            $scope.helperObject[data[$scope.valueProperty]].expanded = !$scope.isExpanded(data);
            event.stopPropagation();
        };

        $scope.isExpanded = function (data) {
            return $scope.helperObject[data[$scope.valueProperty]].expanded;
        };

        $scope.isChecked = function (data) {
            return $scope.helperObject[data[$scope.valueProperty]].checked;
        };

        $scope.toggleChecked = function (data) {
            $scope.helperObject[data[$scope.valueProperty]].checked = !$scope.isChecked(data);
            calculateChecked(data);
        };

        $scope.isFiltered = function (data) {
            return getHelper(data).filtered !== false;
        };

        function getHelper(data) {
            return $scope.helperObject[data[$scope.valueProperty]];
        }

        function calculateChecked(data) {
            var helper = getHelper(data);

            calculateDown(helper);
            calculateUp(helper);
        }

        function calculateDown(helper) {

            if (helper.children) {
                for (var i = 0; i < helper.children.length; i++) {
                    getHelper(helper.children[i]).checked = helper.checked;
                    calculateDown(getHelper(helper.children[i]));
                }
            }
        }

        function calculateUp(helper) {
            if (helper.parent) {
                var checked = 0;
                for (var i = 0; i < helper.parent.children.length; i++) {
                    if (getHelper(helper.parent.children[i]).checked) {
                        checked++;
                    }
                }
                getHelper(helper.parent).checked = (checked === helper.parent.children.length);

                calculateUp(getHelper(helper.parent));
            }
        }
    }

    return {
        replace: true,
        scope: {
            datas: '=',
            valueProperty: '@',
            displayProperty: '@',
            iconLeaf: '@',
            iconExpand: '@',
            iconCollapse: '@',
            helperObject: '='
        },
        templateUrl: 'angular-tree-view-item.tpl',
        compile: function (element) {
            return RecursionHelper.compile(element, link);
        }
    };
});
