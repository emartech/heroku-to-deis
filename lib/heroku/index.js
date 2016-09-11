const HerokuClient = require('heroku-client')
const exec = require('../exec');
const path = require("path");
const appRoot = require('app-root-path').toString();


class Heroku {

  constructor(HerokuClient, exec, path, appRoot) {
    this._HerokuClient = HerokuClient;
    this._path = path;
    this._appRoot = appRoot;
    this._exec = exec;
  }


  *connect(herokuApiToken) {
    const token = herokuApiToken || (yield this._getTokenFromHerokuToolbelt());
    this._herokuClient = new this._HerokuClient({ token });
  }


  *cloneAppToTemp(appName) {
    const cloneURL = `ssh://git@heroku.com/${appName}.git`;
    const localPath = this._path.join(this._appRoot, "tmp") + '/' + appName;

    yield this._exec(`git clone ${cloneURL} ${localPath}`);

    return localPath;
  }


  *getAppConfig(herokuApp) {
    return yield this._herokuClient.get(`/apps/${herokuApp}/config-vars`);
  }


  *_getTokenFromHerokuToolbelt() {
    return (yield this._exec('heroku auth:token'));
  }


  static create() {
    return new Heroku(HerokuClient, exec, path, appRoot);
  }


  static *connectTo(herokuApiToken) {
    const heroku = Heroku.create();
    yield heroku.connect(herokuApiToken);
    return heroku;
  }

}

module.exports = Heroku;
