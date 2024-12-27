document.addEventListener("DOMContentLoaded", () => {
  const savedPath = localStorage.getItem("INTEGRATION_PATH");
  if (savedPath) {
    document.getElementById("apiEndpoint").value = savedPath;
    allRequiredItemsPresent(savedPath);
  } else {
    const pulser = document.querySelector(".pulser");
    pulser.style.backgroundColor = "var(--red)";
  }
});

const integrationForm = document.getElementById("integrationForm");

integrationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(integrationForm);
  const apiEndpoint = formData.get("apiEndpoint");

  if (apiEndpoint) {
    const fs = require("fs");
    const path = require("path");

    fs.readdir(apiEndpoint, (err, files) => {
      if (err) {
        JSAlert.alert("Invalid path: " + apiEndpoint);
        console.error("Unable to scan directory: " + err);
        return;
      }
      const requiredFiles = ["usercache.json", "clientId.txt"];
      const requiredDirs = ["versions", "mods", ".fabric"];
      let missingItems = [];

      requiredFiles.forEach((file) => {
        if (!files.includes(file)) {
          missingItems.push(file);
        }
      });

      requiredDirs.forEach((dir) => {
        if (!files.includes(dir)) {
          missingItems.push(dir);
        }
      });

      if (missingItems.length > 0) {
        console.error("Missing required items: " + missingItems.join(", "));
        JSAlert.alert("Missing required items: " + missingItems.join(", "));
        missingItems.forEach((item) => {
          let label;
          switch (item) {
            case "usercache.json":
              label = document.getElementById("usercache");
              break;
            case "clientId.txt":
              label = document.getElementById("clientId");
              break;
            case "versions":
              label = document.getElementById("versionsLabel");
              break;
            case "mods":
              label = document.getElementById("modsLabel");
              break;
            case ".fabric":
              label = document.getElementById("fabricLabel");
              break;
          }
          if (label) {
            label.style.color = "var(--amber)";
          }
        });
      } else {
        console.log("All required items are present.");
        localStorage.setItem("INTEGRATION_PATH", apiEndpoint);
        allRequiredItemsPresent(apiEndpoint);
      }
    });
  }
});

allRequiredItemsPresent = (apiEndpoint) => {
  const fs = require("fs");
  const path = require("path");

  const userCachePath = path.join(apiEndpoint, "usercache.json");

  fs.readFile(userCachePath, "utf8", (err, data) => {
    if (err) {
      console.error("Unable to read usercache.json: " + err);
      return;
    }
    try {
      const userCache = JSON.parse(data);
      const userCacheSpan = document.getElementById("usercache");
      userCacheSpan.innerHTML = userCache[0].name;
    } catch (parseErr) {
      console.error("Error parsing usercache.json: " + parseErr);
    }
  });

  const clientIdPath = path.join(apiEndpoint, "clientId.txt");

  fs.readFile(clientIdPath, "utf8", (err, data) => {
    if (err) {
      console.error("Unable to read clientId.txt: " + err);
      return;
    }
    const clientIdSpan = document.getElementById("clientId");
    clientIdSpan.innerHTML = data;
  });

  const versionsPath = path.join(apiEndpoint, "versions");
  const modsPath = path.join(apiEndpoint, "mods");
  const fabricPath = path.join(apiEndpoint, ".fabric");

  const versionsLabel = document.getElementById("versionsLabel");
  const modsLabel = document.getElementById("modsLabel");
  const fabricLabel = document.getElementById("fabricLabel");

  fs.readdir(versionsPath, (err, files) => {
    if (err) {
      console.error("Unable to scan directory: " + err);
      versionsLabel.style.color = "var(--red)";
      return;
    }
    versionsLabel.innerHTML = "VERSIONS (" + files.length + " files)";
    versionsLabel.style.color = "var(--green)";
  });

  fs.readdir(modsPath, (err, files) => {
    if (err) {
      console.error("Unable to scan directory: " + err);
      modsLabel.style.color = "var(--red)";
      return;
    }
    modsLabel.innerHTML = "MODS (" + files.length + " files)";
    modsLabel.style.color = "var(--green)";
  });

  fs.readdir(fabricPath, (err, files) => {
    if (err) {
      console.error("Unable to scan directory: " + err);
      fabricLabel.style.color = "var(--red)";
      return;
    }
    fabricLabel.innerHTML = ".FABRIC (" + files.length + " files)";
    fabricLabel.style.color = "var(--green)";
  });

  const pulser = document.querySelector(".pulser");
  pulser.style.backgroundColor = "var(--green)";
};

function home() {
  window.location.href = "../index.html";
}
function cW() {
  window.close();
}
