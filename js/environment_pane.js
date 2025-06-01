/**
 * @fileoverview Environment Pane Module - Manages environment variable display and interaction
 *
 * This module provides functionality for fetching and rendering environment variables in a web interface.
 * It handles the retrieval of environment configuration from external APIs and displays them with
 * editing capabilities, grouping, and management controls.
 *
 * Key features:
 * - Fetch environment variables from external API
 * - Render environment variables with inline editing
 * - Group organization with visual separators
 * - Delete functionality with trash icon buttons
 * - Form-compatible input elements
 *
 * @module environment_pane
 * @requires ./lib/jankQuery - Custom DOM manipulation library
 * @requires ./icons.js - Icon components library (trash icon)
 * @requires window.API - Global API object for external data operations
 *
 * @example
 * // Basic usage - fetch and render environment variables
 * import { fetchEnvFile, renderEnvVars } from './environment_pane.js';
 *
 * // Fetch environment variables
 * const envVars = await fetchEnvFile();
 *
 * // Render to a container
 * const container = document.getElementById('env-container');
 * renderEnvVars(container, envVars);
 *
 * @author Dayton Nolan
 * @version 1.0.0
 */

import { li, input, h2, hr, button, span } from "./lib/jankQuery/index.js"
import { trash } from "./lib/icons/index.js"

/**
 * Fetches environment variables from the external API
 *
 * @async
 * @function fetchEnvFile
 * @returns {Promise<Array<Object>>} Promise that resolves to an array of environment variable objects
 * @throws {Error} If the API call fails or window.API.getEnv() is not available
 *
 * @description Makes an asynchronous call to window.API.getEnv() to retrieve
 * the current system's environment variables and configuration. The returned data
 * typically includes both individual variables and group headers for organization.
 *
 * Expected return format:
 * @returns {Array<Object>} Array of objects with the following structure:
 * @returns {Object} returns[].type - "var" for variables, "group" for section headers
 * @returns {string} returns[].name - Variable name or group name
 * @returns {string} [returns[].value] - Variable value (only for type "var")
 *
 * @example
 * try {
 *   const envVars = await fetchEnvFile();
 *   console.log(`Loaded ${envVars.length} environment entries`);
 *
 *   envVars.forEach(entry => {
 *     if (entry.type === 'var') {
 *       console.log(`${entry.name}=${entry.value}`);
 *     } else if (entry.type === 'group') {
 *       console.log(`[Group: ${entry.name}]`);
 *     }
 *   });
 * } catch (error) {
 *   console.error('Failed to fetch environment variables:', error);
 * }
 *
 * @global window.API - Expected global API object with getEnv() method
 */
export async function fetchEnvFile() {
  return await window.API.getEnv()
}

/**
 * Renders environment variables with inline editing and management controls
 *
 * @function renderEnvVars
 * @param {HTMLElement} container - DOM element to render the environment variables into
 * @param {Array<Object>} env_vars - Array of environment variable objects to render
 * @param {string} env_vars[].type - Entry type: "var" for variables, "group" for headers
 * @param {string} env_vars[].name - Variable name or group name
 * @param {string} [env_vars[].value] - Variable value (required for type "var")
 * @returns {void}
 *
 * @description Creates an interactive list of environment variables with the following features:
 *
 * **For Variable Entries (type: "var"):**
 * - Editable name input field with form name "name"
 * - Editable value input field with dynamic name attribute
 * - Visual "=" separator between name and value
 * - Delete button with trash icon
 * - All wrapped in a list item for styling
 *
 * **For Group Entries (type: "group"):**
 * - Horizontal rule separator
 * - Section heading (h2) with group name
 * - Horizontal rule separator
 * - Wrapped in list item for consistent styling
 *
 * @example
 * // Basic rendering with mixed content
 * const envVars = [
 *   { type: 'group', name: 'System Variables' },
 *   { type: 'var', name: 'PATH', value: '/usr/local/bin:/usr/bin:/bin' },
 *   { type: 'var', name: 'HOME', value: '/home/user' },
 *   { type: 'group', name: 'Application Config' },
 *   { type: 'var', name: 'NODE_ENV', value: 'development' },
 *   { type: 'var', name: 'API_URL', value: 'https://api.example.com' }
 * ];
 *
 * const container = document.getElementById('env-list');
 * renderEnvVars(container, envVars);
 *
 * // Container now has organized, editable environment variables
 *
 * @example
 * // Complete workflow with fetching and rendering
 * async function displayEnvironment() {
 *   const container = document.querySelector('.env-panel');
 *
 *   try {
 *     const envVars = await fetchEnvFile();
 *     container.innerHTML = ''; // Clear existing content
 *     renderEnvVars(container, envVars);
 *
 *     console.log('Environment variables loaded and rendered');
 *
 *     // Add event listeners for delete buttons
 *     const deleteButtons = container.querySelectorAll('.delete.icon');
 *     deleteButtons.forEach(button => {
 *       button.addEventListener('click', (e) => {
 *         e.target.closest('li').remove();
 *       });
 *     });
 *
 *   } catch (error) {
 *     container.innerHTML = '<p>Error loading environment variables</p>';
 *     console.error('Failed to display environment:', error);
 *   }
 * }
 *
 * @example
 * // Form integration for environment editing
 * function setupEnvironmentForm() {
 *   const form = document.getElementById('env-form');
 *   const container = form.querySelector('.env-list');
 *
 *   // Render environment variables
 *   fetchEnvFile().then(envVars => {
 *     renderEnvVars(container, envVars);
 *   });
 *
 *   // Handle form submission
 *   form.addEventListener('submit', (e) => {
 *     e.preventDefault();
 *     const formData = new FormData(form);
 *     const names = formData.getAll('name');
 *     const values = names.map(name => formData.get(name));
 *
 *     // Process environment variable updates
 *     console.log('Environment updates:', names.map((name, i) => ({
 *       name, value: values[i]
 *     })));
 *   });
 * }
 *
 * @see {@link fetchEnvFile} for fetching environment data
 */
export function renderEnvVars(container, env_vars) {
  env_vars.forEach(({ type, name, value }) => {
    if (type === "var") {
      const nameInput = input({ name: "name" })
      nameInput.value = name
      const valueInput = input({ name })
      valueInput.value = value
      const btn = button(trash("var(--color-white)"), { class: "delete icon" })
      li([nameInput, span("=", { class: "equals" }), valueInput, btn], {
        container,
      })
    } else if (type === "group") {
      li([hr(), h2(name), hr()], { container })
    }
  })
}
