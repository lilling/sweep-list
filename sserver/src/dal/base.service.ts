import { DbGetter } from './DbGetter';

export abstract class BaseService<T> {
    constructor(protected table: string) {}
    async getItem(id: number, id_field: string): Promise<T> {
        const db = DbGetter.getDB();
        const q = `'select * from sweepimp.${this.table} where ${id_field} = ${id}`;
        try {
            const data = await db.each<T>(q, [], null);
            return data[0];
        } catch (error) {
            console.log('failed to query db', error);
        }
    }

    async getAll() : Promise<T[]> {
        const db = DbGetter.getDB();
        const q = `'select * from sweepimp.${this.table}`;
        try {
            const data = await db.each<T>(q, [], null);
            return data;
        } catch (error) {
            console.log('failed to query db', error);
        }
    }
}