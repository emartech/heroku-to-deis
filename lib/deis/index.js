const exec = require('../exec');
const _ = require('lodash');

class Deis {

  constructor(exec) {
    this._exec = exec;
  }


  *createApplication(appName) {
    yield this._exec(`deis create ${appName} --no-remote`);
  }


  *setConfig(appName, config) {
    yield this._exec(`deis config:set ${this._configToShellArguments(config)} --app ${appName}`);
  }


  *pushApplication(appName, cwd) {
    yield this._exec(`deis git:remote --app ${appName}`, { cwd, verbose: true });
    yield this._exec(`git push deis master`, { cwd, verbose: true });
  }


  _configToShellArguments(config) {
    const escapeValue = (value) => '\'' + value.replace(/[']/g, "'\\''") + '\'';
    const escapeKey = (key) => key.indexOf('_') === 0 ? 'INVALID' + key : key;
    const normalizeConfigItem = (value, key) => `${escapeKey(key)}=${escapeValue(value)}`;
    return _.map(config, normalizeConfigItem).join(' ');
  }


  static create() {
    return new Deis(exec);
  }
}

module.exports = Deis;
