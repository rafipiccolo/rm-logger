# Description

log data to console & my custom monitoring server

# install

	$> npm install raf-logger

# Usage

    logger[level](key, message);
    logger[level](key, message, object);
    logger[level](key, message, callback);
    logger[level](key, message, object, callback);

# Exemple

    var Logger = require('./index.js')
    var config = {
        console: true,
        httppassword: 'XXX',
        padSize: 0,
    };
    var logger = new Logger(config);

    logger.info('test', 'test', {detail: 'blabla'});
    logger.info('test', 'test', {err: new Error('test)});
    logger.info('test', 'test', function() {
        // all logged, do something if you want
    });

# Run

    $> node exemple.js
    2019-09-17T11:13:02.819Z test test

# Config

* console : activate console logging
* httppassword : activate logging to my custom server
* padSize : pad "level:key" on X characters
