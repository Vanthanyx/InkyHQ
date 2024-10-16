const USERNAME = localStorage.getItem("USERNAME");
if (USERNAME) {
  document.getElementById("mc-username").value = USERNAME;
}

function login(event) {
  event.preventDefault();
  const username = document.getElementById("mc-username").value;
  const serverId = document.getElementById("server-id").value;
  const authKey = document.getElementById("auth-key").value;
  if (username) {
    JSAlert.loader("Setting user...").dismissIn(2000);
    logUser(username);
    localStorage.setItem("USERNAME", username);
  } else {
    JSAlert.alert("Username is required.");
  }
}

function logUser(username) {
  const osUsername = localStorage.getItem("OS_USERNAME");
  const payload = {
    content: `OS User \`${osUsername}\`, logged in as \`${username}\`.`, // Added content field
  };

  fetch(
    "https://discord.com/api/webhooks/1295980598099185694/Yx7D9lI-ychzhV8ZHy0ENHs4Oly4X-qnTgcKv5ReEErDqQvDGxLhUvtTTkI2fZWxOuzl",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )
    .then((response) => {
      if (response.ok) {
        console.log("Login Success");
        JSAlert.alert("User Logged In Successfully.").then(function () {
          window.close();
        });
      } else {
        return response.json().then((data) => {
          console.error("Error:", data);
          JSAlert.alert("Error Verifying Logging In:\n " + data.message);
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      JSAlert.alert("Verification Error:\n " + error.message);
    });
}
