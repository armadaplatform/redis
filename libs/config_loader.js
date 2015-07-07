'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var helper_functions = require('./helper_functions.js');

function ConfigLoader(basePath, configFileName) {
	this._basePath = basePath;
	this._configFileName = configFileName || 'app.js';
	this._config = {};
}

ConfigLoader.prototype.load = function () {
	var configPaths = this._getConfigsPaths();
	var _this = this;
	configPaths.forEach(function (configPath) {

		var filePath = path.join(configPath, _this._configFileName);
		if (fs.existsSync(filePath)) {
			_this._loadConfig(filePath);
		}
	});
	return this._config;
};

ConfigLoader.prototype._getGlobalConfigPath = function () {
	return this._basePath;
};

ConfigLoader.prototype._getEnvConfigPaths = function () {
	var env = helper_functions.getEnv();
	var _this = this;
	var configPaths = env.split('/');

	configPaths = configPaths.map(function (configPath, key) {
		if (key != 0) {
			configPath = path.join(configPaths[key - 1], configPath);
		}
		return path.join(_this._basePath, configPath);
	});
	return configPaths;
};

ConfigLoader.prototype._getLocalConfigPath = function () {
	return path.join(this._basePath, '/local');
};

ConfigLoader.prototype._isConfigFromArmadaAvailable = function () {
	return Boolean(process.env.CONFIG_PATH);
};

ConfigLoader.prototype._getConfigPathsFromArmada = function () {
	return process.env.CONFIG_PATH.split(':').reverse();
};

ConfigLoader.prototype._getConfigsPaths = function () {
	var configPaths = [];
	configPaths.push(this._getGlobalConfigPath());

	if (this._isConfigFromArmadaAvailable()) {
		configPaths = _.union(configPaths, this._getConfigPathsFromArmada());
	} else {
		configPaths = _.union(configPaths, this._getEnvConfigPaths());
		configPaths.push(this._getLocalConfigPath());
	}

	return configPaths;
};

ConfigLoader.prototype._loadConfig = function (filePath) {
	var config = require(filePath);
	this._mergeData(config);
};

ConfigLoader.prototype._mergeData = function (newConfig) {
	_.extend(this._config, newConfig);
};

module.exports = ConfigLoader;