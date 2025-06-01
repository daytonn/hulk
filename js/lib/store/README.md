# Store Module

A lightweight data management layer for local storage and API synchronization, designed for managing application data with intelligent caching and external API integration.

## Features

- 🗄️ **Local Data Caching** - Map-based storage for fast access
- 🔄 **API Synchronization** - Seamless fetch/save operations with external APIs
- 🎯 **Smart Positioning** - Intelligent item insertion for grouped data
- 🆔 **Unique IDs** - Automatic UUID generation for all items
- 🛡️ **Type Safety** - Validation for store keys and operations
- 📝 **Alias Management** - Specialized handling for bash aliases with group organization

## Installation

```javascript
import Store from './lib/store/index.js'
```

## Quick Start

```javascript
// Create a new store instance
const store = new Store()

// Fetch data from API and cache locally
await store.fetch('aliases')

// Add new items with automatic positioning
const id = await store.add('aliases', {
  alias: 'gst',
  command: 'git status',
  group: 'Git Commands'
})

// Retrieve data
const allAliases = await store.get('aliases')
const specificAlias = await store.get('aliases', id)

// Save changes back to API
await store.save('aliases')
```

## API Reference

### Constructor

#### `new Store()`

Creates a new Store instance with empty Map storage.

```javascript
const store = new Store()
```

---

### Data Operations

#### `add(key, value)`

Adds a new item to the specified data store with intelligent positioning.

**Parameters:**
- `key` *(string)*: Store key (must be in `VALID_STORE_KEYS`)
- `value` *(Object)*: Item to add

**Returns:** `Promise<string>` - Unique ID of the added item

**For Aliases:**
- `value.alias` *(string)*: The alias name
- `value.command` *(string)*: The command to execute
- `value.group` *(string)*: Group category for organization

```javascript
// Add a new alias
const id = await store.add('aliases', {
  alias: 'ls',
  command: 'ls -la --color=auto',
  group: 'File Operations'
})

console.log('Added alias with ID:', id)
```

#### `get(key, id?)`

Retrieves data from the store - either complete lists or specific items.

**Parameters:**
- `key` *(string)*: Store key to retrieve
- `id` *(string, optional)*: Specific item ID

**Returns:** `Promise<Array|Object|undefined>`
- Complete list if only key provided
- Specific item if both key and ID provided
- `undefined` if not found

```javascript
// Get all aliases
const allAliases = await store.get('aliases')

// Get specific alias by ID
const alias = await store.get('aliases', 'some-uuid-here')

// Handle missing data
const missing = await store.get('nonexistent') // undefined
```

#### `delete(key, id)`

Removes an item by its unique ID.

**Parameters:**
- `key` *(string)*: Store key
- `id` *(string)*: Item ID to delete

**Returns:** `boolean` - `true` if deleted, `false` if not found

```javascript
const wasDeleted = store.delete('aliases', id)
if (wasDeleted) {
  console.log('Alias deleted successfully')
}
```

#### `keys()`

Returns all available store keys.

**Returns:** `Array<string>` - Array of store keys

```javascript
const availableKeys = store.keys()
console.log('Available stores:', availableKeys)
```

---

### API Synchronization

#### `fetch(key)`

Loads data from external API into local cache.

**Parameters:**
- `key` *(string)*: Store key to fetch

**Returns:** `Promise<Array>` - The fetched data

```javascript
try {
  const aliases = await store.fetch('aliases')
  console.log(`Loaded ${aliases.length} aliases`)
} catch (error) {
  console.error('Failed to fetch aliases:', error.message)
}
```

#### `save(key)`

Persists local data back to external API.

**Parameters:**
- `key` *(string)*: Store key to save

**Returns:** `Promise<void>`

```javascript
try {
  await store.save('aliases')
  console.log('Aliases saved successfully')
} catch (error) {
  console.error('Failed to save aliases:', error.message)
}
```

## Complete Workflow Example

```javascript
import Store from './lib/store/index.js'

async function manageAliases() {
  const store = new Store()
  
  try {
    // 1. Load existing aliases from API
    console.log('Loading aliases...')
    const aliases = await store.fetch('aliases')
    console.log(`Loaded ${aliases.length} aliases`)
    
    // 2. Add some new aliases
    const newAliases = [
      {
        alias: 'gst',
        command: 'git status',
        group: 'Git Commands'
      },
      {
        alias: 'gaa',
        command: 'git add --all',
        group: 'Git Commands'
      },
      {
        alias: 'll',
        command: 'ls -la --color=auto',
        group: 'File Operations'
      }
    ]
    
    console.log('Adding new aliases...')
    const addedIds = []
    for (const alias of newAliases) {
      const id = await store.add('aliases', alias)
      addedIds.push(id)
      console.log(`Added "${alias.alias}" with ID: ${id}`)
    }
    
    // 3. Verify additions
    const updatedAliases = await store.get('aliases')
    console.log(`Total aliases: ${updatedAliases.length}`)
    
    // 4. Get a specific alias
    const firstAlias = await store.get('aliases', addedIds[0])
    console.log('First added alias:', firstAlias)
    
    // 5. Save changes back to API
    console.log('Saving changes...')
    await store.save('aliases')
    console.log('All changes saved successfully!')
    
    // 6. Optional: Remove an alias
    const removed = store.delete('aliases', addedIds[1])
    if (removed) {
      console.log('Removed an alias')
      await store.save('aliases') // Save the deletion
    }
    
  } catch (error) {
    console.error('Error managing aliases:', error.message)
  }
}

// Run the example
manageAliases()
```

## Configuration

The store uses predefined configurations for supported data types:

```javascript
// Supported store keys
const VALID_STORE_KEYS = ["aliases"]

// API function mappings
const STORE_KEY_FUNCTION_MAP = {
  aliases: "getAliases"
}

const STORE_SAVE_KEY_FUNCTION_MAP = {
  aliases: "saveAliases"
}
```

### Adding New Data Types

To support additional data types:

1. Add the key to `VALID_STORE_KEYS`
2. Map fetch function in `STORE_KEY_FUNCTION_MAP`
3. Map save function in `STORE_SAVE_KEY_FUNCTION_MAP`
4. Ensure `window.API` has the corresponding methods

## Alias-Specific Features

### Group Organization

Aliases are automatically organized by groups. When adding an alias:

- The store finds the corresponding group heading
- Inserts the new alias immediately after the group header
- Maintains proper line ordering within groups

### Data Structure

Alias objects have the following structure:

```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000", // Auto-generated UUID
  alias: "gst",                                // Alias name
  command: "git status",                       // Command to execute
  group: "Git Commands",                       // Group category
  line: 15,                                    // Line position
  type: "alias"                                // Item type
}
```

## Error Handling

The store provides comprehensive error handling:

```javascript
try {
  await store.fetch('invalid-key')
} catch (error) {
  console.error(error.message) // "Key 'invalid-key' is invalid"
}

try {
  await store.fetch('aliases')
} catch (error) {
  console.error(error.message) // "Store.fetch: no method 'window.API.getAliases()'"
}
```

## Dependencies

- **`window.API`**: Global API object providing:
  - `getAliases()`: Fetch aliases from external source
  - `saveAliases(data)`: Save aliases to external source
- **`crypto.randomUUID()`**: For generating unique identifiers

## Best Practices

1. **Always fetch before modifying**: Load current data before making changes
   ```javascript
   await store.fetch('aliases')
   await store.add('aliases', newAlias)
   ```

2. **Save after batch operations**: Group multiple operations then save once
   ```javascript
   await store.add('aliases', alias1)
   await store.add('aliases', alias2)
   await store.save('aliases') // Single save operation
   ```

3. **Handle errors gracefully**: Always wrap API calls in try-catch blocks
   ```javascript
   try {
     await store.save('aliases')
   } catch (error) {
     console.error('Save failed:', error.message)
     // Handle error appropriately
   }
   ```

4. **Check existence before operations**: Verify data exists before manipulation
   ```javascript
   const aliases = await store.get('aliases')
   if (aliases && aliases.length > 0) {
     // Proceed with operations
   }
   ```

## License

MIT License - see project root for details. 