'use strict';

const co = require('co');
const cli = require('./lib/cli').create();
const options = cli.getArguments();
const chalk = require('chalk');
const log = console.log;
const logEpic = (epic) => log(chalk.bold('> ' + epic));

const Deis = require('./lib/deis');
const Heroku = require('./lib/heroku');
const deleteFolder = require('rimraf').sync;


co(function*() {
  const deis = Deis.create();

  logEpic('Connecting to Heroku');
  const heroku = yield Heroku.connectTo(options.herokuApiToken);

  logEpic('Cloning application from Heroku');
  const clonePath = yield heroku.cloneAppToTemp(options.herokuApp);

  logEpic('Get app configuration from Heroku');
  const herokuAppConfig = yield heroku.getAppConfig(options.herokuApp);

  logEpic('Create Deis application');
  yield deis.createApplication(options.deisApp);

  logEpic('Set app configuration');
  yield deis.setConfig(options.deisApp, herokuAppConfig);

  logEpic('Pushing application to Deis');
  yield deis.pushApplication(options.deisApp, clonePath);

  logEpic(chalk.green('Migration done successfully!'));

  log(`\n\n${chalk.bold(`Some useful commands:`)}`);
  log(`Open: ${chalk.dim(`deis open -a ${options.deisApp}`)}`);
  log(`Scale up: ${chalk.dim(`deis scale web=2 -a ${options.deisApp}`)}`);
  log(`Destroy: ${chalk.dim(`deis destroy --app=${options.deisApp} --confirm=${options.deisApp}`)}`);
}).catch(function(err) {
  log(`\n\n${chalk.red(`There was an error while migrating :(`)}\n\n`);
  log(err);
});


function onExit() {
    deleteFolder('tmp');
    process.exit();
}

process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('uncaughtException', onExit);


