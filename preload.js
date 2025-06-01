const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke("ping"),
});

contextBridge.exposeInMainWorld("API", {
  hasHulkConfig: () => ipcRenderer.invoke("hasHulkConfig"),
  getAliases: () => ipcRenderer.invoke("getAliases"),
  getHomeDir: () => ipcRenderer.invoke("getHomeDir"),
  getEnv: () => ipcRenderer.invoke("getEnv"),
  getBashRC: () => ipcRenderer.invoke("getBashRC"),
  saveAliases: (...args) => ipcRenderer.invoke("saveAliases", ...args),
});
