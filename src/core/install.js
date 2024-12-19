const { time } = require("console");
const fs = require("fs").promises,
  path = require("path"),
  os = require("os");

async function manageAppData() {
  var a = path.join(os.homedir(), "AppData", "Roaming"),
    e = path.join(a, ".inkyhq"),
    o = path.join(e, "USERINFO");
  try {
    await fs.access(e).catch(() => fs.mkdir(e, { recursive: !0 }));
    var s = {
      username: os.userInfo().username,
      homeDir: os.homedir(),
      platform: os.platform(),
      release: os.release(),
      totalMemory: os.totalmem(),
      cpu: os
        .cpus()
        .map((a) => a.model)
        .join(", "),
      arch: os.arch(),
      loadAvg: os.loadavg(),
      networkInterfaces: os.networkInterfaces(),
      hostname: os.hostname(),
      date: new Date().toUTCString(),
      time: new Date().toLocaleTimeString(),
    };
    await fs.writeFile(o, JSON.stringify(s, null, 2), "utf8");
  } catch (a) {
    console.error("CRIT ERR:", a);
  }

  const folders = [
    "ADMINISTRATION",
    "BACKUPS",
    "CONFIG",
    "DOWNLOADS",
    "LOGS",
    "MODS",
  ];
  for (const folder of folders) {
    const folderPath = path.join(e, folder);
    try {
      await fs.access(folderPath);
    } catch {
      await fs.mkdir(folderPath, { recursive: true });
    }
  }
}

var a = path.join(os.homedir(), "AppData", "Roaming"),
  e = path.join(a, ".inkyhq");

module.exports = manageAppData;
