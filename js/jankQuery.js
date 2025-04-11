import { toA } from "./utils.js";

export function assignAttrs(el, attrs) {
  Object.keys(attrs).forEach((key) => {
    if (key === "class") {
      if (attrs[key].match(/\s/)) {
        attrs[key].split(/\s/).forEach((c) => el.classList.add(c));
      } else {
        el.classList.add(attrs[key]);
      }
    } else if (key === "classes") {
      const classes = attrs[key];

      if (Array.isArray(classes)) {
        classes.forEach((c) => {
          if (typeof c === "string") {
            el.classList.add(c);
          } else {
            const k = Object.keys(c)[0];
            if (c[k]) el.classList.add(k);
          }
        });
      } else {
        Object.keys(classes).forEach((c) => {
          if (classes[c]) el.classList.add(c);
        });
      }
    } else if (key === "container") {
      // do nothing
    } else if (key === "value") {
      el.value = attrs[key];
      el.setAttribute("value", attrs[key]);
    } else {
      el.setAttribute(key, attrs[key]);
    }
  });

  return el;
}

export function elem(tag, content, attributes = {}) {
  const el = document.createElement(tag, content);

  if (content) {
    if (typeof content === "string") {
      el.innerHTML = content;
    } else if (Array.isArray(content)) {
      content.forEach((c) => {
        if (c instanceof Node) el.appendChild(c);
        if (typeof c === "string") el.appendChild(elem("span", c));
      });
    } else {
      if (content instanceof Node) el.appendChild(content);
    }
  }

  assignAttrs(el, attributes);
  attributes?.container?.appendChild(el);

  return el;
}

export function $(...args) {
  const { selector, context } =
    args[0] instanceof Node
      ? { context: args[0], selector: args[1] }
      : { context: document, selector: args[0] };

  return context.querySelector(selector);
}

export function $$(...args) {
  const { selector, context } =
    args[0] instanceof Node
      ? { context: args[0], selector: args[1] }
      : { context: document, selector: args[0] };

  return toA(context.querySelectorAll(selector));
}

function applyElem(tag, xttrs = {}) {
  return (content, attrs) => {
    return elem(tag, content, { ...xttrs, ...attrs });
  };
}

export const a = applyElem("a");
export const abbr = applyElem("abbr");
export const address = applyElem("address");
export const area = applyElem("area");
export const article = applyElem("article");
export const aside = applyElem("aside");
export const audio = applyElem("audio");
export const b = applyElem("b");
export const base = applyElem("base");
export const bdi = applyElem("bdi");
export const bdo = applyElem("bdo");
export const blockquote = applyElem("blockquote");
export const body = applyElem("body");
export const br = applyElem("br");
export const button = applyElem("button", { type: "button" });
export const canvas = applyElem("canvas");
export const caption = applyElem("caption");
export const cite = applyElem("cite");
export const code = applyElem("code");
export const col = applyElem("col");
export const colgroup = applyElem("colgroup");
export const data = applyElem("data");
export const datalist = applyElem("datalist");
export const dd = applyElem("dd");
export const del = applyElem("del");
export const details = applyElem("details");
export const dfn = applyElem("dfn");
export const dialog = applyElem("dialog");
export const div = applyElem("div");
export const dl = applyElem("dl");
export const dt = applyElem("dt");
export const em = applyElem("em");
export const embed = applyElem("embed");
export const fencedframe = applyElem("fencedframe");
export const fieldset = applyElem("fieldset");
export const figcaption = applyElem("figcaption");
export const figure = applyElem("figure");
export const footer = applyElem("footer");
export const form = applyElem("form");
export const h1 = applyElem("h1");
export const h2 = applyElem("h2");
export const h3 = applyElem("h3");
export const h4 = applyElem("h4");
export const h5 = applyElem("h5");
export const h6 = applyElem("h6");
export const head = applyElem("head");
export const header = applyElem("header");
export const hgroup = applyElem("hgroup");
export const hr = (attrs) => applyElem("hr")(null, attrs);
export const html = applyElem("html");
export const i = applyElem("i");
export const iframe = applyElem("iframe");
export const img = applyElem("img");
export const input = applyElem("input", { type: "text" });
export const ins = applyElem("ins");
export const kbd = applyElem("kbd");
export const label = applyElem("label");
export const legend = applyElem("legend");
export const li = applyElem("li");
export const link = applyElem("link");
export const main = applyElem("main");
export const map = applyElem("map");
export const mark = applyElem("mark");
export const menu = applyElem("menu");
export const meta = applyElem("meta");
export const meter = applyElem("meter");
export const nav = applyElem("nav");
export const noscript = applyElem("noscript");
export const object = applyElem("object");
export const ol = applyElem("ol");
export const optgroup = applyElem("optgroup");
export const option = applyElem("option");
export const output = applyElem("output");
export const p = applyElem("p");
export const picture = applyElem("picture");
export const portal = applyElem("portal");
export const pre = applyElem("pre");
export const progress = applyElem("progress");
export const q = applyElem("q");
export const rp = applyElem("rp");
export const rt = applyElem("rt");
export const ruby = applyElem("ruby");
export const s = applyElem("s");
export const samp = applyElem("samp");
export const script = applyElem("script");
export const search = applyElem("search");
export const section = applyElem("section");
export const select = applyElem("select");
export const slot = applyElem("slot");
export const small = applyElem("small");
export const source = applyElem("source");
export const span = applyElem("span");
export const strong = applyElem("strong");
export const style = applyElem("style");
export const sub = applyElem("sub");
export const summary = applyElem("summary");
export const sup = applyElem("sup");
export const table = applyElem("table");
export const tbody = applyElem("tbody");
export const td = applyElem("td");
export const template = applyElem("template");
export const textarea = applyElem("textarea");
export const tfoot = applyElem("tfoot");
export const th = applyElem("th");
export const thead = applyElem("thead");
export const time = applyElem("time");
export const title = applyElem("title");
export const tr = applyElem("tr");
export const track = applyElem("track");
export const u = applyElem("u");
export const ul = applyElem("ul");
export const video = applyElem("video");
export const wbr = applyElem("wbr");
export const xmp = applyElem("xmp");
