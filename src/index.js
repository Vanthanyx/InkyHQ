const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const { ipcMain } = require("electron");
const fs = require("fs");

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1006,
    height: 556,
    frame: false,
    icon: path.join(__dirname, "assets", "squid.ico"),
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

    const windowWidth = 1006;
    const windowHeight = 556;
    mainWindow.setSize(windowWidth + 400, windowHeight);
  }
};
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("getAppVersion", () => {
  return app.getVersion();
});

ipcMain.handle("getBNameVersion", () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../package.json"))
  );
  return packageJson.bNameVersion;
});
