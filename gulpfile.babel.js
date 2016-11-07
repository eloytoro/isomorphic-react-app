import gulp from 'gulp';
import requiredir from 'requiredir';
import 'babel-polyfill';


// Register all tasks exported from each module in
// gulp directory. It should be done by some gulp registry,
// but gulp-hub (and gulp 4 itself) is very raw.
// So, it is just a workaround.
const taskModules = requiredir('./scripts');

Object.keys(taskModules).forEach(module => {
  const tasks = taskModules[module];

  Object.keys(tasks).forEach(fnName => {
    const taskFn = tasks[fnName];
    const taskName = fnName === 'default' ? module : `${module}:${fnName}`;
    gulp.task(taskName, taskFn);
  });
});
