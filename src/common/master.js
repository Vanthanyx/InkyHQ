const storedColor = sessionStorage.getItem("ACC_COLOR");

if (storedColor) {
  document.documentElement.style.setProperty("--acc", storedColor);
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
