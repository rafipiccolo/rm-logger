var Logger = require('./index.js')
var config = {
    console: true,
    httppassword: 'XXX',
    padSize: 20,
};
var logger = new Logger(config);

// logger.info('test', 'test', {detail: 'blabla'});

// logger.info('test', 'test', {err: new Error('test')});

// logger.info('test', 'test', () => console.log('callback'));

logger.ban('test', 'test');
