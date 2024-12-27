document.addEventListener("DOMContentLoaded", () => {
  const lPath = localStorage.getItem("LPATH");
  if (lPath) {
    document.getElementById("lPath").value = lPath;
    const baseElement = document.getElementById("base");
    if (baseElement) {
      baseElement.remove();
    }
    const lPathElement = document.getElementById("lPath");
    lPathElement.innerHTML = lPath;
  } else {
    const setupElement = document.getElementById("setup");
    if (setupElement) {
      setupElement.remove();
    }
  }
});

function verifyPath() {
  const lPath = document.getElementById("lPath").value;
  const fs = require("fs");
  const path = require("path");

  const executableExtensions = [".exe"];

  if (fs.existsSync(lPath)) {
    if (fs.lstatSync(lPath).isDirectory()) {
      console.log("The folder exists.");
    } else if (executableExtensions.includes(path.extname(lPath))) {
      console.log("The file is an executable.");
      localStorage.setItem("LPATH", lPath);
      JSAlert.alert("Set launcher path to: " + lPath).then(function () {
        window.location.reload();
      });
    } else {
      console.log("The file is not an executable.");
      JSAlert.alert("The file is not an executable.");
    }
  } else {
    console.log("The folder does not exist.");
    JSAlert.alert("The folder does not exist.");
  }
}

function launch() {
  const lPath = localStorage.getItem("LPATH");
  const { spawn } = require("child_process");
  const child = spawn(lPath);

  child.on("spawn", () => {
    console.log("Process spawned.");
    updateStatus(true);
  });

  child.on("error", (err) => {
    console.error("Failed to start process:", err);
    updateStatus(false);
  });

  child.on("close", (code) => {
    if (code === 0) {
      console.log("Process exited successfully.");
      updateStatus(false);
    } else {
      console.log(`Process exited with code ${code}.`);
      updateStatus(false);
    }
  });

  console.log("Launching...");
}

function eTimer(status) {
  const timer = document.getElementById("timer");
  var timeSinceStart = 0;
  if (status == 1) {
    timer.style.display = "block";
    setInterval(() => {
      timeSinceStart++;
      const minutes = Math.floor(timeSinceStart / 60);
      const seconds = timeSinceStart % 60;
      timer.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    }, 1000);
  }
}

function home() {
  window.location.href = "../index.html";
}
function cW() {
  window.close();
}
