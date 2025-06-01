import { $ } from "./js/lib/jankQuery/index.js"
import { initializeTabs } from "./js/lib/tabs/index.js"
import Store from "./js/lib/store/index.js"
import "./js/components/index.js"
window.Store = new Store()
import {
  createAddAliasModal,
  createAliasSearchFilter,
  renderAliases,
} from "./js/alias_pane.js"
import { fetchEnvFile, renderEnvVars } from "./js/environment_pane.js"
import { fetchBashRCFile, renderBashRC } from "./js/bashrc_panel.js"
const aliasList = $("#alias-list")
const aliasSearch = $(".search-or-add input")
const aliasSearchResults = $(".alias-search-results")
const aliasModal = $(".add-alias-modal")
const envVarList = $("#variable-list")
const bashRCContent = $(".bashrc-content")
const aliases = await window.Store.fetch("aliases")
const env = await fetchEnvFile()
const bashrc = await fetchBashRCFile()

initializeTabs()
createAliasSearchFilter(aliasSearch, aliasSearchResults, aliases)
renderAliases(aliases, aliasList)
createAddAliasModal(aliasModal, aliasList, aliases)
renderEnvVars(envVarList, env)
renderBashRC(bashrc, bashRCContent)

bashRCContent.addEventListener("keyup", ({ key, ctrlKey }) => {
  if (ctrlKey && key === "s") console.log("save", bashRCContent.innerText)
})

setTimeout(() => {
  if (window.hljs) hljs.highlightAll()
}, 1000)
