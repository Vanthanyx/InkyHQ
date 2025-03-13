async function login(event) {
  event.preventDefault();

  const authKey = document.getElementById("auth-key").value;
  if (!authKey) {
    JSAlert.alert("Please enter a valid Auth Key.");
    return;
  }
  const apiURL = sessionStorage.getItem("API_URL_BASE");

  JSAlert.loader(`Searching For:<br>${authKey}`).dismissIn(1000);

  try {
    const response = await fetch(apiURL + "api/app-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authKey }),
    });

    const result = await response.json();

    if (response.ok) {
      // Successful login, store username and redirect
      localStorage.setItem("USERNAME", result.username);
      JSAlert.alert(`Welcome, ${result.username}!`).then(() => {
        window.close();
      });
    } else {
      // Handle invalid login
      JSAlert.alert(result.error || "Invalid Auth Key. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);
    JSAlert.alert("Failed to connect to the server. Please try again.");
  }
}
