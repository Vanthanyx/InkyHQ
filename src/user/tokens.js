const crypto = require("crypto");

function generateToken(id, username, password, pin) {
  const tokenData = `${id}:${username}:${password}:${pin}`;
  const cipher = crypto.createCipher("aes-256-cbc", "secretKey");
  let encrypted = cipher.update(tokenData, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decryptToken(token) {
  const decipher = crypto.createDecipher("aes-256-cbc", "secretKey");
  let decrypted = decipher.update(token, "hex", "utf8");
  decrypted += decipher.final("utf8");
  const [id, username, password, pin] = decrypted.split(":");
  return { id, username, password, pin };
}

//7cbe717a6dd9890cc7ae0f6d3b503dbbfe2d314612eed57b5f1a8d114b48f4a4327e1d40a2c8c6f135918520ff620077
//{id: 'JL2006', username: 'Vanthanyx', password: 'RIFTSCAPE12', pin: '4004'}

module.exports = { generateToken, decryptToken };
