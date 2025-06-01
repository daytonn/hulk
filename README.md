# Hulk

A powerful desktop application for managing bash configurations, aliases, environment variables, and shell settings with a modern graphical interface.

![Hulk Banner](https://via.placeholder.com/800x200/2d3748/ffffff?text=HULK+-+Bash+Configuration+Manager)

## Overview

Hulk is an Electron-based desktop application that provides a user-friendly interface for managing your bash environment. Instead of manually editing configuration files, Hulk offers a modern GUI to create, edit, and organize your aliases, environment variables, .bashrc content, and shell functions.

## Features

### 🚀 **Alias Management**
- Create, edit, and delete bash aliases with validation
- Group aliases by category for better organization
- Search and filter aliases by name or command
- Real-time preview of alias commands
- Automatic backup of existing alias files

### 🌍 **Environment Variables**
- Manage environment variables with inline editing
- Group variables for logical organization
- Validate variable names and values
- Export/import environment configurations

### 📝 **Bashrc Editor**
- View and edit .bashrc file with syntax highlighting
- Safe editing with backup creation
- Real-time syntax validation
- Support for bash scripting patterns

### ⚡ **Functions Management**
- Create and manage bash functions
- Function categorization and organization
- Syntax highlighting and validation

### 🔧 **Additional Features**
- Modern, responsive user interface
- Tab-based navigation between different configuration types
- Real-time search and filtering
- Data validation and error handling
- Automatic file backups before modifications
- Cross-platform compatibility (Windows, macOS, Linux)

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git (for development)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/daytonn/hulk.git
   cd hulk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

### Building for Production

To build Hulk for your platform:

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:linux
npm run build:mac
npm run build:windows
```

## Usage

### Managing Aliases

1. **Navigate to the Aliases tab**
2. **Add a new alias:**
   - Click "Add alias" button
   - Enter the alias name (e.g., `ll`)
   - Enter the command (e.g., `ls -la --color=auto`)
   - Optionally select or create a group
   - Click "Add" to save

3. **Search aliases:**
   - Use the search box to filter aliases by name or command
   - Results update in real-time as you type

4. **Edit or delete aliases:**
   - Click on any alias to edit it inline
   - Use the delete button to remove aliases

### Managing Environment Variables

1. **Navigate to the Environment tab**
2. **Add variables:**
   - Click "Add ENV var" button
   - Enter variable name and value
   - Assign to a group for organization

3. **Edit variables:**
   - Click on any variable to edit inline
   - Changes are automatically validated

### Editing .bashrc

1. **Navigate to the .bashrc tab**
2. **View current content** with syntax highlighting
3. **Make edits** with real-time validation
4. **Save changes** with automatic backup creation

## Architecture

Hulk is built with a modular architecture using modern web technologies:

### Core Technologies

- **Electron**: Desktop application framework
- **Lit Elements**: Web components for UI
- **Node.js**: Backend file system operations
- **JavaScript Modules**: Modular code organization

### Key Modules

#### **Schema System** (`js/lib/schema/`)
- Base validation framework for data integrity
- Type checking and custom validation rules
- Extensible schema definitions

#### **Store Management** (`js/lib/store/`)
- Data persistence and synchronization
- CRUD operations with validation
- API integration capabilities

#### **jankQuery** (`js/lib/jankQuery/`)
- Lightweight DOM manipulation library
- jQuery-inspired API for familiar usage
- Factory functions for HTML element creation

#### **Component System** (`js/components/`)
- Reusable UI components using Lit Elements
- Tab management and navigation
- Modal dialogs and forms

### File Structure

```
hulk/
├── js/                          # Client-side JavaScript modules
│   ├── lib/                     # Core library modules
│   │   ├── schema/              # Data validation framework
│   │   ├── store/               # Data management
│   │   ├── jankQuery/           # DOM manipulation
│   │   ├── tabs/                # Tab management
│   │   ├── alias/               # Alias schema
│   │   └── utils/               # Utility functions
│   ├── components/              # UI components
│   ├── alias_pane.js           # Alias management interface
│   ├── environment_pane.js     # Environment variable interface
│   └── bashrc_panel.js         # Bashrc editor interface
├── src/                         # Application assets
│   ├── styles.css              # Application styles
│   └── highlight.min.js        # Syntax highlighting
├── main.js                      # Electron main process
├── renderer.js                  # Electron renderer process
├── preload.js                   # Preload scripts
├── index.html                   # Main application window
└── package.json                 # Dependencies and scripts
```

## Development

### Getting Started

1. **Fork and clone the repository**
2. **Install dependencies:** `npm install`
3. **Start development server:** `npm start`
4. **Make your changes**
5. **Test thoroughly**
6. **Submit a pull request**

### Development Scripts

```bash
# Start development with hot reload
npm start

# Run tests (when available)
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Code Style and Standards

- **ES6+ JavaScript** with modern syntax
- **Modular architecture** with clear separation of concerns
- **JSDoc documentation** for all public APIs
- **Consistent naming conventions** (camelCase for variables, PascalCase for classes)
- **Error handling** with custom error types
- **Validation** using the Schema system

### Adding New Features

1. **Create appropriate schemas** in `js/lib/schema/` if handling new data types
2. **Add UI components** in `js/components/` for new interface elements
3. **Implement business logic** in dedicated modules
4. **Add comprehensive documentation** with JSDoc comments
5. **Include usage examples** in module documentation

### Testing

While test suites are being developed, please manually test:

- **All user interactions** (clicks, keyboard input, navigation)
- **Data validation** (invalid inputs, edge cases)
- **File operations** (reading, writing, backup creation)
- **Error scenarios** (missing files, permission issues)
- **Cross-platform compatibility** if possible

## Configuration

Hulk creates its configuration in `~/.config/hulk/`:

- `config.json` - Application settings
- `*.hulk-backup` - Automatic backups of modified files

### File Locations

Hulk manages these standard shell configuration files:

- `~/.aliases` - Bash aliases
- `~/.bashrc` - Bash configuration
- `~/.env` - Environment variables

## Troubleshooting

### Common Issues

**Application won't start:**
- Ensure Node.js v18+ is installed
- Run `npm install` to install dependencies
- Check for permission issues in home directory

**Can't save changes:**
- Verify write permissions to home directory
- Check if configuration files are read-only
- Ensure sufficient disk space

**Syntax highlighting not working:**
- Refresh the application (Ctrl/Cmd + R)
- Check browser console for JavaScript errors
- Verify highlight.js is properly loaded

### Getting Help

1. **Check existing issues** on GitHub
2. **Create a new issue** with detailed description
3. **Include system information** (OS, Node.js version, Hulk version)
4. **Provide error messages** and console output

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Ways to Contribute

- **Bug Reports**: Found a bug? Open an issue with reproduction steps
- **Feature Requests**: Have an idea? Open an issue to discuss it
- **Code Contributions**: Fix bugs or implement features
- **Documentation**: Improve documentation and examples
- **Testing**: Help test on different platforms and configurations

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests and documentation
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## Roadmap

### Planned Features

- [ ] **Plugin System** - Support for custom extensions
- [ ] **Theme Support** - Dark/light themes and customization
- [ ] **Import/Export** - Configuration sharing and migration
- [ ] **Git Integration** - Version control for configurations
- [ ] **Remote Sync** - Cloud synchronization across devices
- [ ] **Advanced Search** - Regex and advanced filtering
- [ ] **Batch Operations** - Bulk editing and management
- [ ] **Shell Integration** - Direct shell command execution
- [ ] **Configuration Templates** - Pre-built configuration sets
- [ ] **Advanced Functions** - Enhanced function editor with debugging

### Version History

- **v1.0.0** - Initial release with core functionality
  - Basic alias management
  - Environment variable editing
  - .bashrc file viewing
  - Tab-based interface

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

**Dayton Nolan**

- GitHub: [@daytonn](https://github.com/daytonn)
- Email: [your-email@example.com](mailto:your-email@example.com)

## Acknowledgments

- **Electron** - For the desktop application framework
- **Lit** - For modern web components
- **highlight.js** - For syntax highlighting
- **The Open Source Community** - For inspiration and tools

---

**Made with ❤️ for the terminal power users**

---

## Quick Links

- [📖 Documentation](docs/)
- [🐛 Report Bug](https://github.com/daytonn/hulk/issues)
- [💡 Request Feature](https://github.com/daytonn/hulk/issues)
- [💬 Discussions](https://github.com/daytonn/hulk/discussions)
- [📋 Project Board](https://github.com/daytonn/hulk/projects)

---

*Hulk - Because managing bash configurations shouldn't be smashing your keyboard in frustration.* 