'use strict';
var _ = require('lodash');
var ConfigLoader = require('./config_loader.js');

function Config(basePath, configFileName) {
	this._config = {};
	this._loadConfigs(basePath, configFileName);
}

Config.prototype.getAll = function () {
	return _.cloneDeep(this._config);
};

Config.prototype.get = function (key) {
	if (!_.has(this._config, key)) {
		throw new Error('config key' + key + 'not exists');
	}
	return this._config[key];
};

Config.prototype._loadConfigs = function (basePath, configFileName) {
	var configLoader = new ConfigLoader(basePath, configFileName);
	this._config = configLoader.load();
};

module.exports = Config;