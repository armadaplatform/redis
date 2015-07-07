"use strict";

var util = require('util');
var _ = require('lodash');

function getEnv() {
	if (process.env.MICROSERVICE_ENV) {
		return process.env.MICROSERVICE_ENV;
	}
	return 'dev';
}

function isProductionEnv() {
	return (getEnv() == 'production');
}

function getTimestamp() {
	return Math.round(Date.now()/1000);
}

function getMillitime() {
	var hrTime = process.hrtime();
	return Math.round(hrTime[0]*1000 + hrTime[1] / 1000000);
}


function toInt(value) {
	return parseInt(value, 10);
}

function packToArray(value) {
	if (!util.isArray(value)) {
		value = [value];
	}
	return value;
}

function isPositive(value) {
	value = parseFloat(value);
	return (value !== NaN && value > 0);
}

function lt(param, num) {
	return param < num;
}

function gt(param, num) {
	return param > num;
}

function lte(param, num) {
	return param <= num;
}

function gte(param, num) {
	return param >= num;
}

module.exports.getEnv = getEnv;
module.exports.isProductionEnv = isProductionEnv;
module.exports.getTimestamp = getTimestamp;
module.exports.getMillitime = getMillitime;
module.exports.toInt = toInt;
module.exports.packToArray = packToArray;
module.exports.isPositive = isPositive;
module.exports.lt = lt;
module.exports.gt = gt;
module.exports.lte = lte;
module.exports.gte = gte;