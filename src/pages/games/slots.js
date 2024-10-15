const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const reel3 = document.getElementById("reel3");
const reel4 = document.getElementById("reel4");
const statusElement = document.getElementById("status");
const spinButton = document.getElementById("spin-button");
const creditsElement = document.getElementById("credits");

const symbols = ["🐵", "🐨", "🦁", "🐯"];
const spinCost = 20;

// Load credits from localStorage or initialize to 100 if not available
let credits = localStorage.getItem("USER_CREDITS")
  ? parseInt(localStorage.getItem("USER_CREDITS"))
  : 100;

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateCreditsDisplay() {
  creditsElement.textContent = `${credits}¤`;
}

function updateLocalStorageCredits() {
  localStorage.setItem("USER_CREDITS", credits);
}

function spinReels() {
  if (credits < spinCost) {
    statusElement.textContent = `Insufficient Credits`;
    statusElement.style.color = "yellow";
    return;
  }

  // Deduct the spin cost
  credits -= spinCost;
  updateCreditsDisplay();
  updateLocalStorageCredits();

  // Start spinning animation
  reel1.classList.add("spinning");
  reel2.classList.add("spinning");
  reel3.classList.add("spinning");
  reel4.classList.add("spinning");

  setTimeout(() => {
    // Stop spinning after animation
    reel1.classList.remove("spinning");
    reel2.classList.remove("spinning");
    reel3.classList.remove("spinning");
    reel4.classList.remove("spinning");

    // Randomly assign symbols to each reel
    const result1 = getRandomSymbol();
    const result2 = getRandomSymbol();
    const result3 = getRandomSymbol();
    const result4 = getRandomSymbol();

    // Display the results on the reels
    reel1.textContent = result1;
    reel2.textContent = result2;
    reel3.textContent = result3;
    reel4.textContent = result4;

    // Calculate the result
    calculateResult(result1, result2, result3, result4);
  }, 1500);
}

function calculateResult(result1, result2, result3, result4) {
  if (result1 === result2 && result1 === result3 && result1 === result4) {
    credits += spinCost * 8; // Jackpot, win 5x the spin cost
    statusElement.textContent = `Jackpot! +${spinCost * 8}¤`;
    statusElement.style.color = "lime";
  } else if (
    (result1 === result2 && result1 === result3) ||
    (result1 === result2 && result1 === result4) ||
    (result1 === result3 && result1 === result4) ||
    (result2 === result3 && result2 === result4)
  ) {
    credits += 60; // 3 symbols match, win 30 credits
    statusElement.textContent = `+60¤`;
    statusElement.style.color = "gold";
  } else {
    statusElement.textContent = `-20¤`;
    statusElement.style.color = "red";
  }

  // Update credits display and store in localStorage
  updateCreditsDisplay();
  updateLocalStorageCredits();
}

// Add event listener to spin the reels when the button is clicked
spinButton.addEventListener("click", spinReels);

// Initialize the display of credits when the page loads
updateCreditsDisplay();
