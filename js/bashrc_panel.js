import { code } from "./jankQuery.js";

export async function fetchBashRCFile() {
  return await window.API.getBashRC();
}

export function renderBashRC(lines, container) {
  const snippet = code(lines.join("\n"), {
    class: "language-bash",
    container,
    contenteditable: "",
    spellcheck: false,
  });
}
