/**
 * @fileoverview Tabs Library - Vanilla JavaScript tab interface management system
 * 
 * This module provides a lightweight, vanilla JavaScript solution for creating and managing
 * tabbed interfaces. It automatically discovers tab sets in the DOM and sets up interactive
 * behavior, including tab selection, pane switching, and bidirectional element references.
 * 
 * Key features:
 * - Automatic tab discovery and initialization
 * - Event delegation for efficient click handling
 * - Bidirectional tab-pane references for easy manipulation
 * - CSS class-based state management
 * - Support for multiple independent tab sets
 * - Lightweight with no external dependencies (except jankQuery)
 * 
 * @module lib/tabs
 * @requires ../jankQuery/index.js - Custom DOM manipulation library
 * 
 * @example
 * // HTML structure
 * <div class="tabs">
 *   <button pane="tab1">Tab 1</button>
 *   <button pane="tab2">Tab 2</button>
 * </div>
 * <div class="pane" name="tab1">Content 1</div>
 * <div class="pane" name="tab2">Content 2</div>
 * 
 * // Initialize all tab sets
 * import { initializeTabs } from './lib/tabs/index.js';
 * initializeTabs();
 * 
 * @example
 * // Multiple tab sets on same page
 * <div class="tabs" id="main-tabs">
 *   <a pane="overview">Overview</a>
 *   <a pane="details">Details</a>
 * </div>
 * <div class="pane" name="overview">Overview content</div>
 * <div class="pane" name="details">Details content</div>
 * 
 * <div class="tabs" id="settings-tabs">
 *   <span pane="general">General</span>
 *   <span pane="advanced">Advanced</span>
 * </div>
 * <div class="pane" name="general">General settings</div>
 * <div class="pane" name="advanced">Advanced settings</div>
 * 
 * @author Dayton Nolan
 * @version 1.0.0
 */

import { $, $$ } from "../jankQuery/index.js"

/**
 * Initializes all tab sets found in the DOM
 * 
 * @function initializeTabs
 * @returns {void}
 * 
 * @description Discovers all elements with the "tabs" class and sets up interactive
 * tab behavior for each set. For each tab set, it:
 * 
 * 1. Finds all tab elements (elements with `pane` attribute)
 * 2. Maps tabs to their corresponding pane elements
 * 3. Creates bidirectional references between tabs and panes
 * 4. Selects the first tab by default
 * 5. Sets up event delegation for tab clicking
 * 
 * **Required DOM Structure:**
 * - Container with class `tabs` containing tab elements
 * - Tab elements with `pane` attribute specifying target pane name
 * - Pane elements with class `pane` and `name` attribute matching tab's `pane` value
 * 
 * **CSS Classes Applied:**
 * - `selected` class added to active tab and its corresponding pane
 * - `selected` class removed from inactive tabs and panes
 * 
 * @example
 * // Basic usage - call once after DOM is loaded
 * document.addEventListener('DOMContentLoaded', () => {
 *   initializeTabs();
 * });
 * 
 * @example
 * // Required HTML structure
 * <div class="tabs">
 *   <button pane="home">Home</button>
 *   <button pane="about">About</button>
 *   <button pane="contact">Contact</button>
 * </div>
 * 
 * <div class="pane" name="home">Home page content</div>
 * <div class="pane" name="about">About page content</div>
 * <div class="pane" name="contact">Contact form content</div>
 * 
 * @example
 * // Dynamic content - reinitialize after adding new tabs
 * function addNewTabSet() {
 *   const container = document.getElementById('dynamic-content');
 *   container.innerHTML = `
 *     <div class="tabs">
 *       <a pane="new1">New Tab 1</a>
 *       <a pane="new2">New Tab 2</a>
 *     </div>
 *     <div class="pane" name="new1">New content 1</div>
 *     <div class="pane" name="new2">New content 2</div>
 *   `;
 *   
 *   // Reinitialize to pick up new tab set
 *   initializeTabs();
 * }
 * 
 * @see {@link selectTab} for tab selection logic
 * @see {@link getPane} for tab-pane mapping
 */
export function initializeTabs() {
  const tabSets = $$(`.tabs`)

  tabSets.forEach((tabSet) => {
    const tabs = $$(tabSet, "[pane]")
    const panes = tabs.map(getPane)

    selectTab(tabs[0], tabs, panes)

    tabSet.addEventListener("click", (e) => {
      const selectedTab = e
        .composedPath()
        .find((x) => x && x.getAttribute && x.getAttribute("pane"))

      if (selectedTab) {
        selectTab(selectedTab, tabs, panes)
      }
    })
  })
}

/**
 * Maps a tab element to its corresponding pane element and creates bidirectional references
 * 
 * @private
 * @function getPane
 * @param {HTMLElement} tab - Tab element with `pane` attribute
 * @returns {HTMLElement} Corresponding pane element with bidirectional reference
 * 
 * @description Creates the connection between a tab and its content pane by:
 * 1. Reading the `pane` attribute from the tab element
 * 2. Finding the corresponding pane element with matching `name` attribute
 * 3. Creating bidirectional references: `tab.pane` and `pane.tab`
 * 
 * This bidirectional linking allows for easy navigation between tabs and panes
 * and enables features like programmatic tab selection or pane manipulation.
 * 
 * @example
 * // HTML structure
 * <button pane="settings">Settings</button>
 * <div class="pane" name="settings">Settings content</div>
 * 
 * // After getPane() is called
 * const tab = document.querySelector('[pane="settings"]');
 * const pane = getPane(tab);
 * 
 * console.log(tab.pane === pane);     // true
 * console.log(pane.tab === tab);      // true
 * 
 * @example
 * // Programmatic access to related elements
 * const activeTab = document.querySelector('.tabs .selected');
 * if (activeTab && activeTab.pane) {
 *   activeTab.pane.style.backgroundColor = 'highlight';
 * }
 * 
 * const visiblePane = document.querySelector('.pane.selected');
 * if (visiblePane && visiblePane.tab) {
 *   visiblePane.tab.style.fontWeight = 'bold';
 * }
 * 
 * @throws {Error} Implicitly throws if no matching pane element is found
 */
function getPane(tab) {
  const paneName = tab.getAttribute("pane")
  const pane = $(`.pane[name="${paneName}"]`)
  pane.tab = tab
  tab.pane = pane
  return pane
}

/**
 * Selects a specific tab and shows its corresponding pane while hiding others
 * 
 * @private
 * @function selectTab
 * @param {HTMLElement} tab - The tab element to select
 * @param {Array<HTMLElement>} tabs - Array of all tab elements in the set
 * @param {Array<HTMLElement>} panes - Array of all corresponding pane elements
 * @returns {void}
 * 
 * @description Manages the visual state of a tab set by:
 * 1. Removing `selected` class from all tabs and panes
 * 2. Adding `selected` class to the specified tab
 * 3. Adding `selected` class to the tab's corresponding pane
 * 
 * This function assumes that the tab parameter has a `pane` property that
 * references its corresponding pane element (created by getPane()).
 * 
 * **CSS Integration:**
 * The function relies on CSS to handle the visual presentation of selected/unselected states.
 * Typical CSS might hide unselected panes and style selected tabs differently.
 * 
 * @example
 * // CSS for hiding/showing panes
 * .pane {
 *   display: none;
 * }
 * .pane.selected {
 *   display: block;
 * }
 * 
 * // CSS for styling selected tabs
 * .tabs [pane] {
 *   background: #f0f0f0;
 *   border-bottom: 2px solid transparent;
 * }
 * .tabs [pane].selected {
 *   background: #ffffff;
 *   border-bottom-color: #007bff;
 * }
 * 
 * @example
 * // Programmatic tab selection
 * const tabs = document.querySelectorAll('.tabs [pane]');
 * const panes = Array.from(tabs).map(tab => 
 *   document.querySelector(`.pane[name="${tab.getAttribute('pane')}"]`)
 * );
 * 
 * // Select the second tab
 * selectTab(tabs[1], Array.from(tabs), panes);
 * 
 * @example
 * // Keyboard navigation example
 * document.addEventListener('keydown', (e) => {
 *   if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
 *     const currentTab = document.querySelector('.tabs [pane].selected');
 *     const allTabs = Array.from(document.querySelectorAll('.tabs [pane]'));
 *     const currentIndex = allTabs.indexOf(currentTab);
 *     
 *     let nextIndex;
 *     if (e.key === 'ArrowRight') {
 *       nextIndex = (currentIndex + 1) % allTabs.length;
 *     } else {
 *       nextIndex = (currentIndex - 1 + allTabs.length) % allTabs.length;
 *     }
 *     
 *     const panes = allTabs.map(tab => tab.pane);
 *     selectTab(allTabs[nextIndex], allTabs, panes);
 *   }
 * });
 * 
 * @see {@link initializeTabs} for initial setup
 */
function selectTab(tab, tabs, panes) {
  tabs.forEach((t) => t.classList.remove("selected"))
  panes.forEach((p) => p.classList.remove("selected"))
  tab.classList.add("selected")
  tab.pane.classList.add("selected")
}
