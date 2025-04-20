let dogs = [];
let currentDog = null;
let attemptsLeft = 3;
let streak = 0;
let recentDogs = []; // Track recently shown dogs
const RECENT_LIMIT = 10; // Max number of dogs to keep in recent list

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

function loadDog() {
  if (dogs.length === 0) {
    // Recycle some of the oldest recent dogs
    dogs = recentDogs.splice(0, Math.floor(RECENT_LIMIT / 2));
  }

  if (dogs.length === 0) {
    console.warn("No dogs left to display.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * dogs.length);
  currentDog = dogs.splice(randomIndex, 1)[0]; // Remove from pool

  recentDogs.push(currentDog);
  if (recentDogs.length > RECENT_LIMIT) {
    recentDogs.shift(); // Keep recentDogs within limit
  }

  document.getElementById("dogImage").src = currentDog.image;
  document.getElementById("breedInput").value = "";
  document.getElementById("result").textContent = "";
  attemptsLeft = 3;
  
  document.getElementById("streakCount").textContent = streak;
}

function checkBreed() {
  const input = document.getElementById("breedInput").value.toLowerCase().trim();
  const result = document.getElementById("result");

  if (input === currentDog.breed.toLowerCase()) {
    streak++;
    result.textContent = "🎉 Correct!";
    result.style.color = "green";
    setTimeout(loadDog, 5000);
  } else {
    attemptsLeft--;

    if (attemptsLeft > 0) {
      result.textContent = `❌ Try again! ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left.`;
      result.style.color = "orange";
    } else {
      result.textContent = `😔 Out of tries! It was "${currentDog.breed}".`;
      result.style.color = "red";
      streak = 0;
      setTimeout(loadDog, 2000);
    }
  }

  document.getElementById("streakCount").textContent = streak;
}

function updateStreakDisplay() {
  document.getElementById("streakCount").textContent = streak;
}

window.onload = fetchDogs;

document.addEventListener('DOMContentLoaded', () => {
  const breedInput = document.getElementById('breedInput');
  breedInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkBreed();
    }
  });
});

let timerInterval;
let timeLeft = 120; // 2 minutes in seconds

function startTimer() {
  clearInterval(timerInterval); // Clear any existing timer
  timeLeft = 120;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("timerDisplay").textContent = "⏰ Time's up!";
      // Optionally, disable input or load next dog
      // document.getElementById("breedInput").disabled = true;
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timerDisplay").textContent =
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Attach event to the button
document.getElementById("startTimerBtn").addEventListener("click", startTimer);

