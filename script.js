let currentBreed = "";
let attemptsLeft = 3;

function loadDogImage() {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then(response => response.json())
    .then(data => {
      const imageUrl = data.message;
      document.getElementById("dogImage").src = imageUrl;

      // Extract and format breed name
      const parts = imageUrl.split("/");
      const breedIndex = parts.indexOf("breeds") + 1;
      currentBreed = parts[breedIndex];

      if (currentBreed.includes("-")) {
        let [main, sub] = currentBreed.split("-");
        currentBreed = `${sub} ${main}`;
      }

      currentBreed = currentBreed.toLowerCase();

      // Reset game state
      attemptsLeft = 3;
      document.getElementById("breedInput").value = "";
      document.getElementById("result").textContent = "";
    });
}

function checkBreed() {
  const userGuess = document.getElementById("breedInput").value.toLowerCase().trim();
  const resultText = document.getElementById("result");

  if (userGuess === currentBreed) {
    resultText.textContent = "🐾 Correct! Loading next dog...";
    resultText.style.color = "green";

    setTimeout(() => {
      loadDogImage();
    }, 1500);
  } else {
    attemptsLeft--;

    if (attemptsLeft > 0) {
      resultText.textContent = `❌ Incorrect. You have ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left.`;
      resultText.style.color = "orange";
    } else {
      resultText.textContent = `😢 Out of attempts! It was "${currentBreed}".`;
      resultText.style.color = "red";
    }
  }
}

// Load the first dog when the page loads
window.onload = loadDogImage;
