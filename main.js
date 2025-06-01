const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const util = require('node:util');
const readline = require("readline");
const os = require("os");

class ConfigFileReadError extends Error {
  constructor(path) {
    super(`Could not read config file ${path}`)
    this.name = "ConfigFileReadError";
  }
}

class ConfigFileParseError extends Error {
  constructor(path) {
    super(`Could not parse config file ${path}`)
    this.name = "ConfigFileParseError";
  }
}

class ConfigFileNoParserError extends Error {
  constructor() {
    super("No parser defined for configuration")
    this.name = "ConfigFileNoParserError";
  }
}

class ConfigFile {
  constructor(path) {
    if (!path) throw new Error("Must provide a path")
    this.path = path
  }

  get exists() {
    try {
      const stats = fs.statSync(`${this.path}`)
      return stats.isFile() || stats.isDirectory()
    } catch (_error) {
      return false;
    }
  }

  read() {
    if (!this.exists) throw new ConfigFileReadError(this.path)
    if (this._file) return this._file

    this._file = fs.readFileSync(this.path)

    return this._file
  }

  toArray() {
    return this.read()
      .toString()
      .split(/\r?\n/)
      .map((line) => line);
  }

  parse() {
    throw new Error("Base implementation")
  }
}

class AliasFile extends ConfigFile {
  constructor() {
    super(`${os.homedir()}/.aliases`)
  }

  parse() {
    console.log("dicks", this.toArray())
  }
}

function print(content) {
  console.log("")
  console.log(`  ${content} `)
  console.log("")
}

class Application {
  configure() {
    fs.mkdirSync(this.configPath, "-p")
    fs.writeFileSync(this.configFilePath, "# Hulk configuration")
  }

  get home() {
    if (!this._home) {
      this._home = os.homedir()
    }

    return this._home
  }

  set home(value) {
    this._home = value
  }

  get configFile() {
    return fs.readFileSync(this.configFilePath)
  }

  get isConfigured() {
    if (!hasConfig()) return false;

    const stats = fs.statSync(this.configPath)

    return stats.isDirectory();
  }

  get bashrcPath() {
    return this.path(".bashrc")
  }

  get envPath() {
    return this.path(".env")
  }

  get aliasPath() {
    return this.path(".aliases")
  }

  get hasConfigDir() {
    const stats = fs.statSync(`${os.homedir()}/.config`)

    return stats.isDirectory()
  }

  get configPath() {
    return this.path(".config", "hulk")
  }

  get configFilePath() {
    return this.path(this.configPath, "config.json")
  }

  get aliasFile() {
    return fs.readFileSync(this.aliasPath)
  }

  get bashrcFile() {
    return fs.readFileSync(this.bashrcPath)
  }

  get envFile() {
    return fs.readFileSync(this.envPath)
  }

  get aliasBackupFilename() {
    return this.path(`${this.aliasFile}.hulk-backup`)
  }

  get aliases() {
    return this.aliasFile
      ? this.toLines(this.aliasFile).map(this.parseAlias.bind(this))
      : []
  }

  get bashrc() {
    return this.toLines(this.bashrcFile);
  }

  get env() {
    let currentGroup = "General";

    return this.toLines(this.envFile).map((line) => {
      const envVar = this.parseEnvVar(line);
      if (envVar.type === "group") currentGroup = envVar.name;
      if (envVar.type === "var") envVar.group = currentGroup;
      return envVar;
    });
  }

  path(...args) {
    return `${this.home}/${args.join("/")}`
  }

  parseAlias(line, i) {
    const matches = line.match(/^(?!#)\s{0,}?alias\s([\w-\.]+)=(.+)$/);
    let currentGroup = "General";

    if (matches) {
      if (this.isGroup(line)) currentGroup = line.replace(/\s{0,}#\s{0,}/, "");

      const alias = {
        line: i,
        type: "alias",
        alias: matches[1],
        command: matches[2].replace(/^\"(.+)\"/, "$1"),
        group: currentGroup,
      };

      return alias;
    } else {
      const meta = { line: i, type: "line", text: line, group: this.isGroup(line) };
      return meta;
    }
  }

  parseEnvVar(line) {
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

  isGroup(line) {
    return (
      line !== "" &&
      !line.match(/#\!\/usr\//) &&
      !line.match(/alias\s([\w-\.]+)=/)
    );
  }

  toLines(file) {
    return file
      .toString()
      .split(/\r?\n/)
      .map((line) => line);
  }

  aliasToString({ type, alias, command, text }) {
    if (type === "alias") return `alias ${alias}="${command}"`
    if (type === "line") return text || ""
    return ""
  }

  saveAliases(aliases) {
    const lines = aliases.map(this.aliasToString.bind(this))
    lines.splice(1, 0, "# This file is generated by Hulk. Direct edits may be overwritten")
    fs.writeFileSync(this.aliasPath, lines.join("\n"))
  }
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

const App = new Application()

app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong");
  ipcMain.handle("saveAliases", (_, ...args) => App.saveAliases(...args));
  ipcMain.handle("getHomeDir", (_, ...args) => App.home);
  ipcMain.handle("hasHulkConfig", (_, ...args) => App.isConfigured);
  ipcMain.handle("getAliases", (_, ...args) => App.aliases);
  ipcMain.handle("getEnv", (_, ...args) => App.env);
  ipcMain.handle("getBashRC", (_, ...args) => App.bashrc);
  createWindow();
});




// const aliasFile = new AliasFile()
// console.log("")
// console.log("configFile", aliasFile.path, aliasFile.exists)
// aliasFile.toArray().forEach(line => {
//   console.log(line)
// })
// console.log("")
