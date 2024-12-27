function toggleMenu() {
  const hoverMenu = document.querySelector(".hover-menu");
  if (hoverMenu.style.display === "none" || hoverMenu.style.display === "") {
    hoverMenu.style.display = "block";
  } else {
    hoverMenu.style.display = "none";
  }
}
const fs = require("fs");
const path = require("path");
const os = require("os");

document.addEventListener("DOMContentLoaded", function () {
  // Call the functions after the DOM is ready
  getLocalMods();
  retrievedMods();
  compareLists();
});

function openFolder() {
  const modsPath = path.join(
    os.homedir(),
    "AppData",
    "Roaming",
    ".inkyhq",
    "MODS"
  );
  require("child_process").exec(`start ${modsPath}`);
}

let localModsArray = []; // Declare this globally to use in compareLists

function getLocalMods() {
  // Define the download path
  const modsPath = path.join(
    os.homedir(),
    "AppData",
    "Roaming",
    ".inkyhq",
    "MODS"
  );

  // Ensure the directory exists
  if (!fs.existsSync(modsPath)) {
    fs.mkdirSync(modsPath, { recursive: true });
  }

  // Read the directory
  fs.readdir(modsPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    // Display the files in the local list
    const localList = document.getElementById("local-list");
    if (!localList) {
      console.error("Local list element not found.");
      return;
    }

    // Clear existing items in case of re-renders
    localList.innerHTML = "";

    files.forEach((file) => {
      const listItem = document.createElement("li");
      listItem.textContent = file;
      localList.appendChild(listItem);
      localModsArray.push(file); // Save files to the array
    });

    // Call compareLists again to ensure it uses updated data
    compareLists();
  });
}

function retrievedMods() {
  var modsArray = JSON.parse(sessionStorage.getItem("MODS")) || [];
  var modsList = document.getElementById("retrieved");

  if (!modsList) {
    console.error("Retrieved list element not found.");
    return;
  }

  modsList.innerHTML = ""; // Clear existing items

  modsArray.forEach(function (modsItem) {
    var li = document.createElement("li");
    li.textContent = modsItem;
    modsList.appendChild(li);
  });
}

function compareLists() {
  if (localModsArray.length === 0) {
    console.log("Local mods array is empty. [LME200]");
    return;
  }

  const localList = document.getElementById("local-list");
  const retrievedList = document.getElementById("retrieved");

  const localItems = Array.from(localList.children).map((li) => li.textContent);
  console.log(localItems);

  const retrievedItems = Array.from(retrievedList.children).map(
    (li) => li.textContent
  );
  console.log(retrievedItems);

  const missingItems = retrievedItems.filter(
    (item) => !localItems.includes(item)
  );
  const extraItems = localItems.filter(
    (item) => !retrievedItems.includes(item)
  );

  if (missingItems.length > 0) {
    missingItems.forEach((item) => {
      const listItem = Array.from(retrievedList.children).find(
        (li) => li.textContent === item
      );
      if (listItem) {
        listItem.style.color = "red";
      }
    });
  }

  if (extraItems.length > 0) {
    extraItems.forEach((item) => {
      const listItem = Array.from(localList.children).find(
        (li) => li.textContent === item
      );
      if (listItem) {
        listItem.style.color = "yellow";
      }
    });
  }
}

function syncFiles() {
  JSAlert.confirm("Begin file sync?").then(function (result) {
    // Check if pressed yes
    if (!result) return;

    const localList = document.getElementById("local-list");
    const retrievedList = document.getElementById("retrieved");

    const localItems = Array.from(localList.children).map(
      (li) => li.textContent
    );
    const retrievedItems = Array.from(retrievedList.children).map(
      (li) => li.textContent
    );

    const missingItems = retrievedItems.filter(
      (item) => !localItems.includes(item)
    );

    if (missingItems.length === 0) {
      JSAlert.alert("No missing files to sync.");
      return;
    }
    JSAlert.alert(
      "(Reload page to update.) " + missingItems,
      "Syncing files..."
    );

    console.log("Missing files:", missingItems);
    const modsPath = path.join(
      os.homedir(),
      "AppData",
      "Roaming",
      ".inkyhq",
      "MODS"
    );
    if (!fs.existsSync(modsPath)) {
      fs.mkdirSync(modsPath, { recursive: true });
    }

    const missingItemURLs =
      JSON.parse(sessionStorage.getItem("MODS_URL")) || [];

    // Convert MODS_URL array into an object
    const modsURLMap = missingItemURLs.reduce((acc, entry) => {
      const [modName, url] = entry.split("|");
      acc[modName] = url;
      return acc;
    }, {});

    missingItems.forEach((item) => {
      const url = modsURLMap[item]; // Now using the mod name to get the URL
      if (!url) {
        console.error("URL not found for item:", item);
        return;
      }

      const filePath = path.join(modsPath, item);
      fetchFile(url, filePath);
    });

    function fetchFile(url, filePath) {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = function () {
            const buffer = Buffer.from(reader.result);
            fs.writeFile(filePath, buffer, (err) => {
              if (err) {
                console.error("Error writing file:", err);
              } else {
                console.log("File saved:", filePath);
              }
            });
          };
          reader.readAsArrayBuffer(blob);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  });
}

function removeExtraItems() {
  const localList = document.getElementById("local-list");
  const retrievedList = document.getElementById("retrieved");

  const localItems = Array.from(localList.children).map((li) => li.textContent);
  const retrievedItems = Array.from(retrievedList.children).map(
    (li) => li.textContent
  );

  const extraItems = localItems.filter(
    (item) => !retrievedItems.includes(item)
  );

  if (extraItems.length === 0) {
    JSAlert.alert("No extra files to remove.");
    return;
  }

  JSAlert.confirm("Remove extra files?\n" + extraItems.join("\n")).then(
    function (result) {
      if (!result) return;

      const modsPath = path.join(
        os.homedir(),
        "AppData",
        "Roaming",
        ".inkyhq",
        "MODS"
      );

      extraItems.forEach((item) => {
        const filePath = path.join(modsPath, item);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            JSAlert.alert("Error deleting file: " + err);
          } else {
            console.log("File deleted:", filePath);
          }
        });
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  );
}

function home() {
  window.location.href = "../index.html";
}
function cW() {
  window.close();
}
