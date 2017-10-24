const gulp = require('gulp');
const path = require('path');
const dotenv = require('dotenv');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

dotenv.config({
  path: path.join(__dirname, './test.env')
});

gulp.task('lint', () => {
  gulp.src(['**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('test', () => {
  gulp.src(['**/test/*.test.js', '!node_modules/**'])
    .pipe(mocha({ reporter: 'spec', timeout: 5000 }))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      process.exit(1);
    });
});

gulp.task('test-debug', () => {
  gulp.src(['**/test/*.test.js', '!node_modules/**'])
    .pipe(mocha({ reporter: 'spec', inspectBrk: true }))
    .once('error', () => {
      process.exit(1);
    });
});

gulp.task('default', ['test']);
