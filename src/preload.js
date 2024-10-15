const { ipcRenderer } = require("electron");
ipcRenderer.invoke("getAppVersion").then((currentVersion) => {
  localStorage.setItem("CURRENT_VERSION", currentVersion);
});
