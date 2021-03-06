export class HashedArray<T> {
    hash: { [index: string]: number };

    constructor(public array: T[], private idField: string) {
        this.hash = {};

        array.forEach((item, index) => {
            this.hash[item[idField]] = index;
        });
    }

    length() {
        return this.array.length;
    }

    addItem(item: T, sortFunction?: (a, b) => number): HashedArray<T> {
        return this.addItems([item], sortFunction);
    }

    addItems(items: T[], sortFunction?: (a, b) => number): HashedArray<T> {
        let newArray = [...this.array, ...items];
        if (sortFunction) {
            newArray.sort((a, b) => sortFunction(a, b));
        }

        return new HashedArray(newArray, this.idField);
    }

    deleteItem(id: any): HashedArray<T> {
        return this.deleteItems([id]);
    }

    deleteItems(ids: any[]): HashedArray<T> {
        const indexesToRemove = ids.map(id => this.hash[id]);
        const newArray = this.array.filter((item, index) => !indexesToRemove.includes(index));
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

    updateItem(updatedItem: T): HashedArray<T> {
        const index = this.hash[updatedItem[this.idField]];
        let newArray = [...this.array];
        newArray = [
            ...newArray.slice(0, index),
            updatedItem,
            ...newArray.slice(index + 1, newArray.length)
        ];
        return new HashedArray(newArray, this.idField);
    }
}
