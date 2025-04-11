/**
 * Base Schema class that provides validation functionality
 * for subclasses with field definitions
 */
export default class Schema {
  /**
   * Constructor for Schema class
   * @param {Object} attributes - Object containing field values to validate against schema
   * @throws {Error} If validation fails for any field
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
   * Validates attributes against the field definitions
   * @param {Object} attributes - Object containing field values to validate
   * @throws {Error} If validation fails for any field
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
   * Creates an instance of the schema while ensuring it's valid
   * @param {Object} attributes - Object containing field values
   * @returns {Schema} A new instance of the schema
   */
  static create(attributes) {
    return new this(attributes);
  }
}
