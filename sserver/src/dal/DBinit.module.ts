/// <reference path='../app.controller.ts' />

import * as promise from 'bluebird';
import {IMain, IDatabase, IOptions} from 'pg-promise';

//import {IExtensions, UsersRepository, ProductsRepository} from './repos';

const initOptions/*: IOptions/*<IExtensions>*/ = {
    promiseLib: promise,
/*
    extend(obj: IExtensions, dc: any) {
        obj.users = new UsersRepository(obj, pgp);
        obj.products = new ProductsRepository(obj, pgp);
    }
*/
};

// Database connection parameters:
const config = {
    host: 'hard-plum.db.elephantsql.com',
    port: 5432,
    database: 'hsrbfqoh',
    user: 'hsrbfqoh',
    password: 'OASQR0O7qDLnHlIBgWcHiD_dKwz4dBoM'
};

// Loading and initializing pg-promise:
import * as pgPromise from 'pg-promise';

const pgp: IMain = pgPromise(initOptions);

// Create the database instance with extensions:
const db = /*<IDatabase<IExtensions> & IExtensions>*/pgp(config);

export = db;
