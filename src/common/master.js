const storedColor = localStorage.getItem("ACC_COLOR");

if (storedColor) {
  document.documentElement.style.setProperty(
    "--acc",
    "var(--" + storedColor + ")"
  );
}

function loadScript(src) {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

const webDbRun = sessionStorage.getItem("WEB_DB_RUN");

if (!webDbRun) {
  loadScript("./core/fetch.js");
}

document.addEventListener("keydown", function (event) {
  if (event.altKey && event.key.toLowerCase() === "r") {
    JSAlert.confirm("Are you sure you want to reset the app?").then(function (
      result
    ) {
      if (!result) return;
      localStorage.clear();
      sessionStorage.clear();
      JSAlert.alert("App reset successfully.").then(function () {
        window.close();
      });
    });
  } else if (event.altKey && event.key.toLowerCase() === "a") {
    JSAlert.confirm("Are you sure you want enable admin mode?").then(function (
      result
    ) {
      if (!result) return;
      JSAlert.alert("Admin mode enabled.");
    });
  }
});
