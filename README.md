# Description

log data to console & my custom monitoring server

# install

	$> npm install raf-logger

# Exemple

    var Logger = require('./index.js')
    var config = {
        console: true,
        httppassword: 'XXX',
        padSize: 0,
    };
    var logger = new Logger(config);

    logger.info('test', 'test', {detail: 'blabla'});

# Run

    $> node exemple.js
    2019-09-17T11:13:02.819Z test test

# Config

* console : activate console logging
* httppassword : activate logging to my custom server
* padSize : pad "level:key" on X characters
