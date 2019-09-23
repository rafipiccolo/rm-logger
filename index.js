var async = require('async');
var chalk = require('chalk');
var request = require('request');
var PrettyError = require('pretty-error');
var prettyError = new PrettyError();

module.exports = class Logger {

    constructor(config) {
        config = config||{ console: true }
        this.console = config.console;
        this.httppassword = config.httppassword;
        this.padSize = config.padSize;
    }

    log(level, key, message, obj, callback) {
        if (typeof obj === 'function') {
            obj = null;
            callback = obj;
        }

        async.auto({
            http: ac => {
                if (!this.httppassword) return ac();
                if (level == 'info') return ac();

                request({
                    url: 'https://' + this.httppassword + '@monitoring.raphaelpiccolo.com/fr/logger',
                    method: 'POST',
                    json: {
                        date: new Date().toJSON(),
                        message: key,
                        level: level,
                        key: key,
                        obj: obj,
                    },
                }, (err) => {
                    ac();
                });
            },
            console: ac => {
                if (!this.console)
                    return ac();

                var s = key.padStart(this.padSize);
                if (level == 'warn') s = chalk.yellow(s);
                if (level == 'error') s = chalk.red(s);
                if (level == 'info') s = chalk.blue(s);
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

}

