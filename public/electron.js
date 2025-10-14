const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

global.pythonProcess = null;

const basePath = app.getAppPath();
let mainWindow;
let loaderWindow;

const isDevelopmentEnv = () => {
  return !app.isPackaged;
};

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // If second instance is instantiated, the app focuses on the current window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.commandLine.appendSwitch("in-process-gpu");
if (app.getGPUFeatureStatus().gpu_compositing.includes("disabled")) {
  app.disableHardwareAcceleration();
}
app.whenReady().then(async () => {
  createLoaderWindow(); // Create the loader window
  global.pythonProcess = createPythonProcess();
  await waitForPythonProcessReady(global.pythonProcess); // Wait for the Python process to be ready
  try {
    const result = await runPythonScript(mainWindow, "run_clear_temp_dir.py", {});
    console.log("Result of clearing temp directory:", result);
  } catch (error) {
    console.error("Error clearing temp directory:", error);
  }
  loaderWindow.close(); // Close the loader window
  loaderWindow = null; // Clear the loader window reference
  createMainWindow(); // Create the main application window
});

const createLoaderWindow = () => {
  const iconPath = path.join(basePath, "build", "favicon.ico");

  loaderWindow = new BrowserWindow({
    height: 200,
    width: 300,
    center: true,
    alwaysOnTop: true,
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const loaderPath = path.join(basePath, "build", "loader.html");
  loaderWindow.loadFile(loaderPath);
};

const waitForPythonProcessReady = (pythonProcess) => {
  return new Promise((resolve) => {
    const handleData = (data) => {
      const message = data.toString().trim();
      try {
        const event = JSON.parse(message);
        if (event.type === "event" && event.name === "ready") {
          pythonProcess.stdout.off("data", handleData);
          resolve();
        }
      } catch (error) {
        console.error("Error parsing Python stdout:", error);
      }
    };
    pythonProcess.stdout.on("data", handleData);
  });
};

const createMainWindow = () => {
  const iconPath = path.join(basePath, "build", "favicon.ico");

  mainWindow = new BrowserWindow({
    minHeight: 720,
    minWidth: 1280,
    frame: false,
    resizable: true,
    autoHideMenuBar: true,
    thickFrame: true,
    icon: iconPath,
    show: false,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(basePath, "build", "preload.js"),
      webSecurity: true,
      nodeIntegration: true,
    },
  });

  mainWindow.show();
  mainWindow.maximize();
  mainWindow.loadURL(`file://${path.join(basePath, "build", "index.html")}`);
  if (isDevelopmentEnv()) {
    mainWindow.webContents.openDevTools();
  }
};

const runPythonScript = (mainWindow, scriptName, data) => {
  return new Promise((resolve, reject) => {
    let buffer = "";

    const message = {
      scriptName,
      data,
    };

    global.pythonProcess.stdin.write(JSON.stringify(message) + "\n");

    const handleData = (data) => {
      buffer += data.toString();
      let boundary = buffer.indexOf("\n");

      while (boundary !== -1) {
        const rawData = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 1);

        if (rawData.trim().startsWith("{") || rawData.trim().startsWith("[")) {
          try {
            const response = JSON.parse(rawData);
            if (response.type === "progress") {
              mainWindow.webContents.send("progress", response);
            } else {
              global.pythonProcess.stdout.off("data", handleData);
              if (response.success) {
                resolve(response.result);
              } else {
                reject(new Error(response.error));
              }
            }
          } catch (error) {
            console.error("Error parsing Python stdout:", error);
            reject(error);
          }
        }

        boundary = buffer.indexOf("\n");
      }
    };

    global.pythonProcess.stdout.on("data", handleData);
  });
};

// Create a long-running Python process
const createPythonProcess = () => {
  const scriptPath = path.join(basePath, "backend", "app.py");
  const pythonExecutable = path.join(basePath, "climada_env", "python.exe");

  try {
    const process = spawn(pythonExecutable, [scriptPath], {
      stdio: ["pipe", "pipe", "pipe", "ipc"],
    });

    process.on("error", (error) => {
      console.error("Error occurred during Python process creation:", error);
    });

    process.stdout.on("data", (data) => {
      console.log("Python stdout:", data.toString());
    });

    process.stderr.on("data", (data) => {
      console.log("Python stderr:", data.toString());
    });

    return process;
  } catch (error) {
    console.error("Error occurred during Python process creation:", error);
    throw error;
  }
};

ipcMain.handle("runPythonScript", async (_, { scriptName, data }) => {
  try {
    const result = await runPythonScript(mainWindow, scriptName, data);
    return { success: true, result };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("is-development-env", () => {
  return !app.isPackaged;
});

ipcMain.handle("fetch-temp-dir", () => {
  const tempFolderPath = path.join(app.getAppPath(), "data", "temp");
  return tempFolderPath;
});

ipcMain.handle("fetch-report-dir", () => {
  const reportFolderPath = path.join(app.getAppPath(), "data", "reports");
  return reportFolderPath;
});

// Handle clear temporary directory request
ipcMain.handle("clear-temp-dir", async () => {
  try {
    const scriptName = "run_clear_temp_dir.py";
    const data = {}; // assuming no additional data is required
    const result = await runPythonScript(mainWindow, scriptName, data);
    console.log("Temporary directory cleared:", result);
    return { success: true, result };
  } catch (error) {
    console.error("Failed to clear temporary directory:", error);
    return { success: false, error: error.message };
  }
});

// Handle save screenshot request
ipcMain.handle("save-screenshot", async (event, { blob, filePath }) => {
  const buffer = Buffer.from(blob, "base64");

  // Ensure the directory exists
  const dir = path.dirname(filePath);
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) {
      event.sender.send("save-screenshot-reply", { success: false, error: err.message });
      return;
    }

    // Write the file
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        event.sender.send("save-screenshot-reply", { success: false, error: err.message });
      } else {
        event.sender.send("save-screenshot-reply", { success: true, filePath });
      }
    });
  });
});

// Handle folder copy request
ipcMain.handle("copy-folder", async (event, { sourceFolder, destinationFolder }) => {
  try {
    // Ensure the destination directory exists
    fs.mkdirSync(destinationFolder, { recursive: true });

    // Read all files in the source folder
    const files = fs.readdirSync(sourceFolder);

    // Loop through files and copy them
    for (const file of files) {
      const sourcePath = path.join(sourceFolder, file);
      const destinationPath = path.join(destinationFolder, file);

      // Copy the file
      fs.copyFileSync(sourcePath, destinationPath);
    }

    event.sender.send("copy-folder-reply", { success: true, destinationFolder });
  } catch (error) {
    event.sender.send("copy-folder-reply", { success: false, error: error.message });
  }
});

// Handle copy file from temp folder request
ipcMain.handle("copy-file", async (event, { sourcePath, destinationPath }) => {
  try {
    // Ensure the destination directory exists
    const dir = path.dirname(destinationPath);
    fs.mkdirSync(dir, { recursive: true });

    // Copy the file
    fs.copyFileSync(sourcePath, destinationPath);

    event.sender.send("copy-file-reply", { success: true, destinationPath });
  } catch (error) {
    event.sender.send("copy-file-reply", { success: false, error: error.message });
  }
});

ipcMain.handle("open-report", async (event, reportPath) => {
  try {
    await shell.openPath(reportPath);
  } catch (error) {
    console.error("Failed to open report:", error);
  }
});

ipcMain.on("minimize", () => {
  mainWindow.minimize();
});

ipcMain.on("shutdown", () => {
  console.log("Shutting down application...");

  if (global.pythonProcess && !global.pythonProcess.killed) {
    global.pythonProcess.kill();
  }

  app.quit();
});

ipcMain.on("reload", async () => {
  console.log("Reload CLIMADA App...");

  try {
    const result = await runPythonScript(mainWindow, "run_clear_temp_dir.py", {});
    console.log("Temporary directory cleared:", result);
  } catch (error) {
    console.error("Failed to clear temporary directory:", error);
  }

  // Reload the application
  mainWindow.webContents.reloadIgnoringCache();
});

// Check for updates after the app is ready
app.on("ready", () => {
  if (!isDevelopmentEnv()) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

autoUpdater.setFeedURL({
  provider: "generic",
  url: "https://ath-git.swordgroup.lan/unu/climada-unu/-/releases",
});

// Listen for update-available event
autoUpdater.on("update-available", () => {
  dialog.showMessageBox({
    type: "info",
    title: "Update available",
    message: "A new version is available and will be downloaded in the background.",
  });
});

// Listen for update-downloaded event
autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Update Ready",
      message: "Update downloaded. The app will restart to apply the update.",
    })
    .then(() => {
      autoUpdater.quitAndInstall();
    });
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on("before-quit", () => {
  console.log("Terminating Python process before app quits...");

  if (global.pythonProcess && !global.pythonProcess.killed) {
    global.pythonProcess.kill();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
