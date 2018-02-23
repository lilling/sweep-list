/// <reference path='../app.controller.ts' />

const initOptions = {
    "host": "hard-plum.db.elephantsql.com",
    "port": 5432,
    "database": "hsrbfqoh",
    "user": "hsrbfqoh",
    "password": "OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM",
    // global event notification;
    error: (error, e) => {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
};

//const pgp = require('pg-promise');
//const cn = 'postgres://hsrbfqoh:OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM@hard-plum.db.elephantsql.com:5432/hsrbfqoh';
//const db = pgp(initOptions);

module.exports = db;