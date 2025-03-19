const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("node:path");
const { ipcMain } = require("electron");
const fs = require("fs");

if (require("electron-squirrel-startup")) {
  app.quit();
}

// ============================================================
// Main VoidLink App Window
// ============================================================

let loadingWindow;

const createLoadingWindow = () => {
  loadingWindow = new BrowserWindow({
    width: 350,
    height: 350,
    frame: false,
    //alwaysOnTop: true,
    icon: path.join(__dirname, "assets", "bh2.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  loadingWindow.loadFile(path.join(__dirname, "main.html"));

  if (process.env.NODE_ENV !== "development") {
    loadingWindow.on("resize", () => {
      loadingWindow.setSize(350, 350);
    });
  }

  loadingWindow.on("close", (event) => {
    event.preventDefault();
    loadingWindow.hide();
  });
};

let mainWindow;
let tray = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1006,
    height: 556,
    frame: false,
    icon: path.join(__dirname, "assets", "bh2.ico"),
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  if (process.env.NODE_ENV !== "development") {
    mainWindow.on("resize", () => {
      mainWindow.setSize(1006, 556);
    });
  } else {
    mainWindow.webContents.openDevTools();
    mainWindow.setSize(1406, 556); // 1006 + 400
  }

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  createTray();
};

// ============================================================
// Tray
// ============================================================

const createTray = () => {
  tray = new Tray(path.join(__dirname, "assets", "bh2.ico"));
  let currentRelease = "beta";

  async function updateVersionLabel() {
    try {
      const appVersion = app.getVersion();
      let bNameVersion = "UNKNOWN";

      const packageJson = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../package.json"))
      );
      bNameVersion = packageJson.bNameVersion || "Unknown";

      const versionLabel = `Version: ${appVersion} (${bNameVersion})`;

      const contextMenu = Menu.buildFromTemplate([
        { label: "Show", click: () => mainWindow.show() },
        { label: "Hide", click: () => mainWindow.hide() },
        { label: "Reload", click: () => mainWindow.reload() },
        { label: "Exit", click: () => app.quit() },
        { type: "separator" },
        {
          label: "Beta Release",
          type: "radio",
          checked: currentRelease === "beta",
        },
        {
          label: "Alpha Release",
          type: "radio",
          checked: currentRelease === "alpha",
          enabled: false,
        },
        { type: "separator" },
        {
          label: versionLabel,
          enabled: false,
        },
      ]);

      tray.setToolTip("VoidLink");
      tray.setContextMenu(contextMenu);
    } catch (err) {
      console.error("Error loading version:", err);
    }
  }

  setTimeout(updateVersionLabel, 1000);

  tray.on("click", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
};

// ============================================================
// App Events
// ============================================================

app.whenReady().then(() => {
  createLoadingWindow();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createLoadingWindow();
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// ============================================================
// IPC Events
// ============================================================

ipcMain.on("window-close", () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on("window-minimize", () => {
  if (mainWindow) mainWindow.hide();
});

ipcMain.on("window-show", () => {
  if (mainWindow) mainWindow.show();
});

ipcMain.on("check-for-updates", () => {
  const appVersion = app.getVersion();
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../package.json"))
  );
  const bNameVersion = packageJson.bNameVersion;
  return { appVersion, bNameVersion };
});

ipcMain.handle("getAppVersion", () => app.getVersion());

ipcMain.handle("getBNameVersion", () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../package.json"))
  );
  return packageJson.bNameVersion;
});
