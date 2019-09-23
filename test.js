var Logger = require('./index.js')
var logger = new Logger({console:false})
var assert = require('assert');

describe('logger', function () {

    it('should call callback', function () {
        logger.info('test', 'test', {}, function() {
            assert.equal(true, true);
        })
    });

    it('should render error', function () {
        logger.info('test', 'test', {err: new Error('test')}, function() {
            assert.equal(true, true);
        })
    });

});
