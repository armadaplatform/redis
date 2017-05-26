'use strict';

var templater = require('./libs/template.js');
var kexec = require('kexec');
var redisConfigPath = '/etc/redis/redis.conf';
var microserviceName = process.env.MICROSERVICE_NAME;
var relationship = (microserviceName.indexOf('master') != -1) ? 'master' : 'slave';
var options = {
    configFile: 'redis.' + relationship + '.conf.json',
    templateFile: 'redis.conf',
    outputPath: redisConfigPath
};

templater.template(options, function (err, res) {
    if (err) return err;

    kexec('redis-server', [redisConfigPath]);
});
