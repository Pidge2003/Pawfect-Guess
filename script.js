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

  // Pick a random dog from the list
  const randomIndex = Math.floor(Math.random() * dogs.length);
  currentDog = dogs[randomIndex];

  // Update the image
  const img = document.getElementById("dogImage");
  img.src = currentDog.image;

  // Reset UI
  document.getElementById("breedInput").value = "";
  document.getElementById("result").textContent = "";
  attemptsLeft = 3;
}

function checkBreed() {
  const input = document.getElementById("breedInput").value.toLowerCase().trim();
  const result = document.getElementById("result");

  if (input === currentDog.breed.toLowerCase()) {
    result.textContent = "🎉 Correct! Loading new dog...";
    result.style.color = "green";
    setTimeout(loadDog, 1500);
  } else {
    attemptsLeft--;

    if (attemptsLeft > 0) {
      result.textContent = `❌ Try again! ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left.`;
      result.style.color = "orange";
    } else {
      result.textContent = `😔 Out of tries! The correct answer was "${currentDog.breed}".`;
      result.style.color = "red";
    }
  }
}

window.onload = fetchDogs;
