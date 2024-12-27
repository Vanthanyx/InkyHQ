// Create a div element with CSS classes and a form
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay", "active");

  const form = document.createElement("form");
  form.innerHTML = `
                <label for="username">Minecraft Username:</label>
                <input type="text" id="username" name="username" required>
                
                <label for="runpath">Minecraft Runpath:</label>
                <input type="text" id="runpath" name="runpath" required>
                
                <label for="dbcode">Database Code:</label>
                <input type="password" id="dbcode" name="dbcode" required>
                
                <button class="btn fill" type="submit">Submit</button>
        `;

  overlay.appendChild(form);
  document.body.appendChild(overlay);

  // Attach the submit event listener to the form
  form.addEventListener("submit", handleFormSubmit);
}

// CSS styles for the overlay
const style = document.createElement("style");
style.innerHTML = `
        .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
        }
        .overlay.active {
                display: flex;
        }
        .overlay form {
                display: flex;
                flex-direction: column;
                gap: 10px;
                background-color: var(--dark_base);
                color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                border: 1px solid var(--acc);
                width: 90%;
                max-width: 400px;
        }
        .overlay label {
                font-weight: bold;
        }
        .overlay input {
                background-color: var(--base);
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                color: white;
        }
                .overlay input:focus {
                outline: none;
                border: 1px solid var(--acc);
                color: var(--acc);
        }
`;
document.head.appendChild(style);
// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const runpath = document.getElementById("runpath").value;
  const dbcode = document.getElementById("dbcode").value;

  // Perform your form submission logic here
  console.log("Username:", username);
  console.log("Runpath:", runpath);
  console.log("Database Code:", dbcode);

  // Optionally, you can hide the overlay after submission
  // Create the overlay when the page loads
  createOverlay();

  // Attach the submit event listener to the form
  document.querySelector("form").addEventListener("submit", handleFormSubmit);
}
