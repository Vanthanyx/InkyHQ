const targetDate = new Date("2025-02-01");
const currentDate = new Date();
const APP_LIVE = localStorage.getItem("APP_LIVE");

setTimeout(() => {
  if (currentDate > targetDate || !APP_LIVE) {
    if (currentDate > targetDate) {
      alert("App critically outdated.");
    } else if (!APP_LIVE) {
      alert("App disabled by administration.");
    }
    window.location.href = "./common/kill.html";
  }
}, 5000);
