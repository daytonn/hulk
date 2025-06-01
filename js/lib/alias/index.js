/**
 * @fileoverview Alias Schema - Data model for bash alias management
 * 
 * This module defines the Alias class, which extends the base Schema class to provide
 * a structured data model for bash aliases. It defines the fields, types, validation
 * rules, and default values for alias objects used throughout the application.
 * 
 * Key features:
 * - Schema-based data validation and structure
 * - Required field validation for name and command
 * - Optional group categorization with default value
 * - Type safety with string field enforcement
 * - Integration with broader schema system
 * 
 * @module lib/alias
 * @requires ../schema/index.js - Base Schema class for data modeling
 * 
 * @example
 * // Creating a new alias instance
 * import Alias from './lib/alias/index.js';
 * 
 * const alias = new Alias({
 *   name: 'ls',
 *   command: 'ls -la --color=auto',
 *   group: 'File Operations'
 * });
 * 
 * @example
 * // Using with default group
 * const simpleAlias = new Alias({
 *   name: 'grep',
 *   command: 'grep --color=auto'
 *   // group defaults to "General"
 * });
 * 
 * @example
 * // Validation example
 * try {
 *   const invalidAlias = new Alias({
 *     name: 'test'
 *     // Missing required 'command' field
 *   });
 * } catch (error) {
 *   console.error('Validation failed:', error.message);
 * }
 * 
 * @author Dayton Nolan
 * @version 1.0.0
 */

import Schema from "../schema/index.js"

/**
 * Alias data model class for managing bash alias structures
 * 
 * @class Alias
 * @extends Schema
 * @description Defines the data structure and validation rules for bash aliases.
 * Each alias consists of a name (the shortcut), a command (what gets executed),
 * and an optional group for organization. Inherits validation, serialization,
 * and other data management features from the base Schema class.
 * 
 * **Field Definitions:**
 * - `name` *(string, required)*: The alias name/shortcut (e.g., "ll", "gs")
 * - `command` *(string, required)*: The command to execute (e.g., "ls -la")
 * - `group` *(string, optional)*: Category for organization (defaults to "General")
 * 
 * @example
 * // Creating a git status alias
 * const gitStatusAlias = new Alias({
 *   name: 'gst',
 *   command: 'git status',
 *   group: 'Git Commands'
 * });
 * 
 * @example
 * // Creating a file listing alias with default group
 * const listAlias = new Alias({
 *   name: 'll',
 *   command: 'ls -la --color=auto'
 *   // group will default to "General"
 * });
 * 
 * @example
 * // Complex command with pipes and options
 * const complexAlias = new Alias({
 *   name: 'findlarge',
 *   command: 'find . -type f -size +100M -exec ls -lh {} \\; | sort -k5 -hr',
 *   group: 'System Utilities'
 * });
 * 
 * @example
 * // Accessing field definitions
 * const alias = new Alias();
 * console.log(alias.fields);
 * // {
 * //   name: { type: "string", required: true },
 * //   command: { type: "string", required: true },
 * //   group: { type: "string", required: false, default: "General" }
 * // }
 * 
 * @example
 * // Common alias patterns
 * const commonAliases = [
 *   new Alias({
 *     name: 'la',
 *     command: 'ls -la',
 *     group: 'File Operations'
 *   }),
 *   new Alias({
 *     name: 'grep',
 *     command: 'grep --color=auto',
 *     group: 'Text Processing'
 *   }),
 *   new Alias({
 *     name: 'gco',
 *     command: 'git checkout',
 *     group: 'Git Commands'
 *   }),
 *   new Alias({
 *     name: 'reload',
 *     command: 'source ~/.bashrc',
 *     group: 'System'
 *   })
 * ];
 * 
 * @example
 * // Using with form data
 * function createAliasFromForm(formData) {
 *   return new Alias({
 *     name: formData.get('aliasName'),
 *     command: formData.get('aliasCommand'),
 *     group: formData.get('aliasGroup') || undefined // Use default if empty
 *   });
 * }
 * 
 * @example
 * // Batch alias creation
 * const aliasDefinitions = [
 *   { name: 'gst', command: 'git status', group: 'Git' },
 *   { name: 'gaa', command: 'git add --all', group: 'Git' },
 *   { name: 'gc', command: 'git commit', group: 'Git' }
 * ];
 * 
 * const gitAliases = aliasDefinitions.map(def => new Alias(def));
 * 
 * @see {@link Schema} for base validation and data management functionality
 */
export default class Alias extends Schema {
  /**
   * Field definitions for the Alias schema
   * 
   * @static
   * @member {Object} fields
   * @description Defines the structure, types, validation rules, and defaults
   * for alias objects. Each field definition includes type information,
   * requirement status, and optional default values.
   * 
   * **Field Structure:**
   * ```javascript
   * {
   *   name: {
   *     type: "string",        // Data type constraint
   *     required: true         // Must be provided
   *   },
   *   command: {
   *     type: "string",        // Data type constraint  
   *     required: true         // Must be provided
   *   },
   *   group: {
   *     type: "string",        // Data type constraint
   *     required: false,       // Optional field
   *     default: "General"     // Default value when not specified
   *   }
   * }
   * ```
   * 
   * **Field Descriptions:**
   * 
   * - **`name`**: The alias identifier used in the shell. Should be a valid
   *   bash identifier (alphanumeric, underscore, dash). Examples: "ll", "gst", "my_alias"
   * 
   * - **`command`**: The full command that will be executed when the alias is used.
   *   Can include options, pipes, and complex shell constructs. Examples: "ls -la",
   *   "git status", "find . -name '*.js' | grep -v node_modules"
   * 
   * - **`group`**: Optional categorization for organizing aliases in the UI.
   *   Used for grouping related aliases together. Defaults to "General" if not specified.
   *   Examples: "Git Commands", "File Operations", "System Utilities"
   * 
   * @example
   * // Accessing field metadata
   * const alias = new Alias();
   * const nameField = alias.fields.name;
   * console.log(`Name is ${nameField.required ? 'required' : 'optional'}`);
   * console.log(`Name type: ${nameField.type}`);
   * 
   * const groupField = alias.fields.group;
   * console.log(`Group default: ${groupField.default}`);
   */
  fields = {
    name: { type: "string", required: true },
    command: { type: "string", required: true },
    group: { type: "string", required: false, default: "General" },
  }
}
