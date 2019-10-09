var Logger = require('./index.js')
var config = {
    console: true,
    socketPassword: 'xxx',
    project: require('./package.json').name,
    // socketPort: '443',
    // socketHost: 'localhost',
    padSize: 20,
};
var logger = new Logger(config);

// logger.info('test', 'test', {detail: 'blabla'});

// logger.info('test', 'test', {err: new Error('test')});

// logger.info('test', 'test', () => console.log('callback'));

// logger.ban('test', 'test');

setInterval(function() {
    // logger.error('test', 'test', () => console.log('callback'));
    logger.getBans((err, data) => {
        console.log('err', err);
        console.log('data', data);
    });
}, 1000)
