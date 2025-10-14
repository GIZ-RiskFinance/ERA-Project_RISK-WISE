const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  clearTempDir: () => ipcRenderer.invoke("clear-temp-dir"),
  fetchTempDir: () => ipcRenderer.invoke("fetch-temp-dir"),
  fetchReportDir: () => ipcRenderer.invoke("fetch-report-dir"),
  isDevelopmentEnv: () => ipcRenderer.invoke("is-development-env"),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  remove: (channel, callback) => ipcRenderer.removeListener(channel, callback),
  send: (channel, data) => ipcRenderer.send(channel, data),
  saveScreenshot: (blob, filePath) => ipcRenderer.invoke("save-screenshot", { blob, filePath }),
  onSaveScreenshotReply: (callback) => ipcRenderer.on("save-screenshot-reply", callback),
  copyFile: (sourcePath, destinationPath) =>
    ipcRenderer.invoke("copy-file", { sourcePath, destinationPath }),
  onCopyFileReply: (callback) => ipcRenderer.on("copy-file-reply", callback),
  copyFolder: (sourceFolder, destinationFolder) =>
    ipcRenderer.invoke("copy-folder", { sourceFolder, destinationFolder }),
  onCopyFolderReply: (callback) => ipcRenderer.on("copy-folder-reply", callback),
  openReport: (reportPath) => ipcRenderer.invoke("open-report", reportPath),
});

contextBridge.exposeInMainWorld("api", {
  runPythonScript: async ({ scriptName, data }) => {
    return await ipcRenderer.invoke("runPythonScript", { scriptName, data });
  },
});
