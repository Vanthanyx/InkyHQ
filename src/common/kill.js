const targetDate = new Date("2024-10-30");
const currentDate = new Date();
const APP_LIVE = localStorage.getItem("APP_LIVE");

if (currentDate > targetDate || !APP_LIVE) {
  window.location.href = "./common/kill.html";
}
