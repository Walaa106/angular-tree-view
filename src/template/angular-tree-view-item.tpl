<ul class="tree-view-group">
    <li ng-repeat="data in datas" ng-class="{expanded: isExpanded(data)}" ng-show="isFiltered(data)">
        <a ng-class="{checked: isChecked(data)}" ng-click="toggleChecked(data, $event)">
            <span ng-class="getIcon(data)" ng-click="toggleExpanded(data, $event)"></span>
            {{ data[displayProperty] }}
        </a>
        <tree-view-item
        ng-if="data[childrenProperty]"
        datas="data[childrenProperty]"
        ></tree-view-item>
    </li>
</ul>