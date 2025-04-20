let dogs = [];
let currentDog = null;
let livesLeft = 3;
let streak = 0;
let recentDogs = [];
const RECENT_LIMIT = 10;

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
    dogs = recentDogs.splice(0, Math.floor(RECENT_LIMIT / 2));
  }

  if (dogs.length === 0) {
    console.warn("No dogs left to display.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * dogs.length);
  currentDog = dogs.splice(randomIndex, 1)[0];
  recentDogs.push(currentDog);

  if (recentDogs.length > RECENT_LIMIT) {
    recentDogs.shift();
  }

  document.getElementById("dogImage").src = currentDog.image;
  document.getElementById("breedInput").value = "";
  document.getElementById("result").textContent = "";
  document.getElementById("streakCount").textContent = streak;
  updateLivesDisplay();
}

function checkBreed() {
  if (livesLeft <= 0 || timeLeft <= 0) return;

  const input = document.getElementById("breedInput").value.toLowerCase().trim();
  const result = document.getElementById("result");

  if (input === currentDog.breed.toLowerCase()) {
    streak++;
    result.textContent = "🎉 Correct!";
    result.style.color = "green";
    setTimeout(loadDog, 2000);
  } else {
    livesLeft--;

    if (livesLeft > 0) {
      result.textContent = `❌ Wrong! ${livesLeft} live${livesLeft === 1 ? "" : "s"} left.`;
      result.style.color = "orange";
      updateLivesDisplay();
    } else {
      result.textContent = `😔 Game over! It was "${currentDog.breed}".`;
      result.style.color = "red";
      streak = 0;
      updateLivesDisplay();
      clearInterval(timerInterval);
      document.getElementById("breedInput").disabled = true;
    }
  }

  document.getElementById("streakCount").textContent = streak;
}

function updateStreakDisplay() {
  document.getElementById("streakCount").textContent = streak;
}

function updateLivesDisplay() {
  document.getElementById("livesDisplay").textContent = `❤️ Lives: ${livesLeft}`;
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

// Timer logic
let timerInterval;
let timeLeft = 120;

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 120;
  livesLeft = 3;
  streak = 0;
  document.getElementById("breedInput").disabled = false;
  updateTimerDisplay();
  updateLivesDisplay();
  loadDog();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("timerDisplay").textContent = "⏰ Time's up!";
      document.getElementById("breedInput").disabled = true;
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timerDisplay").textContent =
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

document.getElementById("startTimerBtn").addEventListener("click", startTimer);
