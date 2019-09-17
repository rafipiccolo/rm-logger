var Logger = require('./index.js')
var config = {
    console: true,
    password: 'XXX',
    http: true,
    padSize: 20,
};
var logger = new Logger(config);

logger.info('test', 'test', {detail: 'blabla'});
