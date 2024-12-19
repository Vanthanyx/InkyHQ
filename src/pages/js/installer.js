const fs = require("fs");
const path = require("path");
const os = require("os");
const jsyaml = require("js-yaml");
const { shell } = require("electron"); // Corrected shell import

async function installCode(code) {
  // DSRN - Data Synchronization Resource Node
  if (code == "DSRN-DX24") {
    window.location.href = "./dsrn.html";
  }
  // Fetch the YAML file with available codes and download links
  window
    .fetch("https://inkysmp.com/data/CODES.yml")
    .then((response) => response.text())
    .then((yamlText) => {
      const yamlToJSON = jsyaml.load(yamlText);

      // Check if the provided code exists in the YAML file
      const downloadLink = yamlToJSON[code];

      if (downloadLink) {
        // Show the progress bar UI (can be customized as per your UI requirements)
        var progressContainer = document.getElementById("progress-container");
        var progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");

        var progress = document.createElement("div");
        progress.classList.add("progress");
        progressBar.appendChild(progress);

        progressContainer.appendChild(progressBar);

        // Simulate progress bar completion in 5 seconds
        let progressValue = 0;
        const interval = setInterval(() => {
          progressValue += 1;
          progress.style.width = progressValue + "%";

          if (progressValue >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              progress.style.width = "0%";
            }, 1000); // Reset after 1 second
          }
        }, 10); // Update every 10ms

        JSAlert.loader("Preparing...")
          .dismissIn(3000)
          .then(() => {
            // Trigger the download to the specified directory and track the progress
            downloadFileToPath(downloadLink, code, progress);
          });
      } else {
        JSAlert.alert("Invalid Download Code", null, JSAlert.Icons.Warning);
        console.error("Invalid code");
      }
    })
    .catch((error) => {
      console.error("Error fetching YAML file:", error);
      JSAlert.alert("Failed to fetch codes");
    });
}

async function downloadFileToPath(url, code, progressElement) {
  window
    .fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Get the total file size for progress tracking
      const totalBytes = parseInt(response.headers.get("Content-Length"), 10);

      // Extract the file name from the URL or Content-Disposition header
      let fileName = url.split("/").pop(); // Default from URL
      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition && contentDisposition.includes("filename=")) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }

      // Define the download path
      const downloadPath = path.join(
        os.homedir(),
        "AppData",
        "Roaming",
        ".inkyhq",
        "DOWNLOADS"
      );

      // Ensure the directory exists
      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
      }

      // Create a writable stream to save the file
      const filePath = path.join(downloadPath, fileName);
      const fileStream = fs.createWriteStream(filePath);

      // Track the download progress by reading the response body in chunks
      const reader = response.body.getReader();
      let downloadedBytes = 0;

      // Function to handle each chunk and update progress
      return new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }

            // Write each chunk to the file
            fileStream.write(value);
            downloadedBytes += value.length;

            // Update the progress bar
            const percentComplete = (downloadedBytes / totalBytes) * 100;
            progressElement.style.width = percentComplete + "%";
          }

          // Close the file stream once the download is complete
          fileStream.end(() => {
            console.log("File downloaded and saved successfully.");
            JSAlert.alert(
              `Downloaded ${fileName} successfully!`,
              null,
              JSAlert.Icons.Success,
              "Open Folder"
            ).then(() => {
              // Open the folder containing the file using the full file path
              shell.showItemInFolder(filePath);
            });
          });

          // Close the progress bar
          progressElement.remove();

          controller.close();
        },
      });
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
      JSAlert.alert("Failed to download the file", null, JSAlert.Icons.Failed);
    });
}
