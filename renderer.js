import { $ } from "./js/jankQuery.js";
import { initializeTabs } from "./js/tabs.js";
import {
  createAddAliasModal,
  createAliasSearchFilter,
  fetchAliases,
  renderAliases,
} from "./js/alias_pane.js";
import { fetchEnvFile, renderEnvVars } from "./js/environment_pane.js";
import { fetchBashRCFile, renderBashRC } from "./js/bashrc_panel.js";
const aliasList = $("#alias-list");
const aliasSearch = $(".search-or-add input");
const aliasSearchResults = $(".alias-search-results");
const aliasModal = $(".add-alias-modal");
const envVarList = $("#variable-list");
const bashRCContent = $(".bashrc-content");
const aliases = await fetchAliases();
const env = await fetchEnvFile();
const bashrc = await fetchBashRCFile();
import Store from "./js/lib/store/index.js";

window.Store = new Store();

initializeTabs();
createAliasSearchFilter(aliasSearch, aliasSearchResults, aliases);
renderAliases(aliases, aliasList);
createAddAliasModal(aliasModal, aliasList, aliases);
renderEnvVars(envVarList, env);
renderBashRC(bashrc, bashRCContent);

bashRCContent.addEventListener("keyup", ({ key, ctrlKey }) => {
  if (ctrlKey && key === "s") console.log("save", bashRCContent.innerText);
});

setTimeout(() => {
  if (window.hljs) {
    console.log("we have highlighter");
    hljs.highlightAll();
  } else {
    console.log("no highlighter");
  }
}, 1000);
