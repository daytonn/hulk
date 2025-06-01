# jankQuery

A lightweight DOM manipulation and element creation library inspired by jQuery. Provides a simple, fluent API for creating and manipulating DOM elements with minimal overhead.

## Features

- 🏗️ **Element Creation** - Factory functions for all HTML elements
- 🔍 **jQuery-style Selectors** - Familiar `$` and `$$` query functions
- 🎨 **Flexible Class Management** - Multiple formats for CSS class handling
- 📦 **Container Integration** - Automatic element insertion
- ⚡ **Lightweight** - No external dependencies (except utils)
- 🔧 **Fluent API** - Chainable and intuitive interface

## Installation

```javascript
import { div, p, button, $, $$ } from './lib/jankQuery/index.js'
```

## Quick Start

```javascript
// Create a simple element
const title = h1('Hello World', { class: 'title' })

// Create nested elements
const card = div([
  h3('Card Title'),
  p('This is card content'),
  button('Click Me', { class: 'btn-primary' })
], { class: 'card' })

// Query elements
const element = $('.my-selector')
const elements = $$('.multiple-elements')

// Add to page
document.body.appendChild(card)
```

## Core Functions

### Element Creation

#### `elem(tag, content, attributes)`

Creates a DOM element with the specified tag, content, and attributes.

```javascript
// Basic element
const paragraph = elem('p', 'Hello World')

// With attributes
const link = elem('a', 'Click here', {
  href: 'https://example.com',
  target: '_blank',
  class: 'external-link'
})

// With mixed content
const container = elem('div', [
  'Some text',
  elem('strong', 'bold text'),
  ' and more text'
])
```

### Query Selectors

#### `$(selector)` - Single Element

Returns the first matching element or `null`.

```javascript
// Query from document
const header = $('.header')
const mainNav = $('#main-nav')

// Query within context
const form = $('.contact-form')
const submitButton = $(form, 'button[type="submit"]')
```

#### `$$(selector)` - Multiple Elements

Returns an array of all matching elements.

```javascript
// Get all items
const listItems = $$('.list-item')

// Query within context
const table = $('.data-table')
const rows = $$(table, 'tbody tr')

// Use array methods
rows.forEach(row => row.classList.add('processed'))
```

### Attribute Management

#### `assignAttrs(element, attributes)`

Assigns attributes and properties to a DOM element with special handling for certain attributes.

```javascript
const element = document.createElement('div')

assignAttrs(element, {
  id: 'main-content',
  class: 'container active',
  'data-test': 'example',
  classes: ['highlight', { 'error': hasError }]
})
```

## HTML Element Factories

All HTML elements are available as factory functions:

### Basic Elements

```javascript
// Headings
const title = h1('Page Title')
const subtitle = h2('Subtitle', { class: 'subtitle' })

// Text elements
const paragraph = p('This is a paragraph')
const emphasis = em('Emphasized text')
const strong = strong('Important text')

// Containers
const container = div('Content here')
const section = section([h2('Section Title'), p('Section content')])
```

### Form Elements

```javascript
// Input elements (default type="text")
const nameInput = input(null, {
  placeholder: 'Enter your name',
  name: 'username',
  required: true
})

// Different input types
const emailInput = input(null, {
  type: 'email',
  placeholder: 'your@email.com'
})

// Buttons (default type="button")
const clickButton = button('Click Me')
const submitButton = button('Submit', { type: 'submit' })

// Select and options
const selectElement = select([
  option('Option 1', { value: '1' }),
  option('Option 2', { value: '2' }),
  option('Option 3', { value: '3' })
])
```

### Lists

```javascript
// Unordered list
const menu = ul([
  li('Home'),
  li('About'),
  li('Contact')
], { class: 'navigation' })

// Ordered list
const steps = ol([
  li('First step'),
  li('Second step'),
  li('Third step')
])

// Definition list
const definitions = dl([
  dt('Term 1'),
  dd('Definition 1'),
  dt('Term 2'),
  dd('Definition 2')
])
```

### Tables

```javascript
const dataTable = table([
  thead([
    tr([
      th('Name'),
      th('Email'),
      th('Role')
    ])
  ]),
  tbody([
    tr([
      td('John Doe'),
      td('john@example.com'),
      td('Admin')
    ]),
    tr([
      td('Jane Smith'),
      td('jane@example.com'),
      td('User')
    ])
  ])
], { class: 'data-table' })
```

## Advanced Features

### CSS Class Management

jankQuery supports multiple formats for CSS class assignment:

```javascript
// Space-separated string
const element1 = div('Content', { class: 'container primary active' })

// Array of classes
const element2 = div('Content', {
  classes: ['container', 'primary', 'active']
})

// Conditional classes
const element3 = div('Content', {
  classes: [
    'container',
    { 'active': isActive },
    { 'error': hasError },
    { 'loading': isLoading }
  ]
})

// Object format
const element4 = div('Content', {
  classes: {
    'container': true,
    'active': isActive,
    'error': hasError
  }
})
```

### Container Integration

Automatically append elements to containers during creation:

```javascript
const list = ul(null, { class: 'item-list' })

// Elements automatically added to list
const item1 = li('Item 1', { container: list })
const item2 = li('Item 2', { container: list })
const item3 = li('Item 3', { container: list })

// list now contains all three items
```

### Complex Content

Handle mixed content types seamlessly:

```javascript
const article = article([
  h1('Article Title'),
  p([
    'This paragraph contains ',
    strong('bold text'),
    ' and ',
    em('italic text'),
    '.'
  ]),
  img(null, { src: 'image.jpg', alt: 'Description' }),
  p('Another paragraph with just text.')
])
```

## Practical Examples

### Building a Card Component

```javascript
function createCard(title, content, actions = []) {
  return div([
    div([
      h3(title, { class: 'card-title' }),
      p(content, { class: 'card-content' })
    ], { class: 'card-body' }),
    
    actions.length > 0 && div(
      actions.map(action => 
        button(action.text, {
          class: 'btn ' + (action.primary ? 'btn-primary' : 'btn-secondary'),
          onclick: action.handler
        })
      ),
      { class: 'card-actions' }
    )
  ], { class: 'card' })
}

// Usage
const card = createCard(
  'Welcome',
  'This is a sample card component',
  [
    { text: 'Cancel', handler: () => console.log('Cancel') },
    { text: 'OK', primary: true, handler: () => console.log('OK') }
  ]
)
```

### Building a Form

```javascript
function createContactForm() {
  return form([
    div([
      label('Name:', { for: 'name' }),
      input(null, { id: 'name', name: 'name', required: true })
    ], { class: 'form-group' }),
    
    div([
      label('Email:', { for: 'email' }),
      input(null, { 
        id: 'email', 
        name: 'email', 
        type: 'email', 
        required: true 
      })
    ], { class: 'form-group' }),
    
    div([
      label('Message:', { for: 'message' }),
      textarea(null, { 
        id: 'message', 
        name: 'message', 
        rows: 4,
        required: true 
      })
    ], { class: 'form-group' }),
    
    div([
      button('Send Message', { type: 'submit', class: 'btn-primary' })
    ], { class: 'form-actions' })
  ], { 
    class: 'contact-form',
    onsubmit: handleFormSubmit
  })
}
```

### Dynamic Content Generation

```javascript
function renderUserList(users) {
  const container = div(null, { class: 'user-list' })
  
  users.forEach(user => {
    const userCard = div([
      img(null, { 
        src: user.avatar, 
        alt: user.name,
        class: 'user-avatar'
      }),
      div([
        h4(user.name),
        p(user.email),
        p(user.role, { class: 'user-role' })
      ], { class: 'user-info' })
    ], { 
      class: 'user-card',
      container: container
    })
  })
  
  return container
}
```

### Event Handling Integration

```javascript
function createInteractiveButton(text, onClick) {
  return button(text, {
    class: 'interactive-btn',
    onclick: onClick,
    onmouseenter: (e) => e.target.classList.add('hover'),
    onmouseleave: (e) => e.target.classList.remove('hover')
  })
}

// Usage
const button = createInteractiveButton('Click Me', () => {
  alert('Button clicked!')
})
```

## Element Reference

### Document Structure
- `html`, `head`, `body`, `title`, `meta`, `link`, `script`, `style`

### Sections
- `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `hgroup`

### Text Content
- `p`, `blockquote`, `ol`, `ul`, `li`, `dl`, `dt`, `dd`
- `figure`, `figcaption`, `div`, `hr`, `pre`, `address`

### Inline Text
- `a`, `em`, `strong`, `small`, `s`, `cite`, `q`, `dfn`, `abbr`
- `ruby`, `rt`, `rp`, `data`, `time`, `code`, `var`, `samp`, `kbd`
- `sub`, `sup`, `i`, `b`, `u`, `mark`, `bdi`, `bdo`, `span`, `wbr`

### Media
- `img`, `iframe`, `embed`, `object`, `picture`, `source`
- `video`, `audio`, `track`, `canvas`

### Forms
- `form`, `label`, `input`, `button`, `select`, `datalist`
- `optgroup`, `option`, `textarea`, `output`, `progress`, `meter`
- `fieldset`, `legend`

### Tables
- `table`, `caption`, `colgroup`, `col`
- `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`

### Interactive
- `details`, `summary`, `dialog`, `menu`

## Special Element Behaviors

### `hr` - Self-closing Element

```javascript
// HR takes only attributes (no content)
const separator = hr({ class: 'section-divider' })
```

### `input` - Default Type

```javascript
// Default type is "text"
const textInput = input(null, { placeholder: 'Enter text' })

// Override type
const emailInput = input(null, { type: 'email' })
```

### `button` - Default Type

```javascript
// Default type is "button"
const regularButton = button('Click Me')

// Override for form submission
const submitButton = button('Submit', { type: 'submit' })
```

## Best Practices

### 1. Use Semantic HTML

```javascript
// Good - semantic structure
const page = div([
  header([
    nav([/* navigation items */])
  ]),
  main([
    article([
      h1('Article Title'),
      section([/* article content */])
    ])
  ]),
  footer([/* footer content */])
])

// Avoid - div soup
const page = div([
  div([div([/* navigation */])]),
  div([div([div([/* content */])])])
])
```

### 2. Leverage Container Integration

```javascript
// Efficient - use container integration
const list = ul(null, { class: 'items' })
items.forEach(item => 
  li(item.text, { container: list })
)

// Less efficient - manual appending
const list = ul(null, { class: 'items' })
items.forEach(item => {
  const listItem = li(item.text)
  list.appendChild(listItem)
})
```

### 3. Component-Based Architecture

```javascript
// Create reusable components
function Badge(text, type = 'default') {
  return span(text, { 
    class: `badge badge-${type}` 
  })
}

function Card(title, content, badges = []) {
  return div([
    div([
      h3(title),
      badges.length > 0 && div(
        badges.map(badge => Badge(badge.text, badge.type)),
        { class: 'card-badges' }
      )
    ], { class: 'card-header' }),
    div(content, { class: 'card-body' })
  ], { class: 'card' })
}
```

### 4. Event Delegation

```javascript
// Use event delegation for dynamic content
const container = div(null, { class: 'button-container' })

container.addEventListener('click', (e) => {
  if (e.target.matches('.dynamic-button')) {
    handleButtonClick(e.target)
  }
})

// Add buttons dynamically
function addButton(text) {
  button(text, { 
    class: 'dynamic-button',
    container: container
  })
}
```

### 5. Conditional Rendering

```javascript
function UserProfile(user) {
  return div([
    h2(user.name),
    user.avatar && img(null, { src: user.avatar, alt: user.name }),
    p(user.bio),
    user.isAdmin && Badge('Admin', 'success'),
    user.links.length > 0 && div([
      h3('Links'),
      ul(user.links.map(link => 
        li(a(link.title, { href: link.url }))
      ))
    ])
  ], { class: 'user-profile' })
}
```

## Performance Tips

1. **Batch DOM Operations**: Use container integration to minimize reflows
2. **Event Delegation**: Use single event listeners on containers rather than individual elements
3. **Conditional Rendering**: Use logical operators to avoid creating unnecessary elements
4. **Reuse Components**: Create component functions for repeated patterns

## Browser Support

jankQuery uses modern JavaScript features and requires:
- ES6+ support
- `document.querySelector`/`querySelectorAll`
- `Array.from`
- `classList` API

Compatible with all modern browsers (IE11+ with polyfills).

## License

MIT License - see project root for details. 