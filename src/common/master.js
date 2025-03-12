const storedColor = localStorage.getItem("ACC_COLOR");
if (storedColor) {
  document.documentElement.style.setProperty(
    "--acc",
    "var(--" + storedColor + ")"
  );
} else {
  document.documentElement.style.setProperty("--acc", "var(--blue)");
}

function loadScript(src) {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

window.addEventListener("load", function () {
  if (!sessionStorage.getItem("WEB_DB_RUN")) {
    loadScript("./core/fetch.js");
  }
});

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
    JSAlert.confirm("GOTO Admin Dash").then(function (result) {
      if (!result) return;
      window.location.href = "./pages/admin.html";
    });
  }
});
