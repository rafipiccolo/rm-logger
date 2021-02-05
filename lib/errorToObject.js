'use strict';

module.exports = function enumerableError(err) {
    if (err instanceof Error) {
        var res = {};
        for (let i in err) res[i] = enumerableError(err[i]);

        var keys = ['name', 'message', 'detail', 'code', 'stack'];
        for (let i in keys) if (typeof err[keys[i]] != 'undefined') res[keys[i]] = err[keys[i]];

        return res;
    } else return err;
};
