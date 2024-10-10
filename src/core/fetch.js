const pastebinUrl = "https://pastebin.com/raw/Y9cvZeUe";
const currentVersion = "0.8.22";

fetch(pastebinUrl)
  .then((response) => response.text())
  .then((data) => {
    const webDbMatch = data.match(/var\s+WEB_DB_RUN\s*=\s*(true|false);/);
    sessionStorage.setItem("WEB_DB_RUN", webDbMatch[1]);
    const versionMatch = data.match(/var\s+LATEST_VERSION\s*=\s*"([^"]+)";/);
    sessionStorage.setItem("LATEST_VERSION", versionMatch[1]);
    const updaterUrlMatch = data.match(/var\s+UPDATER_URL\s*=\s*"([^"]+)";/);
    sessionStorage.setItem("UPDATER_URL", updaterUrlMatch[1]);
    const appLiveMatch = data.match(/var\s+APP_LIVE\s*=\s*(true|false);/);

    // Check if APP_LIVE is defined and store the value properly
    if (appLiveMatch) {
      const APP_LIVE = appLiveMatch[1] === "true"; // Convert string to boolean
      localStorage.setItem("APP_LIVE", APP_LIVE); // Store as a boolean in localStorage
      console.log("APP_LIVE:", APP_LIVE);
    } else {
      alert("FATAL ERROR 0x0E\nApplication Disabled");
      console.error("APP_LIVE not found in the fetched content.");
    }

    // Check if WEB_DB_RUN is defined and process it
    if (webDbMatch) {
      const WEB_DB_RUN = webDbMatch[1] === "true";
      console.log("WEB_DB_RUN:", WEB_DB_RUN);
      if (!WEB_DB_RUN) {
        alert("FATAL ERROR 0x01\nApplication Disabled");
        return;
      }
    } else {
      console.error("Variable WEB_DB_RUN not found in the fetched content.");
      alert("FATAL ERROR 0x02\nApplication Disabled");
      return;
    }

    // Check if LATEST_VERSION and UPDATER_URL are defined and process them
    if (versionMatch && updaterUrlMatch) {
      const LATEST_VERSION = versionMatch[1];
      const UPDATER_URL = updaterUrlMatch[1];
      console.log("LATEST_VERSION:", LATEST_VERSION);
      console.log("UPDATER_URL:", UPDATER_URL);

      if (compareVersions(LATEST_VERSION, currentVersion)) {
        alert(`A new version (${LATEST_VERSION}) is available. Please update.`);
        window.location.href = UPDATER_URL;
      }
    } else {
      console.error(
        "LATEST_VERSION or UPDATER_URL not found in the fetched content."
      );
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    alert("FATAL ERROR 0x03\nApplication Disabled");
  });

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

function setRandomAccentColor() {
  // Define the array of colors
  const colors = [
    "var(--red)",
    "var(--crimson)",
    "var(--orange)",
    "var(--amber)",
    "var(--yellow)",
    "var(--lime)",
    "var(--green)",
    "var(--teal)",
    "var(--cyan)",
    "var(--blue)",
    "var(--indigo)",
    "var(--violet)",
    "var(--purple)",
    "var(--pink)",
    "var(--magenta)",
  ];

  // Check if a color is already stored in sessionStorage
  const storedColor = sessionStorage.getItem("ACC_COLOR");

  if (storedColor) {
    // Use the stored color
    document.documentElement.style.setProperty("--acc", storedColor);
  } else {
    // Select a random color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    // Apply the random color to --acc
    document.documentElement.style.setProperty("--acc", randomColor);
    // Store the selected color in sessionStorage
    sessionStorage.setItem("ACC_COLOR", randomColor);
  }
}

// Call the function to set or retrieve the accent color
setRandomAccentColor();
