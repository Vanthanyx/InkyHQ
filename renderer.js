const { ipcRenderer } = require("electron");

function askMinimize() {
  if (confirm("Do you want to minimize the launcher?")) {
    ipcRenderer.send("minimize-window");
  }
}
