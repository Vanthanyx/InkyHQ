// FETCH VERSION 2, REVISED 3/13
const webdbUrl = "https://riftscape-4db6c15c14ba.herokuapp.com/api/rdx";
const currentVersion = localStorage.getItem("CURRENT_VERSION");
const webdbrun = sessionStorage.getItem("WEB_DB_RUN");

/* Error Codes Reference
 * 0x0A: Unable to fetch data
 * 0x01: Web Database Disabled
 * 0x02: Servers Are Not Live
 * 0x03: New version available
 * 0x04: Failed to parse YAML
 * 0x0E: Application Disabled
 * 0x0N: Failed to execute fetch
 * 0x0C: Error setting accent color
 */
const ERROR_CODES = {
  FETCH_FAIL: "0x0A",
  WEB_DB_DISABLED: "0x01",
  SERVERS_DOWN: "0x02",
  VERSION_OUTDATED: "0x03",
  YAML_PARSE_FAIL: "0x04",
  APP_DISABLED: "0x0E",
  EXECUTION_FAIL: "0x0N",
  ACCENT_COLOR_FAIL: "0x0C",
};

// Function to fetch and store data
async function fetchWebData() {
  if (webdbrun) return; // Prevent re-fetching if already in sessionStorage

  try {
    const response = await fetch(webdbUrl);
    if (!response.ok)
      throw new Error(`Error ${ERROR_CODES.FETCH_FAIL}: Unable to fetch data.`);

    const webData = await response.json(); // API returns JSON, no need for YAML parsing

    // Store data in sessionStorage and localStorage
    sessionStorage.setItem("API_URL_BASE", webData.API_URL_BASE);
    sessionStorage.setItem("WEB_DB_RUN", webData.WEB_DB_RUN);
    sessionStorage.setItem("LATEST_VERSION", webData.LATEST_VERSION);
    sessionStorage.setItem("UPDATER_URL", webData.UPDATER_URL);
    sessionStorage.setItem("INSTALLER_URL", webData.INSTALLER_URL);
    sessionStorage.setItem("NEWS", JSON.stringify(webData.NEWS));
    sessionStorage.setItem("MODS", JSON.stringify(webData.MODS));
    sessionStorage.setItem("MODS_URL", JSON.stringify(webData.MODS_URL));

    localStorage.setItem("APP_LIVE", webData.APP_LIVE);

    // Handle errors if the app is disabled or servers are down
    if (!webData.WEB_DB_RUN) {
      throw new Error(
        `Error ${ERROR_CODES.WEB_DB_DISABLED}: Web Database Disabled`
      );
    }
    if (!webData.APP_LIVE) {
      throw new Error(
        `Error ${ERROR_CODES.SERVERS_DOWN}: Servers Are Not Live`
      );
    }

    // Check for version updates
    if (compareVersions(webData.LATEST_VERSION, currentVersion)) {
      alert(
        `ERROR ${ERROR_CODES.VERSION_OUTDATED}\nNew version (${webData.LATEST_VERSION}) available. Please update.`
      );
      sessionStorage.setItem("UPDATE_AVAILABLE", true);
    }
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
}

// Function to compare versions
function compareVersions(latest, current) {
  if (!current) return true; // If no version is stored, force update
  return latest.split(".").map(Number) > current.split(".").map(Number);
}

// Set stored accent color
function setAccentColor() {
  try {
    const storedColor = sessionStorage.getItem("ACC_COLOR");
    document.documentElement.style.setProperty(
      "--acc",
      storedColor || "--branded_blue"
    );
  } catch (error) {
    console.error(
      `Error ${ERROR_CODES.ACCENT_COLOR_FAIL}: Failed to set accent color`,
      error
    );
    alert(
      `Error ${ERROR_CODES.ACCENT_COLOR_FAIL}: Failed to set accent color.`
    );
  }
}

// Call functions
console.log("Fetching web data...");
fetchWebData();
console.log("Setting accent color...");
setAccentColor();
