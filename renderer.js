const { ipcRenderer } = require("electron");

document.getElementById("launch-btn").addEventListener("click", async () => {
  console.log("Launch button clicked"); // Check if this logs in DevTools (F12)

  try {
    const result = await ipcRenderer.invoke("launch-minecraft", {
      access_token: "your-access-token",
      client_token: "your-client-token",
      uuid: "514c7989-7f48-44c3-b6b3-c22332b9da9f",
      name: "Vanthanyx",
    });

    console.log("Response from main process:", result);

    if (result.success) {
      console.log("Minecraft launched successfully!");
    } else {
      console.error("Failed to launch Minecraft:", result.error);
    }
  } catch (err) {
    console.error("Error invoking IPC:", err);
  }
});

// Listen for logs/errors from the main process
ipcRenderer.on("launcher-log", (event, message) => {
  console.log("[Launcher Log]", message);
});

ipcRenderer.on("launcher-error", (event, error) => {
  console.error("[Launcher Error]", error);
});
