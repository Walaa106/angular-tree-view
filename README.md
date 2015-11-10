# angular-tree-view

### install
```
bower install angular-tree-view --save
```
### features
* infinite levels
* support promise data
* check all/uncheck all

### dependencies
* angular 1.3+
* angular-recursion
* icon font(bootstrap / font-awesome / other...)

### usage
* app
```javascript
angular.module('yourModule', ['TreeView']);
```
* in html
```html
<tree-view
    input-model="data"
    ng-model="value"
    value-property="{{ valueProperty }}"
    display-property="{{ displayProperty }}"
    filter-model="search"
    icon-leaf="{{ iconLeaf }}"
    icon-expand="{{ iconExpand }}"
    icon-collapse="{{ iconCollapse }}"
    ></tree-view>></tree-view>
```

### options
* input-model (array/promise) required
 
 your data to display, such as
 
    ```javascript
    // array
    $scope.data = [
        {id: '1', text: '1', children: [
            {id: '1-1', text: '1-1', children: [
            ...
            ]},
            {id: '1-2', text: '1-2}
        ]},
        {id: '2', text: '2'},
        {id: '3', text: '3'}
    ]
    // promise
    $scope.data = $http.get('dataLink').then(function(response) {
        // if success
        if (response.data.code === 200) {
            return response.data.data;
        }
        ...
        // if there is no return, will display nothing
    });
    ```
* ng-model required
 
 just normal ng-model, it's an array of valueProperty
 
    ```
    // result maybe
    undefined // if nothing is checked
    ['1', '2'] // if '1' and '2' is checked
    ```
* value-property optional
 
 the value property of your data
 
    ```
    default: 'id'
    ```
* display-property  optional
 
 the property to display
 
    ```
    default: 'text'
    ```
* filter-model optional

 the model to filter

* icon-leaf optional
    ```
    default: 'glyphicon glyphicon-file fa fa-file'
    ```

* icon-expand optional
    ```
    default: 'glyphicon glyphicon-minus fa fa-minus'
    ```

* icon-collapse optional
    ```
    default: 'glyphicon glyphicon-plus fa fa-plus'
    ```


