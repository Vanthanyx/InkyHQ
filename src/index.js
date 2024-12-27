const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const { ipcMain } = require("electron");

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1006,
    height: 556,
    frame: false,
    icon: path.join(__dirname, "assets", "icon.ico"),
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

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
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
