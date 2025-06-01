/**
 * @fileoverview Schema Module - Base class for data validation and structure definition
 * 
 * This module provides a foundational Schema class that enables structured data validation
 * through field definitions. It serves as a base class for other data models, providing
 * automatic validation, type checking, and error handling for defined schema structures.
 * 
 * Key features:
 * - Field definition validation with type checking
 * - Required field enforcement
 * - Custom validation function support
 * - Unknown field detection and rejection
 * - Automatic instance property assignment
 * - Static factory method for instance creation
 * 
 * @module lib/schema
 * 
 * @example
 * // Basic schema definition
 * class User extends Schema {
 *   fields = {
 *     name: { type: "string", required: true },
 *     age: { type: "number", required: false },
 *     email: { 
 *       type: "string", 
 *       required: true,
 *       validate: (value) => /\S+@\S+\.\S+/.test(value)
 *     }
 *   }
 * }
 * 
 * // Create valid instance
 * const user = new User({
 *   name: "John Doe",
 *   age: 30,
 *   email: "john@example.com"
 * });
 * 
 * @example
 * // Using static factory method
 * const user = User.create({
 *   name: "Jane Smith",
 *   email: "jane@example.com"
 * });
 * 
 * @example
 * // Validation error handling
 * try {
 *   const invalidUser = new User({
 *     name: "John",
 *     age: "thirty", // wrong type
 *     email: "invalid-email" // fails custom validation
 *   });
 * } catch (error) {
 *   console.error('Validation failed:', error.message);
 * }
 * 
 * @author Dayton Nolan
 * @version 1.0.0
 */

/**
 * Base Schema class that provides validation functionality for subclasses with field definitions
 * 
 * @class Schema
 * @description Provides a foundation for creating structured data models with automatic
 * validation. Subclasses must define a `fields` object that specifies the schema structure,
 * types, requirements, and custom validation rules. The class automatically validates
 * incoming data against the schema and assigns valid properties to the instance.
 * 
 * **Field Definition Structure:**
 * ```javascript
 * fields = {
 *   fieldName: {
 *     type: "string|number|boolean|array|object",  // Data type constraint
 *     required: true|false,                        // Whether field is mandatory
 *     default: any,                                 // Default value if not provided
 *     validate: function(value) { return boolean } // Custom validation function
 *   }
 * }
 * ```
 * 
 * **Supported Types:**
 * - `"string"`: String values
 * - `"number"`: Numeric values
 * - `"boolean"`: Boolean values
 * - `"array"`: Array values (validated with Array.isArray)
 * - `"object"`: Object values (excluding arrays)
 * 
 * @example
 * // Complete schema example
 * class Product extends Schema {
 *   fields = {
 *     id: { 
 *       type: "string", 
 *       required: true 
 *     },
 *     name: { 
 *       type: "string", 
 *       required: true,
 *       validate: (value) => value.length >= 3
 *     },
 *     price: { 
 *       type: "number", 
 *       required: true,
 *       validate: (value) => value > 0
 *     },
 *     tags: { 
 *       type: "array", 
 *       required: false,
 *       default: []
 *     },
 *     metadata: { 
 *       type: "object", 
 *       required: false 
 *     }
 *   }
 * }
 * 
 * @example
 * // Usage with validation
 * const product = new Product({
 *   id: "prod-123",
 *   name: "Laptop",
 *   price: 999.99,
 *   tags: ["electronics", "computers"],
 *   metadata: { brand: "TechCorp" }
 * });
 * 
 * console.log(product.name);  // "Laptop"
 * console.log(product.price); // 999.99
 */
export default class Schema {
  /**
   * Constructor for Schema class - validates and initializes instance with provided attributes
   * 
   * @constructor
   * @param {Object} [attributes={}] - Object containing field values to validate against schema
   * @throws {Error} If validation fails for any field or if subclass doesn't define fields
   * 
   * @description Creates a new Schema instance by:
   * 1. Checking that subclass has defined a fields object
   * 2. Validating all provided attributes against field definitions
   * 3. Assigning validated attributes as instance properties
   * 
   * The constructor will throw detailed error messages for any validation failures,
   * including missing required fields, type mismatches, failed custom validations,
   * and unknown fields not defined in the schema.
   * 
   * @example
   * // Successful instantiation
   * class Config extends Schema {
   *   fields = {
   *     host: { type: "string", required: true },
   *     port: { type: "number", required: false, default: 3000 },
   *     ssl: { type: "boolean", required: false, default: false }
   *   }
   * }
   * 
   * const config = new Config({
   *   host: "localhost",
   *   port: 8080,
   *   ssl: true
   * });
   * 
   * @example
   * // Validation error scenarios
   * try {
   *   // Missing required field
   *   new Config({ port: 8080 }); // Error: Field 'host' is required
   *   
   *   // Wrong type
   *   new Config({ host: "localhost", port: "8080" }); // Error: port must be number
   *   
   *   // Unknown field
   *   new Config({ host: "localhost", timeout: 5000 }); // Error: Unknown field 'timeout'
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  constructor(attributes = {}) {
    // Check if fields are defined in the subclass
    if (!this.fields || typeof this.fields !== 'object') {
      throw new Error('Schema subclass must define a fields object');
    }

    // Validate the attributes against field definitions
    this.validate(attributes);

    // Copy validated attributes to the instance
    Object.assign(this, attributes);
  }

  /**
   * Validates attributes against the field definitions with comprehensive error reporting
   * 
   * @method validate
   * @param {Object} attributes - Object containing field values to validate
   * @throws {Error} If validation fails for any field, with detailed error messages
   * 
   * @description Performs comprehensive validation including:
   * - **Required Field Checking**: Ensures all required fields are present and not null/undefined
   * - **Type Validation**: Validates data types match field definitions
   * - **Custom Validation**: Runs custom validation functions if defined
   * - **Unknown Field Detection**: Rejects fields not defined in the schema
   * 
   * **Validation Process:**
   * 1. Check required fields are present
   * 2. Validate types for provided fields
   * 3. Run custom validation functions
   * 4. Check for unknown fields
   * 5. Collect all errors and throw with detailed message
   * 
   * @example
   * // Manual validation (usually called internally)
   * class Person extends Schema {
   *   fields = {
   *     name: { type: "string", required: true },
   *     age: { 
   *       type: "number", 
   *       required: true,
   *       validate: (value) => value >= 0 && value <= 150
   *     }
   *   }
   * }
   * 
   * const person = new Person();
   * 
   * try {
   *   person.validate({ name: "John", age: 200 });
   * } catch (error) {
   *   console.log(error.message); // "Field 'age' failed custom validation"
   * }
   * 
   * @example
   * // Type validation examples
   * const schema = new PersonSchema();
   * 
   * // These will fail validation:
   * schema.validate({ name: 123 });           // name must be string
   * schema.validate({ age: "thirty" });       // age must be number
   * schema.validate({ hobbies: "reading" });  // hobbies must be array (if defined as array)
   */
  validate(attributes) {
    const errors = [];

    // Check for required fields and validate types
    for (const [fieldName, fieldDef] of Object.entries(this.fields)) {
      // Check if required field is missing
      if (fieldDef.required && (attributes[fieldName] === undefined || attributes[fieldName] === null)) {
        errors.push(`Field '${fieldName}' is required but missing`);
        continue;
      }

      // Skip type validation if field is not provided and not required
      if (attributes[fieldName] === undefined || attributes[fieldName] === null) {
        continue;
      }

      // Validate field type if defined
      if (fieldDef.type) {
        const valueType = typeof attributes[fieldName];

        if (fieldDef.type === 'array') {
          if (!Array.isArray(attributes[fieldName])) {
            errors.push(`Field '${fieldName}' must be an array`);
          }
        } else if (fieldDef.type === 'object') {
          if (valueType !== 'object' || Array.isArray(attributes[fieldName])) {
            errors.push(`Field '${fieldName}' must be an object`);
          }
        } else if (valueType !== fieldDef.type) {
          errors.push(`Field '${fieldName}' must be of type '${fieldDef.type}', got '${valueType}'`);
        }
      }

      // Add validation for custom validators if defined in the field definition
      if (fieldDef.validate && typeof fieldDef.validate === 'function') {
        try {
          const isValid = fieldDef.validate(attributes[fieldName]);
          if (!isValid) {
            errors.push(`Field '${fieldName}' failed custom validation`);
          }
        } catch (e) {
          errors.push(`Field '${fieldName}' validation error: ${e.message}`);
        }
      }
    }

    // Check for unknown fields
    for (const attrName of Object.keys(attributes)) {
      if (!this.fields[attrName]) {
        errors.push(`Unknown field '${attrName}' is not defined in the schema`);
      }
    }

    // Throw error if any validation failed
    if (errors.length > 0) {
      throw new Error(`Schema validation failed:\n${errors.join('\n')}`);
    }
  }

  /**
   * Static factory method for creating schema instances with validation
   * 
   * @static
   * @method create
   * @param {Object} attributes - Object containing field values
   * @returns {Schema} A new instance of the schema class
   * @throws {Error} If validation fails for any field
   * 
   * @description Provides an alternative way to create schema instances using a static
   * factory method. Functionally identical to using the constructor directly, but can
   * be more readable in certain contexts and enables method chaining patterns.
   * 
   * @example
   * // Using static factory method
   * class ApiConfig extends Schema {
   *   fields = {
   *     baseUrl: { type: "string", required: true },
   *     timeout: { type: "number", required: false, default: 5000 },
   *     retries: { type: "number", required: false, default: 3 }
   *   }
   * }
   * 
   * const config = ApiConfig.create({
   *   baseUrl: "https://api.example.com",
   *   timeout: 10000
   * });
   * 
   * @example
   * // Equivalent to constructor usage
   * const config1 = new ApiConfig({ baseUrl: "https://api.example.com" });
   * const config2 = ApiConfig.create({ baseUrl: "https://api.example.com" });
   * // Both create identical instances
   * 
   * @example
   * // Method chaining possibility (if additional static methods exist)
   * const config = ApiConfig
   *   .create({ baseUrl: "https://api.example.com" })
   *   .withDefaults()
   *   .validate();
   */
  static create(attributes) {
    return new this(attributes);
  }
}
