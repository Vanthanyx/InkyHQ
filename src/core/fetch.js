const webdbUrl = "https://inkysmp.com/data/WEB.yml";
const yaml = require("js-yaml");
const currentVersion = localStorage.getItem("CURRENT_VERSION");
const webdbrun = sessionStorage.getItem("WEB_DB_RUN");

/* Error Codes:
 * 0x0A: Unable to fetch data
 * 0x01: Web Database Disabled
 * 0x02: Servers Are Not Live
 * 0x03: New version available
 * 0x04: Failed to parse YAML
 * 0x0E: Application Disabled
 * 0x0N: Failed to execute fetch
 * 0x0C: Error setting accent color
 */

if (!webdbrun) {
  try {
    fetch(webdbUrl)
      .then((response) => {
        if (!response.ok) {
          alert("FATAL ERROR 0x0A: Unable to fetch data.");
          throw new Error("FATAL ERROR 0x0A: Unable to fetch data.");
        }
        return response.text();
      })
      .then((data) => {
        try {
          // Parse the YAML file
          const webData = yaml.load(data);

          // Store all values in sessionStorage or localStorage
          sessionStorage.setItem("WEB_DB_RUN", webData.WEB_DB_RUN);
          sessionStorage.setItem("LATEST_VERSION", webData.LATEST_VERSION);
          sessionStorage.setItem("UPDATER_URL", webData.UPDATER_URL);
          sessionStorage.setItem("INSTALLER_URL", webData.INSTALLER_URL);
          sessionStorage.setItem("NEWS", JSON.stringify(webData.NEWS));
          sessionStorage.setItem("MODS", JSON.stringify(webData.MODS));
          sessionStorage.setItem("MODS_URL", JSON.stringify(webData.MODS_URL));

          localStorage.setItem("APP_LIVE", webData.APP_LIVE);

          // Handle WEB_DB_RUN
          if (!webData.WEB_DB_RUN) {
            alert(
              "FATAL ERROR 0x01\nApplication Disabled\nWeb Database Disabled"
            );
            throw new Error("WEB_DB_RUN is false.");
          }

          // Handle APP_LIVE
          if (!webData.APP_LIVE) {
            alert(
              "FATAL ERROR 0x02\nApplication Disabled\nServers Are Not Live"
            );
            throw new Error("APP_LIVE is false.");
          }

          // Check for version updates
          if (compareVersions(webData.LATEST_VERSION, currentVersion)) {
            alert(
              `ERROR 0x03\nA new version (${webData.LATEST_VERSION}) is available. Please update.`
            );
            sessionStorage.setItem("UPDATE_AVAILABLE", true);
          }
        } catch (error) {
          console.error("FATAL ERROR 0x04: ", error.message);
          alert("FATAL ERROR 0x04: ", error.message);
        }
      })
      .catch((error) => {
        console.error("FATAL ERROR 0x0E: Application Disabled - ", error);
        alert("FATAL ERROR 0x0E\nApplication Disabled\n" + error);
      });
  } catch (error) {
    console.error("FATAL ERROR 0x0N: Failed to execute fetch - ", error);
    alert("FATAL ERROR 0x0N\nApplication Disabled\n" + error);
  }
}

// Function to compare versions
function compareVersions(latest, current) {
  const latestParts = latest.split(".").map(Number);
  const currentParts = current.split(".").map(Number);

  for (let i = 0; i < latestParts.length; i++) {
    if (latestParts[i] > currentParts[i]) return true;
    if (latestParts[i] < currentParts[i]) return false;
  }
  return false;
}

try {
  const storedColor = sessionStorage.getItem("ACC_COLOR");
  if (storedColor) {
    document.documentElement.style.setProperty("--acc", storedColor);
  } else if (storedColor === null || storedColor === "default") {
    document.documentElement.style.setProperty("--acc", "--branded_blue");
  }
} catch (error) {
  console.error("FATAL ERROR 0x0C: Error setting accent color - ", error);
  alert("FATAL ERROR 0x0C\nFailed to set accent color.");
}

setTimeout(() => {
  location.reload();
}, 500);
