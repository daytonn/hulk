/**
 * @fileoverview Store Module - A data management layer for local storage and API synchronization
 *
 * This module provides a centralized store for managing application data with support for
 * local caching and external API synchronization. It implements a Map-based storage system
 * with specialized handling for different data types, particularly aliases.
 *
 * Key features:
 * - Local data caching with Map storage
 * - API synchronization for fetch/save operations
 * - Specialized alias management with group insertion
 * - CRUD operations with unique ID generation
 * - Type-safe key validation
 *
 * @module Store
 * @requires window.API - Global API object for external data operations
 *
 * @example
 * // Basic usage
 * import Store from './lib/store/index.js';
 *
 * const store = new Store();
 *
 * // Fetch data from API and cache locally
 * await store.fetch('aliases');
 *
 * // Add new items
 * const id = await store.add('aliases', {
 *   alias: 'ls',
 *   command: 'ls -la',
 *   group: 'File Operations'
 * });
 *
 * // Get data
 * const allAliases = await store.get('aliases');
 * const specificAlias = await store.get('aliases', id);
 *
 * // Save changes back to API
 * await store.save('aliases');
 *
 * @author Dayton Nolan
 * @version 1.0.0
 */

/**
 * Valid store keys that can be used for data storage
 * @constant {Array<string>}
 * @default
 */
const VALID_STORE_KEYS = ["aliases"]

/**
 * Mapping of store keys to their corresponding API fetch function names
 * @constant {Object<string, string>}
 * @default
 */
const STORE_KEY_FUNCTION_MAP = {
  aliases: "getAliases",
}

/**
 * Mapping of store keys to their corresponding API save function names
 * @constant {Object<string, string>}
 * @default
 */
const STORE_SAVE_KEY_FUNCTION_MAP = {
  aliases: "saveAliases",
}

/**
 * A data store class that manages local caching and API synchronization
 *
 * @class Store
 * @description Provides a centralized data management system with Map-based storage,
 * API integration, and specialized handling for different data types. Supports
 * CRUD operations with automatic ID generation and maintains data consistency
 * between local cache and external APIs.
 *
 * @example
 * const store = new Store();
 * await store.fetch('aliases'); // Load from API
 * const id = await store.add('aliases', newAlias); // Add locally
 * await store.save('aliases'); // Persist to API
 */
class Store {
  /**
   * Creates a new Store instance
   * @constructor
   * @description Initializes an empty Map for data storage
   */
  constructor() {
    this.data = new Map()
  }

  /**
   * Adds a value to a list at the given key with intelligent positioning
   *
   * @async
   * @method add
   * @param {string} key - The key to store the list under (must be in VALID_STORE_KEYS)
   * @param {Object} value - The value to add to the list
   * @param {string} value.group - Group name for categorization (for aliases)
   * @param {string} value.alias - Alias name (for aliases)
   * @param {string} value.command - Command to execute (for aliases)
   * @returns {Promise<string>} The unique ID of the added item
   *
   * @description Special behavior for aliases:
   * - Automatically positions new aliases after their group heading
   * - Generates unique UUID for each item
   * - Maintains proper line ordering within groups
   *
   * @example
   * const id = await store.add('aliases', {
   *   alias: 'gst',
   *   command: 'git status',
   *   group: 'Git Commands'
   * });
   * console.log('Added alias with ID:', id);
   *
   * @throws {Error} If the key is not valid or list operations fail
   */
  async add(key, value) {
    if (!this.data.has(key)) {
      this.data.set(key, [])
    }

    if (key === "aliases") {
      const list = await this.data.get(key)

      const groupHeading = list.find((line) => {
        return line.group && line.text?.includes(value.group)
      })

      const id = crypto.randomUUID()
      const newIndex = list.indexOf(groupHeading) + 1

      const item = {
        ...value,
        line: newIndex,
        id,
      }

      list.splice(newIndex, 0, item)

      this.data.set(key, list)

      return id
    }
  }

  /**
   * Deletes an item from a list at the given key
   *
   * @method delete
   * @param {string} key - The key of the list to delete from
   * @param {string} id - The unique ID of the item to delete
   * @returns {boolean} True if the item was found and deleted, false otherwise
   *
   * @description Removes an item by its unique ID. The operation will fail
   * gracefully if the key doesn't exist or the ID is not found.
   *
   * @example
   * const wasDeleted = store.delete('aliases', 'some-uuid-here');
   * if (wasDeleted) {
   *   console.log('Item deleted successfully');
   * } else {
   *   console.log('Item not found');
   * }
   */
  delete(key, id) {
    if (!this.data.has(key)) {
      return false
    }

    const list = this.data.get(key)
    const index = list.findIndex((item) => item.id === id)

    if (index === -1) {
      return false
    }

    list.splice(index, 1)
    return true
  }

  /**
   * Gets either a complete list or a specific item by ID
   *
   * @async
   * @method get
   * @param {string} key - The key of the list to get
   * @param {string} [id] - Optional unique ID of a specific item to retrieve
   * @returns {Promise<Array|Object|undefined>} The complete list if only key provided,
   *   the specific item if both key and ID provided, undefined if not found
   *
   * @description Flexible getter that can return either:
   * - Complete list when only key is provided
   * - Specific item when both key and ID are provided
   * - undefined if the key doesn't exist or item ID is not found
   *
   * @example
   * // Get all aliases
   * const allAliases = await store.get('aliases');
   *
   * // Get specific alias by ID
   * const specificAlias = await store.get('aliases', 'some-uuid');
   *
   * // Handle non-existent data
   * const missing = await store.get('nonexistent'); // returns undefined
   */
  async get(key, id) {
    if (!this.data.has(key)) {
      return undefined
    }

    const list = this.data.get(key)

    if (id) {
      return list.find((item) => item.id === id)
    }

    return list
  }

  /**
   * Gets all keys currently stored in the store
   *
   * @method keys
   * @returns {Array<string>} Array of all keys in the store
   *
   * @description Returns an array of all keys that have been set in the store,
   * useful for debugging or iterating over all stored data types.
   *
   * @example
   * const storeKeys = store.keys();
   * console.log('Available data types:', storeKeys); // ['aliases']
   */
  keys() {
    return Array.from(this.data.keys())
  }

  /**
   * Fetches data from external API and caches it locally
   *
   * @async
   * @method fetch
   * @param {string} key - The key to fetch (must be in VALID_STORE_KEYS)
   * @returns {Promise<Array>} The fetched data array
   *
   * @description Loads data from the external API using the mapped function name
   * and stores it in the local cache. The API function is called via window.API.
   *
   * @example
   * // Fetch aliases from API and cache locally
   * const aliases = await store.fetch('aliases');
   * console.log('Loaded aliases:', aliases.length);
   *
   * @throws {Error} If key is invalid or API method doesn't exist
   * @throws {Error} If window.API.{functionName}() is not available
   */
  async fetch(key) {
    if (VALID_STORE_KEYS.includes(key)) {
      const fn = STORE_KEY_FUNCTION_MAP[key]
      if (fn) {
        try {
          this.data.set(key, window.API[fn]())
          return this.data.get(key)
        } catch (error) {
          throw new Error(`Store.fetch: no method "window.API.${fn}()"`)
        }
      } else {
        throw new Error(`Key "${key}" is invalid`)
      }
    }
  }

  /**
   * Saves local data back to the external API
   *
   * @async
   * @method save
   * @param {string} key - The key to save (must be in VALID_STORE_KEYS)
   * @returns {Promise<void>}
   *
   * @description Persists locally cached data back to the external API using
   * the mapped save function name. Includes debug logging for troubleshooting.
   *
   * @example
   * // Modify data locally then persist
   * await store.add('aliases', newAlias);
   * await store.save('aliases'); // Saves all aliases to API
   *
   * @throws {Error} If key is invalid or API save method doesn't exist
   * @throws {Error} If window.API.{saveFunctionName}() is not available
   */
  async save(key) {
    if (VALID_STORE_KEYS.includes(key)) {
      const fn = STORE_SAVE_KEY_FUNCTION_MAP[key]

      if (fn) {
        try {
          const list = await this.data.get(key)
          console.log("list", list)
          const fun = window.API[fn]
          console.log("fun", fun)
          fun(list)
        } catch (error) {
          throw new Error(`Store.save: no method "window.API.${fn}()"`)
        }
      } else {
        throw new Error(`Key "${key}" is invalid`)
      }
    }
  }
}

export default Store
