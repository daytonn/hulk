/**
 * @fileoverview JankQuery - A lightweight DOM manipulation and element creation library
 *
 * This module provides a jQuery-inspired API for DOM manipulation, element creation, and
 * querying. It includes factory functions for all HTML elements, making it easy to create
 * and manipulate DOM elements programmatically with a fluent interface.
 *
 * Key features:
 * - Element creation with content and attributes
 * - CSS class management with multiple formats
 * - jQuery-style selectors ($ and $$)
 * - Factory functions for all HTML elements
 * - Container-based element insertion
 *
 * @module jankQuery
 * @requires ./utils.js - Utility functions (toA for array conversion)
 *
 * @example
 * // Basic element creation
 * import { div, p, button, $, $$ } from './jankQuery.js';
 *
 * // Create a div with content and classes
 * const container = div('Hello World', { class: 'container primary' });
 *
 * // Create nested elements
 * const card = div([
 *   h3('Card Title'),
 *   p('Card content goes here'),
 *   button('Click Me', { class: 'btn-primary' })
 * ], { class: 'card' });
 *
 * // Query elements
 * const element = $('.my-selector');
 * const elements = $$('.multiple-elements');
 *
 * @author Dayton Nolan
 * @version 1.0.0
 */

import { toA } from "../utils/index.js"

/**
 * Assigns attributes and properties to a DOM element
 *
 * @function assignAttrs
 * @param {HTMLElement} el - The DOM element to modify
 * @param {Object} attrs - Object containing attributes and properties to assign
 * @param {string} [attrs.class] - CSS class names (space-separated string)
 * @param {Array|Object} [attrs.classes] - CSS classes as array or conditional object
 * @param {HTMLElement} [attrs.container] - Parent element to append this element to
 * @param {string} [attrs.value] - Value for form elements
 * @returns {HTMLElement} The modified element (for chaining)
 *
 * @description Handles special attribute cases:
 * - `class`: Splits space-separated strings and adds individual classes
 * - `classes`: Supports array of strings or conditional object format
 * - `container`: Appends element to specified parent (doesn't set as attribute)
 * - `value`: Sets both property and attribute for form compatibility
 *
 * @example
 * const el = document.createElement('div');
 * assignAttrs(el, {
 *   class: 'primary active',
 *   classes: ['highlight', { 'error': hasError }],
 *   id: 'main-content',
 *   'data-test': 'example'
 * });
 */
export function assignAttrs(el, attrs) {
  Object.keys(attrs).forEach((key) => {
    if (key === "class") {
      if (attrs[key].match(/\s/)) {
        attrs[key].split(/\s/).forEach((c) => el.classList.add(c))
      } else {
        el.classList.add(attrs[key])
      }
    } else if (key === "classes") {
      const classes = attrs[key]

      if (Array.isArray(classes)) {
        classes.forEach((c) => {
          if (typeof c === "string") {
            el.classList.add(c)
          } else {
            const k = Object.keys(c)[0]
            if (c[k]) el.classList.add(k)
          }
        })
      } else {
        Object.keys(classes).forEach((c) => {
          if (classes[c]) el.classList.add(c)
        })
      }
    } else if (key === "container") {
      // do nothing
    } else if (key === "value") {
      el.value = attrs[key]
      el.setAttribute("value", attrs[key])
    } else {
      el.setAttribute(key, attrs[key])
    }
  })

  return el
}

/**
 * Creates a DOM element with optional content and attributes
 *
 * @function elem
 * @param {string} tag - HTML tag name to create
 * @param {string|Array<Node|string>|Node} [content] - Element content
 * @param {Object} [attributes={}] - Attributes and properties to apply
 * @param {HTMLElement} [attributes.container] - Parent element to append to
 * @returns {HTMLElement} The created DOM element
 *
 * @description Content handling:
 * - String: Set as innerHTML
 * - Array: Append each item (Nodes directly, strings as span elements)
 * - Node: Append as child element
 *
 * @example
 * // Simple text element
 * const title = elem('h1', 'Page Title', { class: 'title' });
 *
 * // Element with mixed content
 * const paragraph = elem('p', [
 *   'Some text with ',
 *   elem('strong', 'bold'),
 *   ' and more text'
 * ]);
 *
 * // Auto-append to container
 * const listItem = elem('li', 'Item text', { container: parentList });
 */
export function elem(tag, content, attributes = {}) {
  const el = document.createElement(tag, content)

  if (content) {
    if (typeof content === "string") {
      el.innerHTML = content
    } else if (Array.isArray(content)) {
      content.forEach((c) => {
        if (c instanceof Node) el.appendChild(c)
        if (typeof c === "string") el.appendChild(elem("span", c))
      })
    } else {
      if (content instanceof Node) el.appendChild(content)
    }
  }

  assignAttrs(el, attributes)
  attributes?.container?.appendChild(el)

  return el
}

/**
 * Query selector function (single element) - jQuery-style $
 *
 * @function $
 * @param {string|HTMLElement} selectorOrContext - CSS selector or context element
 * @param {string} [selector] - CSS selector when first param is context
 * @returns {HTMLElement|null} First matching element or null
 *
 * @description Supports two calling patterns:
 * - $(selector) - Query from document
 * - $(context, selector) - Query within specific element
 *
 * @example
 * // Query from document
 * const element = $('.my-class');
 * const byId = $('#my-id');
 *
 * // Query within context
 * const container = $('.container');
 * const nested = $(container, '.nested-element');
 */
export function $(...args) {
  const { selector, context } =
    args[0] instanceof Node
      ? { context: args[0], selector: args[1] }
      : { context: document, selector: args[0] }

  return context.querySelector(selector)
}

/**
 * Query selector function (multiple elements) - jQuery-style $$
 *
 * @function $$
 * @param {string|HTMLElement} selectorOrContext - CSS selector or context element
 * @param {string} [selector] - CSS selector when first param is context
 * @returns {Array<HTMLElement>} Array of matching elements (empty if none found)
 *
 * @description Supports two calling patterns:
 * - $$(selector) - Query from document
 * - $$(context, selector) - Query within specific element
 * Returns a real Array (not NodeList) for easier manipulation.
 *
 * @example
 * // Query all from document
 * const elements = $$('.item');
 * const buttons = $$('button');
 *
 * // Query within context
 * const form = $('form');
 * const inputs = $$(form, 'input');
 *
 * // Use array methods
 * elements.forEach(el => el.classList.add('processed'));
 */
export function $$(...args) {
  const { selector, context } =
    args[0] instanceof Node
      ? { context: args[0], selector: args[1] }
      : { context: document, selector: args[0] }

  return toA(context.querySelectorAll(selector))
}

/**
 * Creates element factory functions with predefined tag and attributes
 *
 * @private
 * @function applyElem
 * @param {string} tag - HTML tag name
 * @param {Object} [xttrs={}] - Default attributes to apply
 * @returns {Function} Factory function that creates elements of specified tag
 *
 * @description Generated factory functions accept:
 * @param {string|Array|Node} content - Element content
 * @param {Object} attrs - Additional attributes (merged with defaults)
 * @returns {HTMLElement} Created element
 *
 * @example
 * // Internal usage - creates button factory with default type
 * const buttonFactory = applyElem('button', { type: 'button' });
 * const myButton = buttonFactory('Click Me', { class: 'primary' });
 */
function applyElem(tag, xttrs = {}) {
  return (content, attrs) => {
    return elem(tag, content, { ...xttrs, ...attrs })
  }
}

/*
 * HTML Element Factory Functions
 *
 * All standard HTML elements are exported as factory functions.
 * Each function follows the pattern: elementName(content, attributes)
 *
 * Special defaults:
 * - button: type="button"
 * - input: type="text"
 * - hr: self-closing, takes attributes only: hr(attrs)
 *
 * @example
 * // Basic usage
 * const title = h1('Page Title');
 * const text = p('Paragraph content', { class: 'intro' });
 *
 * // Form elements
 * const nameInput = input(null, { placeholder: 'Enter name', name: 'username' });
 * const submitBtn = button('Submit', { type: 'submit', class: 'btn-primary' });
 *
 * // Lists and containers
 * const list = ul([
 *   li('First item'),
 *   li('Second item'),
 *   li('Third item')
 * ], { class: 'menu' });
 */

export const a = applyElem("a")
export const abbr = applyElem("abbr")
export const address = applyElem("address")
export const area = applyElem("area")
export const article = applyElem("article")
export const aside = applyElem("aside")
export const audio = applyElem("audio")
export const b = applyElem("b")
export const base = applyElem("base")
export const bdi = applyElem("bdi")
export const bdo = applyElem("bdo")
export const blockquote = applyElem("blockquote")
export const body = applyElem("body")
export const br = applyElem("br")
export const button = applyElem("button", { type: "button" })
export const canvas = applyElem("canvas")
export const caption = applyElem("caption")
export const cite = applyElem("cite")
export const code = applyElem("code")
export const col = applyElem("col")
export const colgroup = applyElem("colgroup")
export const data = applyElem("data")
export const datalist = applyElem("datalist")
export const dd = applyElem("dd")
export const del = applyElem("del")
export const details = applyElem("details")
export const dfn = applyElem("dfn")
export const dialog = applyElem("dialog")
export const div = applyElem("div")
export const dl = applyElem("dl")
export const dt = applyElem("dt")
export const em = applyElem("em")
export const embed = applyElem("embed")
export const fencedframe = applyElem("fencedframe")
export const fieldset = applyElem("fieldset")
export const figcaption = applyElem("figcaption")
export const figure = applyElem("figure")
export const footer = applyElem("footer")
export const form = applyElem("form")
export const h1 = applyElem("h1")
export const h2 = applyElem("h2")
export const h3 = applyElem("h3")
export const h4 = applyElem("h4")
export const h5 = applyElem("h5")
export const h6 = applyElem("h6")
export const head = applyElem("head")
export const header = applyElem("header")
export const hgroup = applyElem("hgroup")
export const hr = (attrs) => applyElem("hr")(null, attrs)
export const html = applyElem("html")
export const i = applyElem("i")
export const iframe = applyElem("iframe")
export const img = applyElem("img")
export const input = applyElem("input", { type: "text" })
export const ins = applyElem("ins")
export const kbd = applyElem("kbd")
export const label = applyElem("label")
export const legend = applyElem("legend")
export const li = applyElem("li")
export const link = applyElem("link")
export const main = applyElem("main")
export const map = applyElem("map")
export const mark = applyElem("mark")
export const menu = applyElem("menu")
export const meta = applyElem("meta")
export const meter = applyElem("meter")
export const nav = applyElem("nav")
export const noscript = applyElem("noscript")
export const object = applyElem("object")
export const ol = applyElem("ol")
export const optgroup = applyElem("optgroup")
export const option = applyElem("option")
export const output = applyElem("output")
export const p = applyElem("p")
export const picture = applyElem("picture")
export const portal = applyElem("portal")
export const pre = applyElem("pre")
export const progress = applyElem("progress")
export const q = applyElem("q")
export const rp = applyElem("rp")
export const rt = applyElem("rt")
export const ruby = applyElem("ruby")
export const s = applyElem("s")
export const samp = applyElem("samp")
export const script = applyElem("script")
export const search = applyElem("search")
export const section = applyElem("section")
export const select = applyElem("select")
export const slot = applyElem("slot")
export const small = applyElem("small")
export const source = applyElem("source")
export const span = applyElem("span")
export const strong = applyElem("strong")
export const style = applyElem("style")
export const sub = applyElem("sub")
export const summary = applyElem("summary")
export const sup = applyElem("sup")
export const table = applyElem("table")
export const tbody = applyElem("tbody")
export const td = applyElem("td")
export const template = applyElem("template")
export const textarea = applyElem("textarea")
export const tfoot = applyElem("tfoot")
export const th = applyElem("th")
export const thead = applyElem("thead")
export const time = applyElem("time")
export const title = applyElem("title")
export const tr = applyElem("tr")
export const track = applyElem("track")
export const u = applyElem("u")
export const ul = applyElem("ul")
export const video = applyElem("video")
export const wbr = applyElem("wbr")
export const xmp = applyElem("xmp")
