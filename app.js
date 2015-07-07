'use strict';

var templater = require('./libs/template.js');
var spawn = require('child_process').spawn;
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

    var redisProcess = spawn('redis-server', [redisConfigPath]);
    redisProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    redisProcess.stderr.on('data', function (data) {
        console.error('stderr: ' + data);
    });

    redisProcess.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });
});