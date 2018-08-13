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
}