<ul class="tree-view-group">
	<li ng-repeat="data in datas" ng-class="{expanded: isExpanded(data)}" ng-show="isFiltered(data)">
		<a ng-class="{checked: isChecked(data)}" ng-click="toggleChecked(data, $event)">
			<span ng-class="getIcon(data)" ng-click="toggleExpanded(data, $event)"></span>
			{{ data[displayProperty] }}
		</a>
		<tree-view-item
		ng-if="data.children" 
		datas="data.children" 
		value-property="{{ valueProperty }}"
		display-property="{{ displayProperty }}"
		icon-leaf="{{ iconLeaf }}"
		icon-expand="{{ iconExpand }}"
		icon-collapse="{{ iconCollapse }}"
		helper-object="helperObject"
		></tree-view-item>
	</li>
</ul>