let dogs = [];
let currentDog = null;
let attemptsLeft = 3;

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
}

function checkBreed() {
  const input = document.getElementById("breedInput").value.toLowerCase().trim();
  const result = document.getElementById("result");

  if (input === currentDog.breed.toLowerCase()) {
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

      // Move to next dog after a short delay
      setTimeout(loadDog, 2000);
    }
  }
}

// Call fetchDogs on load
window.onload = fetchDogs;
