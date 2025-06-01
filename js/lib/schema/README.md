# Schema Module

A foundational base class for creating structured data models with automatic validation, type checking, and error handling in JavaScript.

## Overview

The Schema module provides a robust foundation for building data models that require validation and structure definition. It serves as a base class that subclasses can extend to define their own field structures, validation rules, and data constraints.

## Features

- **Field Definition Validation** - Define field types, requirements, and constraints
- **Type Checking** - Automatic validation of data types (`string`, `number`, `boolean`, `array`, `object`)
- **Required Field Enforcement** - Ensure mandatory fields are provided
- **Custom Validation Functions** - Add custom validation logic for specific business rules
- **Unknown Field Detection** - Reject fields not defined in the schema
- **Automatic Property Assignment** - Validated fields are automatically assigned to the instance
- **Static Factory Method** - Alternative instance creation pattern
- **Comprehensive Error Reporting** - Detailed validation error messages

## Installation

```javascript
import Schema from './lib/schema/index.js';
```

## Quick Start

### Basic Schema Definition

```javascript
import Schema from './lib/schema/index.js';

// Define a User schema
class User extends Schema {
  fields = {
    name: { type: "string", required: true },
    age: { type: "number", required: false },
    email: { 
      type: "string", 
      required: true,
      validate: (value) => /\S+@\S+\.\S+/.test(value)
    }
  }
}

// Create a valid user
const user = new User({
  name: "John Doe",
  age: 30,
  email: "john@example.com"
});

console.log(user.name);  // "John Doe"
console.log(user.email); // "john@example.com"
```

### Using the Static Factory Method

```javascript
// Alternative creation method
const user = User.create({
  name: "Jane Smith",
  email: "jane@example.com"
});
```

## Field Definition Structure

Each field in the schema is defined with the following structure:

```javascript
fields = {
  fieldName: {
    type: "string|number|boolean|array|object",  // Data type constraint
    required: true|false,                        // Whether field is mandatory
    default: any,                                // Default value if not provided
    validate: function(value) { return boolean } // Custom validation function
  }
}
```

### Supported Types

| Type | Description | Validation |
|------|-------------|------------|
| `"string"` | String values | `typeof value === "string"` |
| `"number"` | Numeric values | `typeof value === "number"` |
| `"boolean"` | Boolean values | `typeof value === "boolean"` |
| `"array"` | Array values | `Array.isArray(value)` |
| `"object"` | Object values (excluding arrays) | `typeof value === "object" && !Array.isArray(value)` |

## Advanced Examples

### Complex Schema with Custom Validation

```javascript
class Product extends Schema {
  fields = {
    id: { 
      type: "string", 
      required: true,
      validate: (value) => value.length >= 3
    },
    name: { 
      type: "string", 
      required: true,
      validate: (value) => value.length >= 2 && value.length <= 100
    },
    price: { 
      type: "number", 
      required: true,
      validate: (value) => value > 0 && value < 1000000
    },
    category: { 
      type: "string", 
      required: true,
      validate: (value) => ["electronics", "clothing", "books", "home"].includes(value)
    },
    tags: { 
      type: "array", 
      required: false,
      default: [],
      validate: (value) => value.every(tag => typeof tag === "string")
    },
    metadata: { 
      type: "object", 
      required: false,
      validate: (value) => Object.keys(value).length <= 10
    }
  }
}

// Usage
const product = new Product({
  id: "prod-123",
  name: "Wireless Headphones",
  price: 149.99,
  category: "electronics",
  tags: ["audio", "wireless", "bluetooth"],
  metadata: { 
    brand: "TechCorp",
    warranty: "2 years",
    color: "black"
  }
});
```

### Configuration Schema Example

```javascript
class DatabaseConfig extends Schema {
  fields = {
    host: { 
      type: "string", 
      required: true,
      validate: (value) => /^[a-zA-Z0-9.-]+$/.test(value)
    },
    port: { 
      type: "number", 
      required: false, 
      default: 5432,
      validate: (value) => value > 0 && value <= 65535
    },
    database: { 
      type: "string", 
      required: true,
      validate: (value) => value.length >= 1 && value.length <= 63
    },
    ssl: { 
      type: "boolean", 
      required: false, 
      default: false 
    },
    connectionOptions: {
      type: "object",
      required: false,
      default: {},
      validate: (value) => typeof value === "object" && !Array.isArray(value)
    }
  }
}

const dbConfig = new DatabaseConfig({
  host: "localhost",
  database: "myapp",
  ssl: true
});
```

## Error Handling

The Schema class provides comprehensive error reporting for validation failures:

### Common Validation Errors

```javascript
try {
  // Missing required field
  new User({ age: 25 }); 
} catch (error) {
  console.log(error.message);
  // "Schema validation failed:
  // Field 'name' is required but missing
  // Field 'email' is required but missing"
}

try {
  // Wrong type
  new User({ 
    name: "John", 
    age: "twenty-five",  // Should be number
    email: "john@example.com" 
  });
} catch (error) {
  console.log(error.message);
  // "Schema validation failed:
  // Field 'age' must be of type 'number', got 'string'"
}

try {
  // Failed custom validation
  new User({ 
    name: "John", 
    age: 25,
    email: "invalid-email" 
  });
} catch (error) {
  console.log(error.message);
  // "Schema validation failed:
  // Field 'email' failed custom validation"
}

try {
  // Unknown field
  new User({ 
    name: "John",
    email: "john@example.com",
    phone: "555-1234"  // Not defined in schema
  });
} catch (error) {
  console.log(error.message);
  // "Schema validation failed:
  // Unknown field 'phone' is not defined in the schema"
}
```

## API Reference

### Constructor

```javascript
new Schema(attributes = {})
```

**Parameters:**
- `attributes` *(Object, optional)*: Field values to validate and assign

**Throws:**
- `Error`: If validation fails or subclass doesn't define fields

### Methods

#### `validate(attributes)`

Validates attributes against field definitions.

**Parameters:**
- `attributes` *(Object)*: Field values to validate

**Throws:**
- `Error`: If validation fails with detailed error messages

**Example:**
```javascript
const user = new User();
try {
  user.validate({ name: "John", email: "john@example.com" });
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

#### `static create(attributes)`

Static factory method for creating schema instances.

**Parameters:**
- `attributes` *(Object)*: Field values to validate and assign

**Returns:**
- `Schema`: New instance of the schema class

**Throws:**
- `Error`: If validation fails

**Example:**
```javascript
const user = User.create({ name: "John", email: "john@example.com" });
```

## Best Practices

### 1. Clear Field Definitions

Always define clear, descriptive field structures:

```javascript
class BlogPost extends Schema {
  fields = {
    title: { 
      type: "string", 
      required: true,
      validate: (value) => value.length >= 5 && value.length <= 200
    },
    content: { 
      type: "string", 
      required: true,
      validate: (value) => value.length >= 50
    },
    publishedAt: { 
      type: "string", 
      required: false,
      validate: (value) => !isNaN(Date.parse(value))
    },
    tags: { 
      type: "array", 
      required: false,
      default: [],
      validate: (value) => value.length <= 10 && value.every(tag => typeof tag === "string")
    }
  }
}
```

### 2. Meaningful Custom Validation

Write clear, specific validation functions:

```javascript
// Good: Specific validation with clear purpose
validate: (value) => value >= 18 && value <= 120  // Valid age range

// Better: Validation with descriptive error context
validate: (value) => {
  if (value < 18) throw new Error("Must be at least 18 years old");
  if (value > 120) throw new Error("Must be a valid age");
  return true;
}
```

### 3. Default Values

Use appropriate default values for optional fields:

```javascript
fields = {
  status: { 
    type: "string", 
    required: false, 
    default: "pending" 
  },
  preferences: { 
    type: "object", 
    required: false, 
    default: {} 
  },
  notifications: { 
    type: "boolean", 
    required: false, 
    default: true 
  }
}
```

### 4. Error Handling in Applications

Always handle validation errors gracefully:

```javascript
function createUser(userData) {
  try {
    return new User(userData);
  } catch (error) {
    // Log validation errors
    console.error('User creation failed:', error.message);
    
    // Return user-friendly error
    throw new Error('Invalid user data provided');
  }
}

// Usage
try {
  const user = createUser(formData);
  console.log('User created successfully:', user);
} catch (error) {
  displayErrorMessage(error.message);
}
```

### 5. Schema Composition

For complex applications, compose schemas:

```javascript
class Address extends Schema {
  fields = {
    street: { type: "string", required: true },
    city: { type: "string", required: true },
    state: { type: "string", required: true },
    zipCode: { type: "string", required: true }
  }
}

class Customer extends Schema {
  fields = {
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    // Use address validation in customer
    address: { 
      type: "object", 
      required: true,
      validate: (value) => {
        try {
          new Address(value);
          return true;
        } catch (error) {
          return false;
        }
      }
    }
  }
}
```

## Real-World Usage Examples

### Form Data Validation

```javascript
class ContactForm extends Schema {
  fields = {
    name: { 
      type: "string", 
      required: true,
      validate: (value) => value.trim().length >= 2
    },
    email: { 
      type: "string", 
      required: true,
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    },
    message: { 
      type: "string", 
      required: true,
      validate: (value) => value.trim().length >= 10
    },
    subject: { 
      type: "string", 
      required: false,
      default: "General Inquiry"
    }
  }
}

// Form submission handler
function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  try {
    const contact = new ContactForm({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      subject: formData.get('subject')
    });
    
    // Submit valid data
    submitContactForm(contact);
  } catch (error) {
    displayValidationErrors(error.message);
  }
}
```

### API Response Validation

```javascript
class ApiResponse extends Schema {
  fields = {
    status: { 
      type: "string", 
      required: true,
      validate: (value) => ["success", "error", "pending"].includes(value)
    },
    data: { 
      type: "object", 
      required: false 
    },
    message: { 
      type: "string", 
      required: false 
    },
    timestamp: { 
      type: "number", 
      required: true,
      validate: (value) => value > 0 && value <= Date.now()
    }
  }
}

// API call handler
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const rawData = await response.json();
    
    // Validate response structure
    const validatedResponse = new ApiResponse(rawData);
    
    if (validatedResponse.status === "success") {
      return validatedResponse.data;
    } else {
      throw new Error(validatedResponse.message || "API request failed");
    }
  } catch (error) {
    console.error('API validation failed:', error.message);
    throw error;
  }
}
```

## Migration Guide

If you're migrating from a different validation library, here's how to adapt common patterns:

### From Plain Objects

```javascript
// Before: Plain object validation
function validateUser(user) {
  if (!user.name || typeof user.name !== 'string') {
    throw new Error('Name is required');
  }
  if (!user.email || !user.email.includes('@')) {
    throw new Error('Valid email is required');
  }
}

// After: Schema-based validation
class User extends Schema {
  fields = {
    name: { type: "string", required: true },
    email: { 
      type: "string", 
      required: true,
      validate: (value) => value.includes('@')
    }
  }
}
```

### From Manual Type Checking

```javascript
// Before: Manual type checking
function createProduct(data) {
  if (typeof data.price !== 'number' || data.price <= 0) {
    throw new Error('Price must be a positive number');
  }
  if (!Array.isArray(data.tags)) {
    throw new Error('Tags must be an array');
  }
  // ... more validation
}

// After: Schema-based validation
class Product extends Schema {
  fields = {
    price: { 
      type: "number", 
      required: true,
      validate: (value) => value > 0
    },
    tags: { type: "array", required: true }
  }
}
```

## Contributing

When extending the Schema class or contributing to this module:

1. **Follow the field definition structure**
2. **Add comprehensive JSDoc documentation**
3. **Include usage examples in docstrings**
4. **Test edge cases and error conditions**
5. **Maintain backward compatibility**

## License

This module is part of the Hulk project by Dayton Nolan. 