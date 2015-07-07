'use strict';

var mu = require('mu2');
var fs = require('fs');
var Config = require('./config.js');


function template(options, callback) {
	var config = new Config(__dirname + '/../confs', options.configFile);
	var templatePath = __dirname + '/../templates/' + options.templateFile;
	var outputStream = fs.createWriteStream(options.outputPath);
	outputStream.on('finish', callback);

	var readStream = mu.compileAndRender(templatePath, config.getAll());
	readStream.pipe(outputStream);
}

module.exports.template = template;
