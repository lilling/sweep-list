export class HashedArray<T> {
    hash: { [index: string]: number };

    constructor(public array: T[], private idField: string) {
        this.hash = {};

        array.forEach((item, index) => {
            this.hash[item[idField]] = index;
        });
    }

    addItem(item: T): HashedArray<T> {
        return this.addItems([item]);
    }

    addItems(items: T[]): HashedArray<T> {
        return new HashedArray([
            ...this.array,
            ...items
        ], this.idField);
    }

    deleteItem(id: any): HashedArray<T> {
        return this.deleteItems([id]);
    }

    deleteItems(ids: any[]): HashedArray<T> {
        let newArray = [...this.array];
        ids.forEach(id => {
            const index = this.hash[id];
            newArray = [
                ...newArray.slice(0, index),
                ...newArray.slice(index + 1, newArray.length - 1)
            ];
        });

        return new HashedArray(newArray, this.idField);
    }

    getItem(id): T {
        return this.getItems([id])[0];
    }

    getItems(ids: any[]): T[] {
        return ids.reduce((result, id) => {
            result.push(this.array[this.hash[id]]);
            return result;
        }, []);
    }
}
