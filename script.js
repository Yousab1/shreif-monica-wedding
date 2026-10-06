// ===============================
// SHREIF & MONICA WEDDING WEBSITE
// ===============================

// Wedding date: November 21, 2026.
// Change the time below when you know the exact ceremony time.
const weddingDate = new Date("2026-11-21T16:00:00+02:00");

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(secs).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// RSVP guest stepper
const guestsInput = document.getElementById("guests");

document.querySelectorAll(".stepper button").forEach(button => {
  button.addEventListener("click", () => {
    let value = Number(guestsInput.value);

    if (button.dataset.action === "plus") value = Math.min(value + 1, 10);
    if (button.dataset.action === "minus") value = Math.max(value - 1, 1);

    guestsInput.value = value;
  });
});

// ===============================
// GOOGLE SHEETS CONNECTION
// ===============================
// Paste your deployed Google Apps Script Web App URL here.
// Example:
// const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpkhXDdLhwzNzQhX7_eR67bUi6k9pHI5-5uXf5plNX1O0HHfv1RSv3g1NUf4SNaaZM/exec";
const rsvpForm = document.getElementById("rsvpForm");
const formStatus = document.getElementById("formStatus");

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!GOOGLE_SCRIPT_URL) {
    formStatus.textContent =
      "Demo mode: add your Google Apps Script URL in script.js to enable RSVP submission.";
    return;
  }

  const submitButton = rsvpForm.querySelector(".submit-btn");
  submitButton.disabled = true;
  submitButton.textContent = "SENDING...";

  const formData = new FormData(rsvpForm);

  const data = {
    name: formData.get("name"),
    attendance: formData.get("attendance"),
    guests: formData.get("guests"),
    message: formData.get("message")
  };

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    formStatus.textContent = "Thank you! Your RSVP has been received. ♡";
    rsvpForm.reset();
    guestsInput.value = 1;
  } catch (error) {
    formStatus.textContent =
      "Something went wrong. Please try again or contact the couple.";
    console.error(error);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = "SEND RSVP <span>➤</span>";
  }
});

// Music button
const musicBtn = document.getElementById("musicBtn");
const audio = document.getElementById("weddingAudio");

// Try to start music automatically
async function startWeddingMusic() {
  try {
    await audio.play();
    musicBtn.textContent = "❚❚";
  } catch (error) {
    console.log("Autoplay was blocked by the browser.");
  }
}

window.addEventListener("load", () => {
  startWeddingMusic();
});

// Music button
musicBtn.addEventListener("click", async () => {
  if (!audio.querySelector("source")) {
    alert("Add your wedding song in index.html first.");
    return;
  }

  if (audio.paused) {
    await audio.play();
    musicBtn.textContent = "❚❚";
  } else {
    audio.pause();
    musicBtn.textContent = "♫";
  }
});


// =========================================
// WEDDING DECORATION
// =========================================

const weddingConfetti =
  document.getElementById("weddingConfetti");

const decorations = [
  "♡",
  "✦",
  "✧",
  "♡",
  "•",
  "✦",
  "♡",
  "✧"
];

for (let i = 0; i < 55; i++) {

  const piece = document.createElement("span");

  piece.textContent =
    decorations[
    Math.floor(Math.random() * decorations.length)
    ];

  const angle =
    Math.random() * Math.PI * 2;

  const distance =
    180 + Math.random() * 420;

  const x =
    Math.cos(angle) * distance;

  const y =
    Math.sin(angle) * distance;

  piece.style.setProperty(
    "--x",
    `${x}px`
  );

  piece.style.setProperty(
    "--y",
    `${y}px`
  );

  piece.style.animationDelay =
    `${Math.random() * .35}s`;

  weddingConfetti.appendChild(piece);
}

// =========================================
// WEDDING ENVELOPE OPENING
// =========================================

const weddingOpening =
  document.getElementById("weddingOpening");

const envelope =
  document.querySelector(".envelope");

let openingStarted = false;

envelope.addEventListener("click", async () => {

  if (openingStarted) return;

  openingStarted = true;

  // Open envelope
  weddingOpening.classList.add("play");

  // show envelope
  weddingConfetti.classList.add("show");

  // Start music from the same click
  try {
    await audio.play();
    musicBtn.textContent = "❚❚";
  } catch (error) {
    console.log("Music could not start.");
  }

  // Hide opening
  setTimeout(() => {
    weddingOpening.classList.add("hide");
  }, 4300);

  // Remove opening completely
  setTimeout(() => {
    weddingOpening.remove();
  }, 5500);

});