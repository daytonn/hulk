class Store {
    constructor() {
        this.data = new Map();
    }

    /**
     * Adds a value to a list at the given key
     * @param {string} key - The key to store the list under
     * @param {any} value - The value to add to the list
     * @returns {string} - The unique ID of the added item
     */
    add(key, value) {
        if (!this.data.has(key)) {
            this.data.set(key, []);
        }

        const list = this.data.get(key);
        const id = crypto.randomUUID();

        const item = {
            ...value,
            id
        };

        list.push(item);
        return id;
    }

    /**
     * Deletes an item from a list at the given key
     * @param {string} key - The key of the list to delete from
     * @param {string} id - The ID of the item to delete
     * @returns {boolean} - True if the item was found and deleted, false otherwise
     */
    delete(key, id) {
        if (!this.data.has(key)) {
            return false;
        }

        const list = this.data.get(key);
        const index = list.findIndex(item => item.id === id);

        if (index === -1) {
            return false;
        }

        list.splice(index, 1);
        return true;
    }

    /**
     * Gets a list at the given key
     * @param {string} key - The key of the list to get
     * @returns {Array|undefined} - The list if it exists, undefined otherwise
     */
    get(key) {
        return this.data.get(key);
    }

    /**
     * Gets all keys in the store
     * @returns {Array} - Array of all keys in the store
     */
    keys() {
        return Array.from(this.data.keys());
    }
}

export default Store;
