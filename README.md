# Description

log data to console & my custom monitoring server

# install

	$> npm install raf-logger

# Usage

    logger[level](key, message);
    logger[level](key, message, object);
    logger[level](key, message, callback);
    logger[level](key, message, object, callback);
    logger.metric(name, value);
    logger.getBans();

levels :
* info
* warn
* error
* ban

# Exemple

see [exemple.js](exemple.js)

# Run

    $> node exemple.js
    2019-09-17T11:13:02.819Z test test

# Config

* console : activate console logging
* padSize : pad "level:key" on X characters
* socketPassword : activate logging to my custom server
* socketPort : custom server port
* socketHost : custom server host
