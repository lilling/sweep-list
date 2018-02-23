var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://hsrbfqoh:OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM@hard-plum.db.elephantsql.com:5432/hsrbfqoh';
var db = pgp(connectionString);

// add query functions

module.exports = {
    getAllUsers: getAllUsers,
    getSingleUser: getSingleUser
};