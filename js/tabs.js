import { $, $$ } from "./jankQuery.js";

export function initializeTabs() {
  const tabSets = $$(`.tabs`);

  tabSets.forEach((tabSet) => {
    const tabs = $$(tabSet, "[pane]");
    const panes = tabs.map(getPane);

    selectTab(tabs[0], tabs, panes);

    tabSet.addEventListener("click", (e) => {
      const selectedTab = e
        .composedPath()
        .find((x) => x && x.getAttribute && x.getAttribute("pane"));

      if (selectedTab) {
        selectTab(selectedTab, tabs, panes);
      }
    });
  });
}

function getPane(tab) {
  const paneName = tab.getAttribute("pane");
  const pane = $(`.pane[name="${paneName}"]`);
  pane.tab = tab;
  tab.pane = pane;
  return pane;
}

function selectTab(tab, tabs, panes) {
  tabs.forEach((t) => t.classList.remove("selected"));
  panes.forEach((p) => p.classList.remove("selected"));
  tab.classList.add("selected");
  tab.pane.classList.add("selected");
}
