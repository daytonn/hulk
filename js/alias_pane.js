/**
 * @fileoverview Alias Pane Module - Manages bash alias display, search, and creation functionality
 *
 * This module provides the core functionality for managing bash aliases in a web-based interface.
 * It handles rendering aliases to the DOM, implementing search/filter capabilities, and providing
 * a modal interface for adding new aliases. The module integrates with a storage system and
 * external API for persisting alias data.
 *
 * @module alias_pane
 * @requires ./jankQuery.js - Custom DOM manipulation library
 * @requires ./icons.js - Icon components library
 *
 * @example
 * // Basic usage - render aliases to a list
 * import { renderAliases, createAliasSearchFilter, createAddAliasModal, fetchAliases } from './alias_pane.js';
 *
 * // Fetch and render aliases
 * const aliases = await fetchAliases();
 * renderAliases(aliases);
 *
 * // Set up search functionality
 * const filterInput = document.getElementById('search');
 * const resultsContainer = document.getElementById('results');
 * createAliasSearchFilter(filterInput, resultsContainer, aliases);
 *
 * @author Dayton Nolan
 * @version 1.0.0
 */

import {
  $,
  $$,
  h3,
  input,
  span,
  button,
  li,
  hr,
  option,
  p,
} from "./lib/jankQuery/index.js"
import { trash } from "./lib/icons/index.js"

/**
 * Renders an array of aliases to a DOM list container
 *
 * @function renderAliases
 * @param {Array<Object>} aliases - Array of alias objects to render
 * @param {string} aliases[].alias - The alias name/shortcut
 * @param {string} aliases[].command - The command the alias executes
 * @param {string} aliases[].text - Raw text content (for group headings)
 * @param {string} aliases[].type - Type of entry: "alias" or "line"
 * @param {string} aliases[].group - Group/category the alias belongs to
 * @param {HTMLElement} [list] - Target DOM element to render aliases into. Defaults to #alias-list
 *
 * @example
 * const aliases = [
 *   { type: "alias", alias: "ll", command: "ls -la", group: "File Operations" },
 *   { type: "line", text: "# Git Shortcuts", group: true },
 *   { type: "alias", alias: "gs", command: "git status", group: "Git Shortcuts" }
 * ];
 * renderAliases(aliases);
 */
export function renderAliases(aliases, list) {
  if (!list) list = $("#alias-list")

  list.innerHTML = ""
  if (!Array.isArray(aliases)) return

  aliases.forEach(({ alias, command, text, type, group }) => {
    let listItem

    if (type === "alias") {
      listItem = createAlias({ alias, command: printableCommand(command) })
    }

    if (type === "line" && group) {
      listItem = createGroupHeading(text)
    }

    if (listItem) list.appendChild(listItem)
  })
}

/**
 * Checks if a text line represents a group heading comment
 *
 * @private
 * @function isGroupHeading
 * @param {string} text - Text to check
 * @returns {boolean} True if text is a group heading format
 *
 * @example
 * isGroupHeading("# Git Commands") // true
 * isGroupHeading("alias ll='ls -la'") // false
 */
function isGroupHeading(text) {
  return (
    text !== "" &&
    !text.match(/#\!\/usr\//) &&
    !text.match(/alias\s([\w-\.]+)=/) &&
    text.match(/^\s{0,}?#\s{0,}?/)
  )
}

/**
 * Creates a DOM element for a single alias entry
 *
 * @private
 * @function createAlias
 * @param {Object} params - Alias parameters
 * @param {string} params.alias - The alias name
 * @param {string} params.command - The command to execute
 * @returns {HTMLElement} List item element containing the alias form inputs
 *
 * @example
 * const aliasElement = createAlias({ alias: "ll", command: "ls -la" });
 */
function createAlias({ alias, command }) {
  return li(
    [
      input(null, {
        value: alias,
        type: "text",
        name: "name[]",
      }),
      span("=", { class: "equals" }),
      input(null, {
        value: command,
        type: "text",
        name: "command[]",
      }),
      button(trash("var(--color-white)"), {
        class: "delete icon",
      }),
    ],
    { class: "alias" }
  )
}

/**
 * Converts a command string to a printable format by removing surrounding quotes
 *
 * @private
 * @function printableCommand
 * @param {string} command - Raw command string that may have quotes
 * @returns {string} Command string with outer quotes removed
 *
 * @example
 * printableCommand("'ls -la'") // "ls -la"
 * printableCommand("git status") // "git status"
 */
function printableCommand(command) {
  if (command.match(/^'/)) {
    return command.replace(/^'/, "").replace(/'$/, "")
  } else {
    return command
  }
}

/**
 * Creates a search filter interface for aliases with real-time filtering
 *
 * @function createAliasSearchFilter
 * @param {HTMLInputElement} filter - Input element for search terms
 * @param {HTMLElement} results - Container element to display search results
 * @param {Array<Object>} aliases - Array of alias objects to search through
 *
 * @description Sets up event listeners for real-time search functionality.
 * Searches both alias names (from start) and commands (substring match for terms > 3 chars).
 *
 * @example
 * const searchInput = document.getElementById('alias-search');
 * const resultsDiv = document.getElementById('search-results');
 * const allAliases = await fetchAliases();
 * createAliasSearchFilter(searchInput, resultsDiv, allAliases);
 */
export function createAliasSearchFilter(filter, results, aliases) {
  filter.focus()
  results.classList.add("hidden")

  filter.addEventListener("keyup", ({ key }) => {
    const searchTerm = filter.value
    results.innerHTML = ""

    if (searchTerm === "") {
      results.classList.add("hidden")
    } else {
      results.classList.remove("hidden")
    }

    const foundAliases = aliases.filter(({ type, alias, command }) => {
      if (type === "alias") {
        const aliasPattern = new RegExp(`^${searchTerm}`)
        const cmdPattern =
          searchTerm.length > 3 ? new RegExp(`${searchTerm}`) : aliasPattern
        return alias.match(aliasPattern) || command.match(cmdPattern)
      }

      return false
    })

    if (foundAliases.length) {
      foundAliases.forEach(({ alias, command }) => {
        li(
          [
            span(alias, { class: "alias" }),
            span(" = "),
            span(printableCommand(command), { class: "command" }),
          ],
          { container: results }
        )
      })
    } else {
      li(p("There are no aliases matching that query"), { container: results })
    }
  })
}

/**
 * Removes comment formatting from group heading text
 *
 * @private
 * @function stripHeadingTextFormatting
 * @param {string} text - Raw heading text with comment symbols
 * @returns {string} Clean heading text without comment formatting
 *
 * @example
 * stripHeadingTextFormatting("# Git Commands") // "Git Commands"
 * stripHeadingTextFormatting("  #   File Operations  ") // "File Operations"
 */
function stripHeadingTextFormatting(text) {
  return text.replace(/\s{0,}#\s{0,}/, "")
}

/**
 * Creates a DOM element for a group heading
 *
 * @private
 * @function createGroupHeading
 * @param {string} text - Raw heading text
 * @returns {HTMLElement|undefined} List item with heading styling, or undefined if not a valid heading
 *
 * @example
 * const heading = createGroupHeading("# Git Commands");
 */
function createGroupHeading(text) {
  if (isGroupHeading(text)) {
    const group = h3(stripHeadingTextFormatting(text))
    return li([hr(), group, hr()], { class: "group-heading" })
  }
}

/**
 * Creates and configures a modal interface for adding new aliases
 *
 * @function createAddAliasModal
 * @param {HTMLElement} modal - Modal dialog element
 * @param {HTMLElement} aliasList - List container for aliases (currently unused)
 * @param {Array<Object>} [allAliases=[]] - Array of all existing aliases for group population
 *
 * @description Sets up a complete modal interface with:
 * - Form inputs for alias name and command
 * - Group selection dropdown
 * - Keyboard shortcuts (Alt+A to open, Escape to close, Enter to submit)
 * - Event handlers for save/close operations
 * - Integration with global Store for persistence
 *
 * @example
 * const modal = document.getElementById('add-alias-modal');
 * const aliasList = document.getElementById('alias-list');
 * const aliases = await fetchAliases();
 * createAddAliasModal(modal, aliasList, aliases);
 *
 * @global Store - Expected global object with add(), save(), and get() methods
 */
export function createAddAliasModal(modal, aliasList, allAliases = []) {
  const mask = $(".modal-mask")
  const modals = $$(".modal-window")
  const closeButton = $(modal, "button.icon.delete")
  const name = modal.getAttribute("name")
  const submitButton = $(modal, `button[type="submit"]`)
  const inputs = $$(modal, `input[type="text"]`)
  const groupSelect = $(modal, "select")
  const [aliasInput, commandInput] = inputs
  const groups = allAliases.filter(
    ({ type, group }) => type === "line" && group
  )

  const closeModal = () => {
    modal.classList.remove("open")
    mask.classList.remove("open")
    $(`.pane[name="aliases"] .search-or-add input`).focus()
  }

  const openModal = () => {
    modal.classList.add("open")
    mask.classList.add("open")
    aliasInput.focus()
  }

  groups.forEach(({ text }) => {
    const groupName = stripHeadingTextFormatting(text)
    const opt = option(groupName, { value: groupName, container: groupSelect })
  })

  const saveAlias = async () => {
    const alias = {
      type: "alias",
      alias: aliasInput.value,
      command: commandInput.value,
      group: groupSelect.value === "none" ? "General" : groupSelect.value,
    }

    aliasInput.value = ""
    commandInput.value = ""

    await Store.add("aliases", alias)
    await Store.save("aliases")
    const aliases = await Store.get("aliases")

    renderAliases(aliases)
  }

  closeButton.addEventListener("click", () => closeModal())

  document.body.addEventListener("keyup", (e) => {
    const { key, altKey } = e
    if (key === "a" && altKey) {
      $(`.tabs [pane="aliases"]`).click()
      openModal()
    }
    if (key === "e" && altKey) {
      $(`.tabs [pane="environment"]`).click()
      $(`.pane[name="environment"] .search-or-add input`).focus()
    }
    if (key === "b" && altKey) {
      $(`.tabs [pane="bashrc"]`).click()
    }
    if (key === "f" && altKey) {
      $(`.tabs [pane="functions"]`).click()
    }
    if (key === "f" && altKey) $(".search-or-add input").focus()
  })

  submitButton.addEventListener("click", () => {
    if (aliasInput.value === "" || commandInput.value === "") return
    saveAlias()
    closeModal()
  })

  mask.addEventListener("click", () => closeModal())

  modal.addEventListener("keyup", ({ key }) => {
    if (aliasInput.value === "" || commandInput.value === "") return

    if (key === "Enter") {
      saveAlias()
      closeModal()
    }
  })

  document.addEventListener("keyup", ({ key }) => {
    if (key === "Escape") closeModal()
  })

  const triggers = $$(`[modal="${name}"]`)

  triggers.forEach((trigger) => {
    console.log("trigger", trigger)
    trigger.addEventListener("click", () => {
      console.log("clicked")
      openModal()
      modal.querySelector("input").focus()
    })
  })
}

/**
 * Fetches aliases from the external API
 *
 * @async
 * @function fetchAliases
 * @returns {Promise<Array<Object>>} Promise that resolves to an array of alias objects
 * @throws {Error} If the API call fails
 *
 * @description Makes an asynchronous call to window.API.getAliases() to retrieve
 * alias data from the backend system.
 *
 * @example
 * try {
 *   const aliases = await fetchAliases();
 *   renderAliases(aliases);
 * } catch (error) {
 *   console.error('Failed to fetch aliases:', error);
 * }
 *
 * @global window.API - Expected global API object with getAliases() method
 */
export async function fetchAliases() {
  return await window.API.getAliases()
}
