const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const readline = require("readline");
const os = require("os");

function getHomeDir() {
  return "~";
}

function isGroup(line) {
  return (
    line !== "" &&
    !line.match(/#\!\/usr\//) &&
    !line.match(/alias\s([\w-\.]+)=/)
  );
}

function getBashRC() {
  const file = fs.readFileSync("/home/daytonn/.bashrc");
  return toLines(file);
}

function getAlias(line, i) {
  const matches = line.match(/^(?!#)\s{0,}?alias\s([\w-\.]+)=(.+)$/);
  let currentGroup = "General";

  if (matches) {
    if (isGroup(line)) currentGroup = line.replace(/\s{0,}#\s{0,}/, "");

    const alias = {
      line: i,
      type: "alias",
      alias: matches[1],
      command: matches[2].replace(/^\"(.+)\"/, "$1"),
      group: currentGroup,
    };

    return alias;
  } else {
    const meta = { line: i, type: "line", text: line, group: isGroup(line) };
    return meta;
  }
}

function createEnvVar(line) {
  if (line.includes("#!/usr/bin/env")) {
    const type = "shebang";

    return { line, type };
  } else if (line.includes("export")) {
    const [_, name, v] = line.match(/^\s{0,}export\s([\w_]+)=(.+)$/);
    const value = v.match(/^"/)
      ? v.replace(/^\\?"/m, "").replace(/\\?"$/, "")
      : v;
    const type = "var";

    return { line, name, value, type };
  } else if (line.match(/^\s{0,}#\s{0,}\w+/)) {
    const matches = line.match(/^\s{0,}#\s{0,}(.+)$/);
    const name = matches ? matches[1] : "General";
    const type = "group";

    return { line, type, name };
  } else {
    const type = "line";
    return { line, type };
  }
}

function getAliases() {
  const file = fs.readFileSync("/home/daytonn/.aliases");
  if (!file) return;
  backupAliases(file);
  const aliases = toLines(file).map(getAlias);
  return file ? aliases : [];
}

function backupAliasFilename() {
  return `${os.homedir()}/.aliases.hulk-backup`
}

function saveAliases() {
  console.log("!!!!!!!!!!!!!!!!")
  console.log("!!!!!!!!!!!!!!!!")
  console.log("")

  console.log("")
  console.log("!!!!!!!!!!!!!!!!")
  console.log("!!!!!!!!!!!!!!!!")
}

function backupAliases(file) {
  fs.writeFileSync(backupAliasFilename(), file)
}

function getEnv() {
  const file = fs.readFileSync("/home/daytonn/.env");
  let currentGroup = "General";

  return toLines(file).map((line) => {
    const envVar = createEnvVar(line);
    if (envVar.type === "group") currentGroup = envVar.name;
    if (envVar.type === "var") envVar.group = currentGroup;
    return envVar;
  });
  // const envVars = file.toString().split(//)
}

function toLines(file) {
  return file
    .toString()
    .split(/\r?\n/)
    .map((line) => line);
}

function hasHulkConfig() {
  return fs.existsSync("/home/daytonn/.config/hulk/config.json");
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 2560,
    height: 1440,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong");
  ipcMain.handle("saveAliases", saveAliases);
  ipcMain.handle("getHomeDir", () => getHomeDir);
  ipcMain.handle("hasHulkConfig", hasHulkConfig);
  ipcMain.handle("getAliases", getAliases);
  ipcMain.handle("getEnv", getEnv);
  ipcMain.handle("getBashRC", getBashRC);
  createWindow();
});
