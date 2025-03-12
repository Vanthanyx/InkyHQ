const { ipcRenderer } = require("electron");
const os = require("os");
const path = require("path");
const fs = require("fs");
ipcRenderer.invoke("getAppVersion").then((currentVersion) => {
  localStorage.setItem("CURRENT_VERSION", currentVersion);
});
ipcRenderer.invoke("getBNameVersion").then((bNameVersion) => {
  localStorage.setItem("BNAME_VERSION", bNameVersion);
});

const username = os.userInfo().username;
localStorage.setItem("OS_USERNAME", username);

function logFile() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const logFileName = `LF_${year}${month}${day}_${hours}${minutes}${seconds}.log`;

  sessionStorage.setItem("SESSION_LOG_FILE", logFileName);
  var logFile = path.join(
    os.homedir(),
    "AppData",
    "Roaming",
    ".voidlink",
    "LOGS",
    logFileName
  );
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, "SESSION BEGAN AT: " + now.toUTCString() + "\n");
  }
}

const webdbrun = sessionStorage.getItem("WEB_DB_RUN");
if (!webdbrun) {
  logFile();
}
