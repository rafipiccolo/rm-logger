var Logger = require('./index.js');
var config = {
    console: true,
    socketPassword: 'xxx',
    socketPort: '3000',
    socketHost: 'localhost',
    project: require('./package.json').name,
    padSize: 20,
};
var logger = new Logger(config);

logger.error('testicule', 'testicule', { detail: 'blabla' });
logger.error('testicule', 'testicule', { detail: 'blabla' });
logger.error('testicule', 'testicule', { detail: 'blabla' });
logger.error('testicule', 'testicule', { detail: 'blabla' });

// logger.info('test', 'test', {err: new Error('test')});

// logger.info('test', 'test', () => console.log('callback'));

// logger.ban('test', 'test');

// setInterval(function() {
//     // logger.error('test', 'test', () => console.log('callback'));
//     logger.getBans((err, data) => {
//         console.log('err', err);
//         console.log('data', data);
//     });
// }, 1000)
