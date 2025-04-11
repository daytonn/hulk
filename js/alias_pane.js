import { $, $$, h3, input, span, button, li, hr, option } from "./jankQuery.js";
import { trash } from "./icons.js";

export function renderAliases(aliases, list) {
  list.innerHTML = "";
  aliases.forEach(({ alias, command, text, type, group }) => {
    let listItem;

    if (type === "alias") {
      listItem = createAlias({ alias, command: printableCommand(command) });
    }

    if (type === "line" && group) {
      listItem = createGroupHeading(text);
    }

    if (listItem) list.appendChild(listItem);
  });
}

function isGroupHeading(text) {
  return (
    text !== "" &&
    !text.match(/#\!\/usr\//) &&
    !text.match(/alias\s([\w-\.]+)=/) &&
    text.match(/^\s{0,}?#\s{0,}?/)
  );
}

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
    { class: "alias" },
  );
}

function printableCommand(command) {
  if (command.match(/^'/)) {
    return command.replace(/^'/, "").replace(/'$/, "");
  } else {
    return command;
  }
}

export function createAliasSearchFilter(filter, results, aliases) {
  filter.focus();

  filter.addEventListener("keyup", ({ key }) => {
    const searchTerm = filter.value;
    results.innerHTML = "";

    if (searchTerm === "") return;

    const foundAliases = aliases.filter(({ type, alias, command }) => {
      if (type === "alias") {
        const aliasPattern = new RegExp(`^${searchTerm}`);
        const cmdPattern =
          searchTerm.length > 3 ? new RegExp(`${searchTerm}`) : aliasPattern;
        return alias.match(aliasPattern) || command.match(cmdPattern);
      }

      return false;
    });

    foundAliases.forEach(({ alias, command }) => {
      li(
        [
          span(alias, { class: "alias" }),
          span(" = "),
          span(printableCommand(command), { class: "command" }),
        ],
        { container: results },
      );
    });
  });
}

function stripHeadingTextFormatting(text) {
  return text.replace(/\s{0,}#\s{0,}/, "");
}

function createGroupHeading(text) {
  if (isGroupHeading(text)) {
    const group = h3(stripHeadingTextFormatting(text));
    return li([hr(), group, hr()], { class: "group-heading" });
  }
}

export function createAddAliasModal(modal, aliasList, allAliases) {
  const mask = $(".modal-mask");
  const modals = $$(".modal-window");
  const closeButton = $(modal, "button.icon.delete");
  const name = modal.getAttribute("name");
  const submitButton = $(modal, `button[type="submit"]`);
  const inputs = $$(modal, `input[type="text"]`);
  const groupSelect = $(modal, "select");
  const [aliasInput, commandInput] = inputs;
  const groups = allAliases.filter(
    ({ type, group }) => type === "line" && group,
  );

  const closeModal = () => {
    modal.classList.remove("open");
    mask.classList.remove("open");
    $(`.pane[name="aliases"] .search-or-add input`).focus();
  };

  const openModal = () => {
    window.Store.add("foo", { name: "test", required: false, type: "string" })
    console.log(window.Store.get("foo"))
    modal.classList.add("open");
    mask.classList.add("open");
    aliasInput.focus();
  };

  groups.forEach(({ text }) => {
    const groupName = stripHeadingTextFormatting(text);
    const opt = option(groupName, { value: groupName, container: groupSelect });
  });

  const saveAlias = async () => {
    const alias = {
      type: "alias",
      alias: aliasInput.value,
      command: commandInput.value,
      group: groupSelect.value === "none" ? undefined : groupSelect.value,
    };

    aliasInput.value = "";
    commandInput.value = "";

    console.log(`${alias.alias}=${alias.command}`);
    console.log("alias", alias);

    await window.API.saveAliases();
  };

  closeButton.addEventListener("click", () => closeModal());

  document.body.addEventListener("keyup", (e) => {
    const { key, altKey } = e;
    if (key === "a" && altKey) {
      $(`.tabs [pane="aliases"]`).click();
      openModal();
    }
    if (key === "e" && altKey) {
      $(`.tabs [pane="environment"]`).click();
      $(`.pane[name="environment"] .search-or-add input`).focus();
    }
    if (key === "b" && altKey) {
      $(`.tabs [pane="bashrc"]`).click();
    }
    if (key === "f" && altKey) {
      $(`.tabs [pane="functions"]`).click();
    }
    if (key === "f" && altKey) $(".search-or-add input").focus();
  });

  submitButton.addEventListener("click", () => {
    if (aliasInput.value === "" || commandInput.value === "") return;
    saveAlias();
    closeModal();
  });

  mask.addEventListener("click", () => closeModal());

  modal.addEventListener("keyup", ({ key }) => {
    if (aliasInput.value === "" || commandInput.value === "") return;

    if (key === "Enter") {
      saveAlias();
      closeModal();
    }
  });

  document.addEventListener("keyup", ({ key }) => {
    if (key === "Escape") closeModal();
  });

  const triggers = $$(`[modal="${name}"]`);

  triggers.forEach((trigger) => {
    console.log("trigger", trigger);
    trigger.addEventListener("click", () => {
      console.log("clicked");
      openModal();
      modal.querySelector("input").focus();
    });
  });
}

export async function fetchAliases() {
  return await window.API.getAliases();
}
