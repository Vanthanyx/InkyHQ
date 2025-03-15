const dTok = require("./tokens").decryptToken;

window.onload = function () {
  const localUsername = localStorage.getItem("USERNAME");
  const localPassword = localStorage.getItem("PASSWORD");

  if (localUsername) {
    document.getElementById("username-input").value = localUsername;
  }
  if (localPassword) {
    document.getElementById("password-input").value = localPassword;
  }
};

function loginUsernameAndPassword(username, password) {
  setTimeout(() => {
    if (username === "admin" && password === "admin") {
      JSAlert.alert("Login successful");
    } else {
      JSAlert.alert("Invalid username or password");
    }
  }, 1000);
}

function LoginTokenAndDate(token, time_date) {
  try {
    const tokenData = dTok(token);
    const date = new Date(time_date);

    if (Date.now() - date.getTime() <= 15000) {
      return tokenData;
    } else {
      console.error("Token request expired.");
      return null;
    }
  } catch (error) {
    console.error("Token decryption failed:", error);
    return null;
  }
}
