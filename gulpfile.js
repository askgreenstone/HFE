var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    staticHash = require('gulp-static-hash'), //为文件添加版本号处理缓存
    colors = require('colors');//console.log 颜色

//缓存处理，添加版本号
gulp.task('static-hash-html', function() {
    gulp.src('web/*.html')
        .pipe(staticHash({
            asset: 'static',
            exts: ['js', 'css', 'png']
        }))
        .pipe(gulp.dest('web/'));

    gulp.src('mobile/*.html')
        .pipe(staticHash({
            asset: 'static',
            exts: ['js', 'css', 'png']
        }))
        .pipe(gulp.dest('mobile/'));

    gulp.src('coop/**/*.html')
        .pipe(staticHash({
            asset: 'static',
            exts: ['js', 'css', 'png']
        }))
        .pipe(gulp.dest('coop/'));

    gulp.src('common/**/*.html')
        .pipe(staticHash({
            asset: 'static',
            exts: ['js', 'css', 'png']
        }))
        .pipe(gulp.dest('common/'));
    console.log(colors.yellow('<----------static-hash-html task running!---------->'));
});

gulp.task('default' , function() {
    gulp.start('static-hash-html');
});

// 监听
gulp.task('watch', function() {

    // 监听web
    gulp.watch('web/**', ['static-hash-html']);

    // 监听mobile
    gulp.watch('mobile/**', ['static-hash-html']);

    // 监听coop
    gulp.watch('coop/**', ['static-hash-html']);

    // 监听common
    gulp.watch('common/**', ['static-hash-html']);

    // 建立即时重整服务器
    var server = livereload();

    // 监听所有位在 HFE/  目录下的档案，一旦有变动，便进行重整
    gulp.watch(['web/**']).on('change', function(file) {
        // console.log(file);
        server.changed(file.path);
    });
});



















