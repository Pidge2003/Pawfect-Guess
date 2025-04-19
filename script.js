let dogs = [];
let currentDog = null;
let attemptsLeft = 3;
let streak = 0; // Streak tracking variable

async function fetchDogs() {
  try {
    const res = await fetch("dogs.json");
    dogs = await res.json();
    loadDog();
  } catch (err) {
    console.error("Error loading dogs.json:", err);
  }
}

function loadDog() {
  if (dogs.length === 0) return;

  const randomIndex = Math.floor(Math.random() * dogs.length);
  currentDog = dogs[randomIndex];

  document.getElementById("dogImage").src = currentDog.image;
  document.getElementById("breedInput").value = "";
  document.getElementById("result").textContent = "";
  attemptsLeft = 3;
  
  // Update streak display
  document.getElementById("streakCount").textContent = streak;
}

function checkBreed() {
  const input = document.getElementById("breedInput").value.toLowerCase().trim();
  const result = document.getElementById("result");

  if (input === currentDog.breed.toLowerCase()) {
    // Correct guess - increase streak
    streak++;
    result.textContent = "🎉 Correct!";
    result.style.color = "green";

    // Move to next dog after a short delay
    setTimeout(loadDog, 1000);
  } else {
    attemptsLeft--;

    if (attemptsLeft > 0) {
      result.textContent = `❌ Try again! ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left.`;
      result.style.color = "orange";
    } else {
      result.textContent = `😔 Out of tries! It was "${currentDog.breed}".`;
      result.style.color = "red";

      // Reset streak and move to next dog after a short delay
      streak = 0;
      setTimeout(loadDog, 2000);
    }
  }

  // Update streak display
  document.getElementById("streakCount").textContent = streak;
}

// Reset streak when user clicks "Next Dog"
function nextDog() {
  streak = 0; // Reset streak
  updateStreakDisplay();
  loadDog();
}

// Update streak display
function updateStreakDisplay() {
  document.getElementById("streakCount").textContent = streak;
}

// Call fetchDogs on load
window.onload = fetchDogs;

document.addEventListener('DOMContentLoaded', () => {
    const breedInput = document.getElementById('breedInput');
  
    breedInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault(); // Stop form from submitting if inside a form
        checkBreed(); // Submit guess
      }
    });
  });