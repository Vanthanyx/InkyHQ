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
    "OPTIONALS",
  ];
  for (const folder of folders) {
    const folderPath = path.join(e, folder);
    try {
      await fs.access(folderPath);
    } catch {
      await fs.mkdir(folderPath, { recursive: true });
      for (let i = 0; i < 4; i++) {
        const randomFileName = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        const randomFileNumber = Math.floor(
          100000000000 + Math.random() * 900000000000
        ).toString();
        const filePath = path.join(folderPath, randomFileName);
        await fs.writeFile(filePath, randomFileNumber);
      }
    }
  }
}

function obfuscateContent(content) {
  return Buffer.from(content).toString("base64");
}

async function obfuscateFilesInFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true }); // Read all files and subdirectories in the directory

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);

      if (file.isDirectory()) {
        await obfuscateFilesInFolder(filePath);
      } else if (file.isFile()) {
        const fileContent = await fs.readFile(filePath, "utf8");
        const obfuscatedContent = obfuscateContent(fileContent);
        await fs.writeFile(filePath, obfuscatedContent);
      }
    }
  } catch (err) {
    console.error("CRIT ERR:", err);
  }
}

var a = path.join(os.homedir(), "AppData", "Roaming"),
  e = path.join(a, ".inkyhq");

obfuscateFilesInFolder(e);

module.exports = manageAppData;
