// === Game State Variables ===
let dogs = [];
let currentDog = null;
let recentDogs = [];
const RECENT_LIMIT = 10;
let livesLeft = 3;
let streak = 0;
let timeLeft = 120;
let resultTimeout;
let timerInterval;

// === DOM Event Listeners ===
window.onload = fetchDogs;

document.addEventListener('DOMContentLoaded', () => {
  const breedInput = document.getElementById('breedInput');

  // Listen for Enter key to submit breed guess
  breedInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkBreed();
    }
  });

  // Start timer when "Start" button is clicked
  document.getElementById("startTimerBtn").addEventListener("click", startTimer);

  // Focus breed input when dog image loads
  document.getElementById("dogImage").addEventListener("load", focusInput);
});

// === Fetch Dogs Data ===
async function fetchDogs() {
  try {
    const res = await fetch("dogs.json");
    const allDogs = await res.json();
    dogs = [...allDogs];
    recentDogs = [];
    loadDog();
  } catch (err) {
    console.error("Error loading dogs.json:", err);
  }
}

// === Load a New Dog ===
function loadDog() {
  // If no dogs left, recycle half of recent dogs
  if (dogs.length === 0) {
    dogs = recentDogs.splice(0, Math.floor(RECENT_LIMIT / 2));
  }

  if (dogs.length === 0) {
    console.warn("No dogs left to display.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * dogs.length);
  currentDog = dogs.splice(randomIndex, 1)[0];
  recentDogs.push(currentDog);

  // Keep recentDogs within limit
  if (recentDogs.length > RECENT_LIMIT) {
    recentDogs.shift();
  }

  // Update UI with new dog image and clear previous input and messages
  document.getElementById("dogImage").src = currentDog.image;
  document.getElementById("breedInput").value = "";
  clearResultMessage();
  updateStreakDisplay();
  updateLivesDisplay();
}

// === Check User's Guess ===
function checkBreed() {
  if (livesLeft <= 0 || timeLeft <= 0) return;

  const input = document.getElementById("breedInput").value.toLowerCase().trim();

  // Cancel any previously set result timeout
  clearTimeout(resultTimeout);

  if (input === currentDog.breed.toLowerCase()) {
    streak++;
    showResultMessage("🎉 Correct!", "correct");
    setTimeout(loadDog, 1500);
  } else {
    livesLeft--;
    updateLivesDisplay();

    if (livesLeft > 0) {
      showResultMessage(`❌ Wrong! It was "${currentDog.breed}".`, "incorrect");
      setTimeout(loadDog, 1500);
    } else {
      showResultMessage(`😔 Game over! It was "${currentDog.breed}".`, "incorrect", false);
      streak = 0;
      clearInterval(timerInterval);
      document.getElementById("breedInput").disabled = true;
    }
  }

  updateStreakDisplay();
}

// === UI Utility Functions ===

// Show result feedback
function showResultMessage(message, className, autoHide = true) {
  const result = document.getElementById("result");
  result.textContent = message;
  result.className = className;
  result.style.opacity = "1";

  if (autoHide) {
    resultTimeout = setTimeout(() => {
      result.style.opacity = "0";
    }, 3000);
  }
}

// Clear result message
function clearResultMessage() {
  const result = document.getElementById("result");
  result.textContent = "";
  result.className = "";
  result.style.opacity = "0";
  clearTimeout(resultTimeout);
}

// Update streak display
function updateStreakDisplay() {
  document.getElementById("streakCount").textContent = streak;
}

// Update lives display
function updateLivesDisplay() {
  document.getElementById("livesDisplay").textContent = `❤️ Lives: ${livesLeft}`;
}

// Update timer display
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timerDisplay").textContent =
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Focus the input field
function focusInput() {
  document.getElementById("breedInput").focus();
}

// === Game Timer Logic ===
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 120;
  livesLeft = 3;
  streak = 0;
  document.getElementById("breedInput").disabled = false;

  updateTimerDisplay();
  updateLivesDisplay();
  updateStreakDisplay();
  loadDog();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("timerDisplay").textContent = "⏰ Time's up!";
      document.getElementById("breedInput").disabled = true;
      showResultMessage(`Time's up! Final score: ${streak}`, "incorrect", false);
    }
  }, 1000);
}
