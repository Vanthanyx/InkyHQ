document
  .getElementById("sync-span")
  .addEventListener("click", async function () {
    this.innerHTML = "backup";

    try {
      await JSAlert.loader("Connecting to host...").dismissIn(1000);

      // Await the connection check (now async)
      await handleConnectionCheck();

      // If connection is successful, proceed with syncing
      await JSAlert.loader("Syncing data...").dismissIn(1000);

      this.innerHTML = "cloud_done";
      this.style.color = "var(--green)";
      this.parentElement.style.border = "1px solid var(--green)";
      this.parentElement.classList.add("success-hover");
    } catch (error) {
      JSAlert.alert(
        "Connection failed, please try again.",
        "Syncing Error",
        JSAlert.Icons.Failed
      );
      this.innerHTML = "sync_problem"; // Show error state but keep the element
      this.style.color = "var(--red)";
      this.parentElement.style.border = "1px solid var(--red)";
      this.parentElement.classList.add("error-hover");
      console.error(error);
    }
  });

// Make handleConnectionCheck async and return a Promise
async function handleConnectionCheck() {
  console.log("Checking connection status...");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = Math.random() >= 1; // Simulate connection attempt
      if (isSuccess) {
        console.log("Connection successful.");
        resolve();
      } else {
        console.log("Connection failed.");
        reject(new Error("Connection failed."));
      }
    }, 1000); // Simulate network delay
  });
}

let clickCount = 0; // To count the number of button clicks

document
  .getElementById("load-btn")
  .addEventListener("click", async function () {
    clickCount++;

    // If the button is clicked twice, reload the page
    if (clickCount === 2) {
      location.reload(); // Reload the page
      clickCount = 0; // Reset click count
    } else {
      // Otherwise, proceed with the original functionality
      const container = document.querySelector(".container .text-container");

      const loginSection = document.querySelector(".login-section");
      if (loginSection) {
        container.removeChild(loginSection);
      }

      const playerModelSection = document.createElement("div");
      playerModelSection.classList.add("playerModel-section");
      playerModelSection.innerHTML = `
        <h2>Player Model</h2>
        <p>Currently under development as of v1.20250314.1,
        please check back later for updates.</p> 
      `;

      container.appendChild(playerModelSection);

      const spanElement = this.querySelector(".material-symbols-outlined");
      if (spanElement) {
        spanElement.innerHTML = "satellite";
      }

      // Change the .load-btn:hover::after content to "Connection Info"
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(
        `
        .load-btn:hover::after {
          content: "Connection Info" !important;
        }
        `,
        styleSheet.cssRules.length
      );
    }
  });
