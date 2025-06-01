/**
 * @fileoverview Bashrc Panel Module - Manages display and interaction with .bashrc file content
 *
 * This module provides functionality for fetching and rendering .bashrc file content in a web interface.
 * It handles the retrieval of bash configuration files from external APIs and displays them with
 * syntax highlighting and editing capabilities.
 *
 * Key features:
 * - Fetch .bashrc content from external API
 * - Render bash code with syntax highlighting
 * - Content editing support with contenteditable
 * - Spell-check disabled for code content
 *
 * @module bashrc_panel
 * @requires ./lib/jankQuery - Custom DOM manipulation library (code function)
 * @requires window.API - Global API object for external data operations
 *
 * @example
 * // Basic usage - fetch and render bashrc file
 * import { fetchBashRCFile, renderBashRC } from './bashrc_panel.js';
 *
 * // Fetch bashrc content
 * const bashrcLines = await fetchBashRCFile();
 *
 * // Render to a container
 * const container = document.getElementById('bashrc-container');
 * renderBashRC(bashrcLines, container);
 *
 * @author Dayton Nolan
 * @version 1.0.0
 */

import { code } from "./lib/jankQuery/index.js"

/**
 * Fetches the .bashrc file content from the external API
 *
 * @async
 * @function fetchBashRCFile
 * @returns {Promise<Array<string>>} Promise that resolves to an array of strings representing bashrc file lines
 * @throws {Error} If the API call fails or window.API.getBashRC() is not available
 *
 * @description Makes an asynchronous call to window.API.getBashRC() to retrieve
 * the current user's .bashrc file content from the system. The content is typically
 * returned as an array of strings, where each string represents a line in the file.
 *
 * @example
 * try {
 *   const bashrcContent = await fetchBashRCFile();
 *   console.log(`Loaded ${bashrcContent.length} lines from .bashrc`);
 *   bashrcContent.forEach((line, index) => {
 *     console.log(`${index + 1}: ${line}`);
 *   });
 * } catch (error) {
 *   console.error('Failed to fetch .bashrc file:', error);
 * }
 *
 * @global window.API - Expected global API object with getBashRC() method
 */
export async function fetchBashRCFile() {
  return await window.API.getBashRC()
}

/**
 * Renders .bashrc file content with syntax highlighting and editing capabilities
 *
 * @function renderBashRC
 * @param {Array<string>} lines - Array of strings representing bashrc file lines
 * @param {HTMLElement} container - DOM element to render the content into
 * @returns {HTMLElement} The created code element with rendered content
 *
 * @description Creates a syntax-highlighted, editable code block for .bashrc content.
 * The rendered element includes:
 * - Bash syntax highlighting via CSS class "language-bash"
 * - Content editing enabled with contenteditable attribute
 * - Spell checking disabled for better code editing experience
 * - Automatic insertion into the specified container
 *
 * @example
 * // Basic rendering
 * const bashrcLines = [
 *   '# .bashrc',
 *   '',
 *   'export PATH="$HOME/bin:$PATH"',
 *   'alias ll="ls -la"',
 *   'alias grep="grep --color=auto"'
 * ];
 *
 * const container = document.getElementById('bashrc-editor');
 * const codeElement = renderBashRC(bashrcLines, container);
 *
 * // The container now contains an editable, syntax-highlighted bashrc
 *
 * @example
 * // Complete workflow with fetching and rendering
 * async function displayBashRC() {
 *   const container = document.querySelector('.bashrc-panel');
 *
 *   try {
 *     const lines = await fetchBashRCFile();
 *     renderBashRC(lines, container);
 *     console.log('Bashrc file loaded and rendered successfully');
 *   } catch (error) {
 *     container.innerHTML = '<p>Error loading .bashrc file</p>';
 *     console.error('Failed to display bashrc:', error);
 *   }
 * }
 *
 * @see {@link fetchBashRCFile} for fetching .bashrc content
 */
export function renderBashRC(lines, container) {
  const snippet = code(lines.join("\n"), {
    class: "language-bash",
    container,
    contenteditable: "",
    spellcheck: false,
  })
}
