angular.module('TreeView')
.directive('treeView', function (RecursionHelper, $q, $filter) {
    var filters = {
        filter: $filter('filter')
    };

	function link($scope, element) {
    	$scope.displayProperty = $scope.displayProperty || 'text';
    	$scope.valueProperty = $scope.valueProperty || 'id';
    	$scope.childrenProperty = $scope.childrenProperty || 'children';

    	$scope.iconLeaf = $scope.iconLeaf || 'glyphicon glyphicon-file fa fa-file';
    	$scope.iconExpand = $scope.iconExpand || 'glyphicon glyphicon-minus fa fa-minus';
    	$scope.iconCollapse = $scope.iconCollapse || 'glyphicon glyphicon-plus fa fa-plus';
    	
        var utils = {
            arrayMinus: function (source, target) {
                var source = source || [];
                var target = target || [];
                var result = [];
                for (var i = 0; i < source.length; i++) {
                    if (target.indexOf(source[i]) === -1) {
                        result.push(source[i]);
                    }
                }
                return result;
            }
        };

        var treeView = {
            status: 'pending',
            init: function () {
                var self = this;
                element.addClass('tree-view');
                this.bindEvents();
                this.refreshDatas();
            },
            refreshDatas: function () {
                this.initDatas().then(function (data) {
                    $scope.showDatas = angular.copy(data);
                    var helpers = self.createHelpers($scope.showDatas);
                    $scope.helperObject = helpers.obj;
                    $scope.helperArray = helpers.arr;
                    self.updateHelperByInput();
                    self.status = 'success';
                });
            },
            initDatas: function () {
                var deferred = $q.defer();

                if (angular.isFunction($scope.datas.then)) {
                    $scope.datas.then(function (data) {
                        deferred.resolve(data);
                    });
                } else {
                    deferred.resolve($scope.datas);
                }
                return deferred.promise;
            },
            updateHelperByInput: function (added, deleted) {
                var self = this;
                if (added) {
                    deleted.forEach(function (value) {
                        self.changeStateById(value, false);
                    });
                    added.forEach(function (value) {
                        self.changeStateById(value, true);
                    });
                } else {
                    angular.forEach($scope.ngModel, function (value) {
                        self.changeStateById(value, true);
                    });
                }
            },
            changeStateById: function (id, value) {
                $scope.helperObject[id].checked = value;
                this.calculateChecked($scope.helperObject[id].body);
                if (value) {
                    this.expandUp(id);
                }
            },
            bindEvents: function () {
                var self = this;

                // 当checked数据的数量变化时，ngModel也跟着变化
                $scope.$watch(function () {
                    var checked = 0;
                    angular.forEach($scope.helperObject, function (item) {
                        if (item.checked) {
                            checked++;
                        }
                    });
                    return checked;
                }, function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    var result = [];
                    angular.forEach($scope.helperObject, function (item) {
                        if (item.checked) {
                            result.push(item.body[$scope.valueProperty]);
                        }
                    });
                    result = self.deleteDuplicated(result);
                    if (result.length === 0) {
                        $scope.ngModel = undefined;
                    } else {
                        $scope.ngModel = result;
                    }
                });
                
                $scope.$watch('inputModel', function (newValue, oldValue) {
                    if (newValue === undefined) {
                        return;
                    }
                    self.refreshDatas();
                });
                
                $scope.$watch('ngModel', function (newValue, oldValue) {
                    if ((newValue === oldValue) || (self.status !== 'success')) {
                        return;
                    }
                    var deletedValues = utils.arrayMinus(oldValue, newValue);
                    var addedValues = utils.arrayMinus(newValue, oldValue); 

                    self.updateHelperByInput(addedValues, deletedValues);
                });

                $scope.$watch('filterModel', function (newValue, oldValue) {
                    if ((newValue === oldValue) || (self.status !== 'success')) {
                        return;
                    }
                    angular.forEach($scope.helperObject, function (item, key) {
                        item.filtered = false;
                    });
                    var result = filters.filter($scope.helperArray, {
                        text: newValue
                    });
                    result.forEach(function (value) {
                        self.getHelper(value.id).filtered = true;
                        self.filterUp(value.id);
                        self.expandUp(value.id);
                    });
                });
            },
            // 上层的全部为筛选状态
            filterUp: function (id) {
                var helper = this.getHelper(id);
                if (helper.parent) {
                    var parentId = this.getParentId(id);
                    this.getHelper(parentId).filtered = true;
                    this.filterUp(parentId);
                }
            },
            // 将上层的全部展开
            expandUp: function (id) {
                var helper = this.getHelper(id);
                if (helper.parent) {
                    this.getHelper(helper.parent).expanded = true;
                    this.expandUp(this.getParentId(id));
                }
            },
            collapseDown: function (id) {
                var helper = this.getHelper(id);
                helper.expanded = false;
                if (helper.children) {
                    for (var i = 0; i < helper.children.length; i++) {
                        this.collapseDown(helper.children[i][$scope.valueProperty]);
                    }
                }
            },
            deleteDuplicated: function (result) {
                var itemsHaveParent = [];
                // 找出有父层在内的
                for (var i = 0; i < result.length; i++) {
                    var parentId = this.getParentId(result[i]);
                    if (parentId && this.contains(result, parentId)) {
                        itemsHaveParent.push(result[i]);
                    }
                }
                // 删除这些内容
                return utils.arrayMinus(result, itemsHaveParent);
            },
            calculateChecked: function (data) {
                var helper = this.getHelper(data);

                this.calculateDown(helper);
                this.calculateUp(helper); 
            },
            calculateDown: function (helper) {
                if (helper.children) {
                    for (var i = 0; i < helper.children.length; i++) {
                        this.getHelper(helper.children[i]).checked = helper.checked;
                        this.calculateDown(this.getHelper(helper.children[i]));
                    }
                }
            },
            calculateUp: function (helper) {
                if (helper.parent) {
                    var checked = 0;
                    for (var i = 0; i < helper.parent.children.length; i++) {
                        if (this.getHelper(helper.parent.children[i]).checked) {
                            checked++;
                        }
                    }
                    this.getHelper(helper.parent).checked = (checked === helper.parent.children.length);

                    this.calculateUp(this.getHelper(helper.parent));
                }
            },
            getParentId: function (id) {
                var helper = this.getHelper(id);
                if (!helper.parent) {
                    return false;
                } else {
                    return this.getHelper(helper.parent).body[$scope.valueProperty];
                }
            },
            getHelper: function(input) {
                var id = input;
                if (angular.isObject(input)) {
                    id = input[$scope.valueProperty];
                }
                return $scope.helperObject[id];
            },
            contains: function (resourceArr, target) {
                return resourceArr.indexOf(target) !== -1;
            },
            // 递归推入所有对象建立双链表，并建立数组方便筛选
            createHelpers: function (value) {
                var obj = {},
                    arr = [];

                function createHelper(value, parent) {
                    if (!angular.isArray(value)) {
                        return;
                    }

                    for (var i = 0; i < value.length; i++) {
                        obj[value[i][$scope.valueProperty]] = {
                            body: value[i],
                            parent: parent,
                            children: value[i][$scope.childrenProperty]
                        };
                        arr.push({
                            text: value[i][$scope.displayProperty],
                            id: value[i][$scope.valueProperty]
                        });
                        if (value[i][$scope.childrenProperty]) {
                            createHelper(value[i][$scope.childrenProperty], value[i]);
                        }               
                    }
                }

                createHelper(value);

                return {
                    obj: obj,
                    arr: arr
                };
            }
        };

        treeView.init();
    }

	return {
		template: 'angular-tree-view.tpl',
		scope: {
			datas: '=inputModel',
			ngModel: '=',
            filterModel: '=',
			valueProperty: '@',
			displayProperty: '@',
			childrenProperty: '@',
            iconLeaf: '@',
            iconCollapse: '@',
            iconExpand: '@'
		},
		link: link	
	};
});