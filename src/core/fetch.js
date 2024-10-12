const webdbUrl =
  "https://raw.githubusercontent.com/Vanthanyx/InkyHQ/refs/heads/master/db/web.js";
const currentVersion = "0.8.22";

try {
  fetch(webdbUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("FATAL ERROR 0x03: Unable to fetch the data.");
      }
      return response.text();
    })
    .then((data) => {
      try {
        const webDbMatch = data.match(/var\s+WEB_DB_RUN\s*=\s*(true|false);/);
        if (!webDbMatch) {
          throw new Error("FATAL ERROR 0x02: WEB_DB_RUN not found.");
        }
        sessionStorage.setItem("WEB_DB_RUN", webDbMatch[1]);

        const versionMatch = data.match(
          /var\s+LATEST_VERSION\s*=\s*"([^"]+)";/
        );
        const updaterUrlMatch = data.match(
          /var\s+UPDATER_URL\s*=\s*"([^"]+)";/
        );

        if (!versionMatch || !updaterUrlMatch) {
          throw new Error(
            "FATAL ERROR 0x04: LATEST_VERSION or UPDATER_URL not found."
          );
        }

        sessionStorage.setItem("LATEST_VERSION", versionMatch[1]);
        sessionStorage.setItem("UPDATER_URL", updaterUrlMatch[1]);

        const appLiveMatch = data.match(/var\s+APP_LIVE\s*=\s*(true|false);/);
        const newsMatch = data.match(/var\s+NEWS\s*=\s*\[([^\]]+)\];/);

        if (!newsMatch) {
          alert("FATAL ERROR 0x0N\nNews Disabled");
          throw new Error("NEWS variable not found.");
        } else {
          const newsArray = newsMatch[1]
            .split(",")
            .map((item) => item.trim().replace(/(^"|"$)/g, "")) // Remove surrounding quotes
            .filter((item) => item.length > 0); // Filter out empty entries
          sessionStorage.setItem("NEWS", JSON.stringify(newsArray));
        }

        if (appLiveMatch) {
          const APP_LIVE = appLiveMatch[1] === "true"; // Convert string to boolean
          localStorage.setItem("APP_LIVE", APP_LIVE); // Store as a boolean in localStorage
          console.log("APP_LIVE:", APP_LIVE);
        } else {
          alert("FATAL ERROR 0x0E\nApplication Disabled");
          throw new Error("APP_LIVE variable not found.");
        }

        const WEB_DB_RUN = webDbMatch[1] === "true";
        if (!WEB_DB_RUN) {
          alert("FATAL ERROR 0x01\nApplication Disabled");
          throw new Error("WEB_DB_RUN is false.");
        }

        if (compareVersions(versionMatch[1], currentVersion)) {
          alert(
            `A new version (${versionMatch[1]}) is available. Please update.`
          );
          window.location.href = updaterUrlMatch[1];
        }
      } catch (error) {
        console.error(error.message);
        alert(error.message);
      }
    })
    .catch((error) => {
      console.error("FATAL ERROR 0x03: Application Disabled - ", error);
      alert("FATAL ERROR 0x03\nApplication Disabled\n" + error);
    });
} catch (error) {
  console.error("FATAL ERROR 0x03: Failed to execute fetch - ", error);
  alert("FATAL ERROR 0x03\nApplication Disabled\n" + error);
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

function setRandomAccentColor() {
  try {
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
      const randomColor = "var(--blue)";

      // Apply the random color to --acc
      document.documentElement.style.setProperty("--acc", randomColor);
      // Store the selected color in sessionStorage
      sessionStorage.setItem("ACC_COLOR", randomColor);
    }
  } catch (error) {
    console.error("FATAL ERROR 0x05: Error setting accent color - ", error);
    alert("FATAL ERROR 0x05\nFailed to set accent color.");
  }
}

// Call the function to set or retrieve the accent color
setRandomAccentColor();
