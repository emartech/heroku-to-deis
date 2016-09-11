const argv = require('yargs');
const _ = require('lodash');

const cliVersion = require('../../package').version;

class CLI {

  initArguments() {
    this._argv = argv.version(() => cliVersion)
      .usage('Usage: $0 [options]')
      .option('heroku_api_token', {
        demand: false,
        description: `Heroku Api Token from the Settings page of the user's Profile. If it's not provided the tool try to get it from the Heroku Toolbelt application.`
      })
      .option('deis_controller', {
        demand: false,
        description: `Deis controller path (eg. http://deis.123.234.1.2.nip.io)`
      })
      .option('heroku_app', {
        demand: true,
        description: 'Source Heroku application name (eg. ems-my-app)'
      })
      .option('deis_app', {
        demand: true,
        description: 'Destination Deis application name to create (eg. my-app)'
      })
      .epilog('copyright 2016')
      .argv;
  }

  getArguments() {
    return _.mapKeys(this._argv, (v, key) => _.camelCase(key));
  }

  static create() {
    const cli = new CLI();
    cli.initArguments();
    return cli;
  }

}

module.exports = CLI;
