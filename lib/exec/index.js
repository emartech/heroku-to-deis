const exec = require('child-process-promise').exec;
const verboseMode = process.env.VERBOSE === 'true' || process.env.VERBOSE === '1';

module.exports = function*(command, options = {}) {
  const execution = exec(command, options);

  if (verboseMode || options.verbose) {
    execution.childProcess.stdout.on('data', (data) => console.log(data.toString()));
    execution.childProcess.stderr.on('data', (data) => console.log(data.toString()));
  }

  return (yield execution).stdout;
};
