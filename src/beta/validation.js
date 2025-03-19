document.addEventListener("DOMContentLoaded", function () {
  const userRegistered = localStorage.getItem("REGISTERED");
  const registeredUsers = localStorage.getItem("REGISTERED_USERS");
  if (userRegistered) {
    const registeredSection = document.createElement("div");
    registeredSection.classList.add("registered-section");
    registeredSection.innerHTML =
      "Accounts registered to this device: <span id='registered-users'>---</span>";
    document.body.appendChild(registeredSection);

    if (registeredUsers) {
      const usersArray = JSON.parse(registeredUsers);
      document.getElementById("registered-users").innerText =
        usersArray.join(", ");
    }
  }

  const submitButton = document.getElementById("submitForm");
  const resetButton = document.getElementById("resetForm");

  // Check if the submit button exists before adding the event listener
  if (submitButton) {
    submitButton.addEventListener("click", function () {
      const mcUsername = document.getElementById("mc-username").value.trim();
      const discordUser = document.getElementById("discord-user").value.trim();
      const rsUser = document.getElementById("riftscape-user").value.trim();
      const pin1 = document.getElementById("pin-1").value;
      const pin2 = document.getElementById("pin-2").value;
      const region = document.getElementById("region").value;

      const dev = document.getElementById("dev").checked;
      const tex = document.getElementById("tex").checked;
      const admin = document.getElementById("admin").checked;

      const other = document.getElementById("other").checked;
      const otherText = document.getElementById("other-text").value.trim();

      let errors = [];

      // Check if fields are empty
      if (!mcUsername || !discordUser || !rsUser) {
        errors.push("All username fields must be filled.");
      }

      // Validate PIN (must be exactly 4 digits)
      if (!/^\d{4}$/.test(pin1) || !/^\d{4}$/.test(pin2)) {
        errors.push("PIN must be exactly 4 digits.");
      } else if (pin1 !== pin2) {
        errors.push("PINs do not match.");
      }

      // Validate region selection
      if (!region) {
        errors.push("Please select a region.");
      }

      // Check at least one contribution
      if (other && !otherText) {
        errors.push("Please specify your other contribution.");
      }

      if (errors.length > 0) {
        JSAlert.alert(errors.join("<br>"));
        return;
      }

      JSAlert.loader("Connecting to server...")
        .dismissIn(1000)
        .then(() => {
          fetch("https://riftscape-4db6c15c14ba.herokuapp.com/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              form: "RSXB-Q2WA",
              mcUsername: mcUsername,
              discordUser: discordUser,
              rsUser: rsUser,
              pin: pin1,
              region: region,
              contributions: {
                Development: dev,
                Texturing: tex,
                Admin: admin,
              },
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              JSAlert.loader("Getting response...")
                .dismissIn(1000)
                .then(() => {
                  if (data.message) {
                    JSAlert.alert("Registration successful!");
                    localStorage.setItem("REGISTERED", true);
                    let users = localStorage.getItem("REGISTERED_USERS");
                    users = users ? JSON.parse(users) : [];
                    users.push(rsUser);
                    localStorage.setItem(
                      "REGISTERED_USERS",
                      JSON.stringify(users)
                    );
                  } else if (data.error) {
                    JSAlert.alert("Error: " + data.error);
                  }
                });
            })
            .catch((error) => {
              console.error("Error during registration:", error);
              JSAlert.alert("There was an error submitting your registration.");
            });
        });

      document.getElementById("betaForm").reset();
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      document.getElementById("betaForm").reset();
    });
  }
});
