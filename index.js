var async = require('async');
var chalk = require('chalk');
var request = require('request');
var errorToObject = require('./lib/errorToObject');
var PrettyError = require('pretty-error');
var prettyError = new PrettyError();

module.exports = class Logger {

    constructor(config) {
        // concerne les logs
        config = config||{ console: true }
        this.console = config.console;
        this.httppassword = config.httppassword;
        this.padSize = config.padSize;
    }

    log(level, key, message, obj, callback) {
        if (typeof obj === 'function') {
            callback = obj;
            obj = null;
        }

        async.auto({
            http: ac => {
                if (!this.httppassword) return ac();
                if (level == 'info') return ac();

                if (obj && obj.err) obj.err = errorToObject(obj.err);

                this.call('POST', '/log', {
                    date: new Date().toJSON(),
                    message: key,
                    level: level,
                    key: key,
                    obj: obj,
                }, ac);
            },
            console: ac => {
                if (!this.console)
                    return ac();

                var s = key.padStart(this.padSize);
                if (level == 'warn') s = chalk.yellow(s);
                if (level == 'error') s = chalk.red(s);
                if (level == 'info') s = chalk.blue(s);
                if (level == 'ban') s = chalk.magenta(s);
                console.log((new Date()).toJSON() + ' ' +  s + ' ' + message);

                if (obj && obj.err) console.log(prettyError.render(obj.err));

                ac();
            }
        }, function () {
            if (callback)
                return callback();
        });
    }

    info(key, message, obj, callback) {
        this.log('info', key, message, obj, callback);
    }

    error(key, message, obj, callback) {
        this.log('error', key, message, obj, callback);
    }

    warn(key, message, obj, callback) {
        this.log('warn', key, message, obj, callback);
    }

    ban(key, message, obj, callback) {
        this.log('ban', key, message, obj, callback);
    }

    // push Metric
    sendMetric(name, value, callback) {
        this.call('POST', '/metric', { name: name, value: value }, callback);
    }

    // getBans
    getBans(callback) {
        this.call('GET', '/bans', {}, callback);
    }

    // generic request
    call(method, path, jsonbody, callback) {
        var params = {
            method: method,
            url: 'https://' + this.password + 'monitoring.raphaelpiccolo.com/api/v1' + path,
            agent: new require('https').Agent({ keepAlive: true }),
        }
        if (method == 'POST') params.json = jsonbody;
        request(params, function (err, response, body) {
            if (err) return console.log('logger http error ' + err.message);

            callback(null, body)
        });
    }
}
