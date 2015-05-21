var gulp = require('gulp');
var ngTemplate = require('gulp-ng-template');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var eventStream = require('event-stream');
var order = require('gulp-order');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

gulp.task('build', function () {
    return eventStream.merge(
        gulp.src('src/js/angular-tree-view-item.js'),
        gulp.src('src/js/angular-tree-view.js'),
        createTemplate()
    )
    .pipe(order(['**/angular-tree-view-item.js', '**/angular-tree-view.js', '**/templates.js']))
    .pipe(concat('angular-tree-view.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('angular-tree-view.min.js'))
    .pipe(gulp.dest('dist'));
    	
});

gulp.task('css', function () {
    return gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist'))
    .pipe(minifyCss())
    .pipe(rename('angular-tree-view.min.css'))
    .pipe(gulp.dest('./dist'));
});

function createTemplate() {
    return gulp.src('src/template/*.tpl')
    .pipe(ngTemplate({
        moduleName: 'TreeView',
        standalone: true,
        filePath: './templates.js'
    })); 
}