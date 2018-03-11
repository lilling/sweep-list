import { DbGetter } from '../dal/DbGetter';

export abstract class BaseService<T> {
    constructor(protected table: string) {}
    async getItem(id: number, id_field: string): Promise<T> {
        const db = DbGetter.getDB();
        const q = `SELECT *\n` +
                  `  FROM sweepimp.${this.table} WHERE ${id_field} = ${id}`;
        try {
            const data = await db.oneOrNone<T>(q);
            return data;
        } catch (error) {
            console.log('failed to query db', error);
        }
    }

    async getAll() : Promise<T[]> {
        const db = DbGetter.getDB();
        const q = `SELECT *\n` +
                  `  FROM sweepimp.${this.table}`;
        try {
            const data = await db.manyOrNone<T>(q);
            return data;
        } catch (error) {
            console.log('failed to query db', error);
        }
    }

/*    updateTable(table: string, source_user_account_id: number, target_user_account_id: number){
        const db = DbGetter.getDB();
        const q = `UPDATE sweepimp.$<table>\n` +
                  `   SET user_account_id = $<source_user_account_id>\n` +
                  ` WHERE user_account_id = $<target_user_account_id>`;
        try {
            db.none(q,{
                table: table,
                source_user_account_id: source_user_account_id,
                target_user_account_id: target_user_account_id
            });
        } catch (error) {
            console.log('failed to query db', error);
        }
    }*/
}