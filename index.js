'use strict';

var async = require('async');
var chalk = require('chalk');
var errorToObject = require('./lib/errorToObject');
var net = require('net');
var PrettyError = require('pretty-error');
var prettyError = new PrettyError();
var ndjson = require('ndjson');

module.exports = class Logger {
    constructor(config) {
        config = config || {};
        this.console = typeof config.console === 'undefined' ? true : config.console;
        this.socketPassword = config.socketPassword;
        this.padSize = config.padSize;
        this.socketPort = config.socketPort || 3333;
        this.socketHost = config.socketHost || '127.0.0.1';
        this.project = config.project || require('os').userInfo().username;

        if (this.socketPassword) {
            this.socketConnect();
        }
    }

    socketConnect() {
        this.socket = new net.Socket();
        this.socket.unref();
        this.socket.connect(this.socketPort, this.socketHost);
        this.socket.write(`${JSON.stringify({ type: 'auth', password: this.socketPassword })}\n`);

        this.socket.on('error', (err) => {
            if (err) console.error(`logger socket error ${err.message}`);

            this.socket.end();
            this.socket = null;
            var timeout = setTimeout(() => {
                this.socketConnect();
            }, 1000);
            timeout.unref();
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

    log(level, key, message, obj, callback) {
        if (typeof obj === 'function') {
            callback = obj;
            obj = null;
        }

        async.auto(
            {
                socket: (ac) => {
                    if (!this.socketPassword) return ac();
                    if (level == 'info') return ac();

                    if (obj && obj.err) obj.err = errorToObject(obj.err);

                    this.call(
                        {
                            type: 'log',
                            project: this.project,
                            date: new Date().toJSON(),
                            message,
                            level,
                            key,
                            obj,
                        },
                        ac
                    );
                },
                console: (ac) => {
                    if (!this.console) return ac();

                    // render normal console log
                    var s = key.padStart(this.padSize);
                    if (level == 'warn') console.error(`${new Date().toJSON()} ${chalk.yellow(s)} ${message} ${obj ? JSON.stringify(obj) : ''}`);
                    if (level == 'error') console.error(`${new Date().toJSON()} ${chalk.red(s)} ${message} ${obj ? JSON.stringify(obj) : ''}`);
                    if (level == 'info') console.log(`${new Date().toJSON()} ${chalk.blue(s)} ${message} ${obj ? JSON.stringify(obj) : ''}`);
                    if (level == 'ban') console.log(`${new Date().toJSON()} ${chalk.magenta(s)} ${message} ${obj ? JSON.stringify(obj) : ''}`);

                    // render nested errors
                    if (obj) {
                        var err = obj.err;
                        while (err) {
                            console.error(prettyError.render(err));
                            err = err.err;
                        }
                    }

                    ac();
                },
            },
            function () {
                if (callback) return callback();
            }
        );
    }

    callConnect(obj, callback) {
        if (!callback) callback = () => {};

        var call = 0;
        var realcallback = callback;
        callback = function (err, data) {
            call++;
            if (call == 1) realcallback(err, data);
        };
        var socket = new net.Socket();
        socket.connect(this.socketPort, this.socketHost);
        socket.write(`${JSON.stringify({ type: 'auth', password: this.socketPassword })}\n`, (err) => {
            if (err) return callback(err);
        });

        var x = socket.pipe(ndjson.parse());

        x.on('error', function (err) {
            socket.end(`${JSON.stringify({ type: 'error', message: 'bad json' })}\n`);
            return callback(err);
        });

        x.on('data', function (obj) {
            socket.end();
            callback(null, obj.data);
        });

        socket.on('error', callback);

        socket.write(`${JSON.stringify(obj)}\n`, function (err) {
            if (err) return callback(err);
        });
    }

    // push Metric
    metric(name, value, callback) {
        this.call({ type: 'metric', name, value }, callback);
    }

    // getBans
    getBans(callback) {
        this.callConnect({ type: 'getBans' }, callback);
    }

    // generic request
    call(obj, callback) {
        if (!callback) callback = () => {};
        if (!this.socket) return callback();

        this.socket.write(`${JSON.stringify(obj)}\n`, function (err) {
            if (err) console.error(`logger socket write error ${err.message}`);

            callback(null);
        });
    }
};
