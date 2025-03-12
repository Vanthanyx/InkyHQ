document.addEventListener("DOMContentLoaded", function () {
  const accentColor = localStorage.getItem("ACC_COLOR");
  const notificationSettings = localStorage.getItem("NOTIFS");
  const username = localStorage.getItem("USERNAME");
  const launcher = localStorage.getItem("LAUNCHER");

  if (accentColor) {
    document.getElementById("accent-color").value = accentColor;
  }

  if (notificationSettings) {
    document.getElementById("notification-settings").value =
      notificationSettings;
  }

  if (username) {
    document.getElementById("login-btn").innerText = "Logged in as " + username;
  }

  if (launcher) {
    document.getElementById("launcher").value = launcher;
  }

  const currentVersion = require("../../package.json").version;
  const bNameVersion = require("../../package.json").bNameVersion;
  document.getElementById("version").innerText =
    "v" + currentVersion + " | v" + bNameVersion;
});

function home() {
  window.location.href = "../index.html";
}
function cW() {
  window.close();
}

function login() {
  window.open("./login.html", "Login", "width=450,height=350,frame=false");
  /*JSAlert.prompt("Enter your username").then((username) => {
      if (username) {
        localStorage.setItem("USERNAME", username);
        window.location.reload();
      } else {
        JSAlert.alert("Login Failed...");
      }
    });*/
}

function save() {
  const accentColor = document.getElementById("accent-color").value;
  const notificationSettings = document.getElementById(
    "notification-settings"
  ).value;
  const launcher = document.getElementById("launcher").value;

  localStorage.setItem("ACC_COLOR", accentColor);
  localStorage.setItem("NOTIFS", notificationSettings);
  localStorage.setItem("LAUNCHER", launcher);

  JSAlert.alert("Settings Saved!").then(() => {
    window.location.reload();
  });
}

function cfu() {
  JSAlert.loader("Checking for updates...")
    .dismissIn(3000)
    .then(() => {
      JSAlert.alert("No updates available.");
    });
}
