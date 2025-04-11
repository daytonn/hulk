import { li, input, h2, hr, button, span } from "./jankQuery.js";
import { trash } from "./icons.js";

export async function fetchEnvFile() {
  return await window.API.getEnv();
}

export function renderEnvVars(container, env_vars) {
  env_vars.forEach(({ type, name, value }) => {
    if (type === "var") {
      const nameInput = input({ name: "name" });
      nameInput.value = name;
      const valueInput = input({ name });
      valueInput.value = value;
      const btn = button(trash("var(--color-white)"), { class: "delete icon" });
      li([nameInput, span("=", { class: "equals" }), valueInput, btn], {
        container,
      });
    } else if (type === "group") {
      li([hr(), h2(name), hr()], { container });
    }
  });
}
