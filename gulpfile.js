var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); // gulp相關套件的共同變數，使用 $.
var autoprefixer = require('autoprefixer'); // 根據設定browser的版本，增加前綴
var mainBowerFiles = require('main-bower-files'); // 用來領取bower引入的套件
var browserSync = require('browser-sync').create(); // 同步開網頁
var gulpSequence = require('gulp-sequence'); // 自訂task流程

// 執行gulp時，--env的預設值
var envOptions = {
	string: 'env', //設定參數
	default: { env: 'develop'} //預設為開發環境
}

 // 壓縮檔案，搭配 gult-if 使用
var options = require('minimist')(process.argv.slice(2), envOptions); // 取出 --env 設的值
console.log(options);

// 刪除暫存及發佈的資料夾
gulp.task('clean', function () {
    return gulp.src(['./.tmp', './public'], {read: false})
        .pipe($.clean());
});

// 範例，考備檔案
gulp.task('copyHTML', function() {
	return gulp.src('./source/**/*.html')
			.pipe(gulp.dest('./public/'));
});

// 將jade轉成html
gulp.task('jade', function() {
  // var YOUR_LOCALS = {};
 
  gulp.src('./source/jade/**/*.jade')
  	.pipe($.plumber()) // code出錯時，gulp流程仍跑完
    .pipe($.jade({
      pretty: true // 出來的html不縮排
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.stream()); // 網頁同步監視    
});

//將sass轉成css
gulp.task('sass', function () {
    var plugins = [
        autoprefixer({browsers: ['last 3 version', '> 5%']}), // 設定加前綴的browser版本
    ];

	return gulp.src('./source/sass/**/*.sass')
  	.pipe($.plumber()) // code出錯時，gulp流程仍跑完
    .pipe($.sourcemaps.init()) // 開發檢查時，顯示原始code位置
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss(plugins)) // 引入前綴
    .pipe($.if(options.env === 'production', $.cleanCss())) // 要發佈時才壓縮
    .pipe($.sourcemaps.write('.')) // 對應上方sourcemaps
    .pipe(gulp.dest('./public/css/'))
    .pipe(browserSync.stream()); // 網頁同步監視
});

// 將js轉成js
gulp.task('babel', () =>
    gulp.src('./source/js/**/*.js')
        .pipe($.sourcemaps.init()) // 開發檢查時，顯示原始code位置
        .pipe($.babel({
            presets: ['env']
        }))
        .pipe($.concat('all.js')) // 合併為一隻js
        .pipe($.if(options.env === 'production', $.uglify({
        	compress: {
        		drop_console: true
        	}
        }))) // 要發佈時才壓縮，去除console.log
        .pipe($.sourcemaps.write('.')) // 對應上方sourcemaps
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.stream()) // 網頁同步監視
);

// 複製bower引入的套件至暫存位置
gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('./.tmp/vendors'))
});

// 再將暫存的套件copy至發佈的資料夾
gulp.task('vendorJs', ['bower'], function() {
    return gulp.src('./.tmp/vendors/**/*.js')
	    .pipe($.order([
	      'jquery.js',
	      'bootstrap.js'
	    ])) // 設定合併時的順序
    	.pipe($.concat('vendors.js')) // 合併為一隻js
    	.pipe($.if(options.env === 'production', $.uglify())) // 要發佈時才壓縮
        .pipe(gulp.dest('./public/js'));
});

// 即時開網頁
gulp.task('browser-sync', function() {
    browserSync.init({
        server: { baseDir: "./public" }, // 啟動網頁的路徑
    	reloadDebounce: 2000 //重新整理的間隔必須超過 2 秒
    });
});

// 壓縮圖片
gulp.task('image-min', () =>
    gulp.src('./source/images/*')
        .pipe($.if(options.env === 'production', $.imagemin())) // 要發佈時才壓縮
        .pipe(gulp.dest('./public/images'))
);

// 監視路徑有修改的檔案，並執行對應的task
gulp.task('watch', function () {
  gulp.watch('./source/jade/**/*.jade', ['jade']);
  gulp.watch('./source/sass/**/*.sass', ['sass']);
  gulp.watch('./source/js/**/*.js', ['babel']);
});

// 部屬到github
gulp.task('deploy', function() {
  return gulp.src('./public/**/*')
    .pipe($.ghPages());
});

// 需發佈前，檔案的task流程
gulp.task('build', gulpSequence('clean', 'jade', 'sass', 'babel', 'vendorJs', 'image-min'));

// 開發時，gulp的流程
gulp.task('default', ['jade', 'sass', 'babel', 'vendorJs', 'image-min', 'browser-sync', 'watch']);


