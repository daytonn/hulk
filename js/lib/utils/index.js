/**
 * @fileoverview Utils Module - Common utility functions for data manipulation and type conversion
 * 
 * This module provides essential utility functions for common programming tasks, particularly
 * focused on type conversion and data normalization. The primary focus is on converting
 * various data types to arrays in a safe and predictable manner.
 * 
 * Key features:
 * - Safe array conversion from multiple input types
 * - String to array conversion with single-item wrapping
 * - Array-like object conversion using Array.from()
 * - Short alias for common operations
 * 
 * @module utils
 * 
 * @example
 * // Basic usage
 * import { toArray, toA } from './lib/utils/index.js';
 * 
 * // Convert various types to arrays
 * const stringArray = toArray('hello');        // ['hello']
 * const nodeListArray = toArray(document.querySelectorAll('div')); // [div1, div2, ...]
 * const existingArray = toArray([1, 2, 3]);    // [1, 2, 3]
 * 
 * // Using short alias
 * const converted = toA('single item');        // ['single item']
 * 
 * @author Dayton Nolan
 * @version 1.0.0
 */

/**
 * Converts various data types to arrays in a safe and predictable manner
 * 
 * @function toArray
 * @param {string|Array|ArrayLike|Iterable} list - Input to convert to array
 * @returns {Array} Array representation of the input
 * 
 * @description Handles multiple input types with specific conversion logic:
 * - **Strings**: Wrapped in a single-element array
 * - **Arrays**: Returned as-is (no conversion needed)
 * - **Array-like objects**: Converted using Array.from() (NodeList, HTMLCollection, etc.)
 * - **Iterables**: Converted using Array.from() (Set, Map, etc.)
 * - **Other types**: Converted using Array.from() with fallback behavior
 * 
 * This function is particularly useful for normalizing function parameters that can
 * accept either single values or collections, making APIs more flexible and user-friendly.
 * 
 * @example
 * // String conversion - wraps single string in array
 * const singleString = toArray('hello');
 * console.log(singleString); // ['hello']
 * 
 * // Array passthrough - returns existing arrays unchanged
 * const existingArray = toArray([1, 2, 3]);
 * console.log(existingArray); // [1, 2, 3]
 * 
 * // NodeList conversion - common DOM use case
 * const elements = document.querySelectorAll('.item');
 * const elementArray = toArray(elements);
 * console.log(elementArray); // [element1, element2, ...]
 * 
 * // Set conversion - iterable to array
 * const uniqueValues = new Set([1, 2, 2, 3]);
 * const arrayFromSet = toArray(uniqueValues);
 * console.log(arrayFromSet); // [1, 2, 3]
 * 
 * // HTMLCollection conversion
 * const collection = document.getElementsByClassName('active');
 * const collectionArray = toArray(collection);
 * console.log(collectionArray); // [element1, element2, ...]
 * 
 * @example
 * // Flexible function parameter handling
 * function processItems(items) {
 *   const itemArray = toArray(items);
 *   return itemArray.map(item => item.toUpperCase());
 * }
 * 
 * // Can accept single string
 * processItems('hello'); // ['HELLO']
 * 
 * // Can accept array of strings
 * processItems(['hello', 'world']); // ['HELLO', 'WORLD']
 * 
 * // Can accept NodeList
 * const elements = document.querySelectorAll('[data-text]');
 * const texts = processItems(Array.from(elements, el => el.dataset.text));
 * 
 * @example
 * // DOM manipulation helper
 * function addClass(elements, className) {
 *   const elementArray = toArray(elements);
 *   elementArray.forEach(el => el.classList.add(className));
 * }
 * 
 * // Works with single element
 * addClass(document.getElementById('item'), 'active');
 * 
 * // Works with multiple elements
 * addClass(document.querySelectorAll('.item'), 'active');
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from Array.from()} for conversion details
 */
export function toArray(list) {
  if (typeof list === "string") return [list];
  return Array.from(list);
}

/**
 * Short alias for the toArray function
 * 
 * @function toA
 * @param {string|Array|ArrayLike|Iterable} list - Input to convert to array
 * @returns {Array} Array representation of the input
 * 
 * @description Provides a concise alternative to toArray() for situations where
 * brevity is preferred or when used frequently in a codebase. Functionally
 * identical to toArray() with the same conversion logic and behavior.
 * 
 * @example
 * // Concise array conversion
 * const items = toA('single');           // ['single']
 * const elements = toA($$('.selector')); // [element1, element2, ...]
 * 
 * // Chaining with array methods
 * const processed = toA(inputs)
 *   .filter(input => input.value)
 *   .map(input => input.value.trim());
 * 
 * @example
 * // Compact DOM utilities
 * function hide(els) { toA(els).forEach(el => el.style.display = 'none') }
 * function show(els) { toA(els).forEach(el => el.style.display = '') }
 * 
 * // Usage
 * hide('.modal');                    // Hide single element by selector result
 * hide(document.querySelectorAll('.tooltip')); // Hide multiple elements
 * 
 * @see {@link toArray} for detailed documentation and examples
 */
export const toA = toArray;
