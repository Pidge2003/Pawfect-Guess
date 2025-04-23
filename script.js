let dogs = [];
let currentDog = null;
let livesLeft = 3;
let streak = 0;
let recentDogs = [];
const RECENT_LIMIT = 10;
let resultTimeout;

async function fetchDogs() {
    try {
      const res = await fetch("https://api.api-ninjas.com/v1/dogs?max=50", {
        headers: {
          'X-Api-Key': 'R4SZZGxNrOlsbLrnuxUBrA==peXDDRB35pvHXdNX'
        }
      });
  
      if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  
      const allDogs = await res.json();
  
      // Since the API response does not include images, generate image URLs based on breed names
      dogs = allDogs
        .filter(dog => dog.name) // ensure name exists
        .map(dog => ({
          breed: dog.name,
          image: `https://dog.ceo/api/breed/${dog.name.toLowerCase().replace(/\s+/g, '-')}/images/random`
        }));
  
      recentDogs = [];
      loadDog();
    } catch (err) {
      console.error("Error fetching dogs from API:", err);
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
  clearResultMessage();
  document.getElementById("streakCount").textContent = streak;
  updateLivesDisplay();
}

function checkBreed() {
  if (livesLeft <= 0 || timeLeft <= 0) return;

  const input = document.getElementById("breedInput").value.toLowerCase().trim();
  const result = document.getElementById("result");

  // Clear any existing timeout for result message
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
      showResultMessage(`😔 Game over! It was "${currentDog.breed}".`, "incorrect", false); // Don't auto-hide game over message
      streak = 0;
      clearInterval(timerInterval);
      document.getElementById("breedInput").disabled = true;
    }
  }

  document.getElementById("streakCount").textContent = streak;
}

function showResultMessage(message, className, autoHide = true) {
  const result = document.getElementById("result");
  result.textContent = message;
  result.className = className;
  result.style.opacity = "1";
  
  // Set timeout to hide the message after 3 seconds if autoHide is true
  if (autoHide) {
    resultTimeout = setTimeout(() => {
      result.style.opacity = "0";
    }, 3000);
  }
}

function clearResultMessage() {
  const result = document.getElementById("result");
  result.textContent = "";
  result.className = "";
  result.style.opacity = "0";
  clearTimeout(resultTimeout);
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
      showResultMessage(`Time's up! Final score: ${streak}`, "incorrect", false); // Don't auto-hide time's up message
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

// Focus the input field when a new dog is loaded
function focusInput() {
  document.getElementById("breedInput").focus();
}

// Add listener to dogImage to focus input when a new image is loaded
document.getElementById("dogImage").addEventListener("load", focusInput);