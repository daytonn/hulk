export function toArray(list) {
  if (typeof list === "string") return [list];
  return Array.from(list);
}

export const toA = toArray;
