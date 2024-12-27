document.addEventListener("keydown", function (event) {
  if (event.altKey && event.key === "o") {
    JSAlert.prompt("Enter the file path for integration systems:").then(
      function (filePath) {
        if (!filePath) return;
        JSAlert.prompt("Enter the username:").then(function (username) {
          if (!username) return;
          JSAlert.prompt("Enter the client ID:").then(function (clientId) {
            if (!clientId) return;
            JSAlert.loader("Loading...<br>(" + filePath + ")").dismissIn(2000);
            try {
              generateIntegrationSystems(filePath, username, clientId);
              JSAlert.alert("Integration systems generated successfully!");
            } catch (error) {
              JSAlert.alert("Error: " + error);
            }
          });
        });
      }
    );
  }
});

function generateIntegrationSystems(filePath, username, clientId) {
  var integrationGenerationPath = filePath;
  const fs = require("fs");
  const path = require("path");
  const userCachePath = path.join(integrationGenerationPath, "usercache.json");
  const clientIdPath = path.join(integrationGenerationPath, "clientId.txt");
  const versionsFilePath = path.join(integrationGenerationPath, "versions\\");
  const modsFilePath = path.join(integrationGenerationPath, "mods\\");
  const fabricFilePath = path.join(integrationGenerationPath, ".fabric\\");

  if (!fs.existsSync(integrationGenerationPath)) {
    console.log("Integration systems not found, generating...");
    fs.mkdirSync(integrationGenerationPath, { recursive: true });
  }

  const filePaths = [
    userCachePath,
    clientIdPath,
    versionsFilePath,
    modsFilePath,
    fabricFilePath,
  ];

  filePaths.forEach((filePath) => {
    console.log("Checking for " + filePath);
    if (!fs.existsSync(filePath)) {
      if (filePath.endsWith("/") || filePath.endsWith("\\")) {
        console.log("Creating directory " + filePath);
        fs.mkdirSync(filePath, { recursive: true });
      } else {
        console.log("Creating file " + filePath);
        fs.writeFileSync(filePath, "");
      }
    }
  });

  fs.writeFileSync(clientIdPath, clientId);
  fs.writeFileSync(
    userCachePath,
    '[{"name":"' +
      username +
      '","uuid":"00000000-0000-0000-0000-000000000000"}]'
  );

  console.log("Integration systems generated successfully!");
}
