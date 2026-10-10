
document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // 1. COUNTDOWN
  // =========================================

  const weddingDate = new Date("2026-11-21T16:00:00+02:00");

  const countdownDays = document.getElementById("days");
  const countdownHours = document.getElementById("hours");
  const countdownMinutes = document.getElementById("minutes");
  const countdownSeconds = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date();
    const difference = weddingDate.getTime() - now.getTime();

    if (difference <= 0) {
      if (countdownDays) countdownDays.textContent = "00";
      if (countdownHours) countdownHours.textContent = "00";
      if (countdownMinutes) countdownMinutes.textContent = "00";
      if (countdownSeconds) countdownSeconds.textContent = "00";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );
    const minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );
    const seconds = Math.floor(
      (difference / 1000) % 60
    );

    if (countdownDays) {
      countdownDays.textContent = String(days).padStart(2, "0");
    }

    if (countdownHours) {
      countdownHours.textContent = String(hours).padStart(2, "0");
    }

    if (countdownMinutes) {
      countdownMinutes.textContent = String(minutes).padStart(2, "0");
    }

    if (countdownSeconds) {
      countdownSeconds.textContent = String(seconds).padStart(2, "0");
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // =========================================
  // 2. MOBILE NAVIGATION
  // =========================================

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
      });
    });
  }


  // =========================================
  // 3. RSVP GUEST COUNTER
  // =========================================

  const guestsInput = document.getElementById("guests");
  const guestMinus = document.getElementById("guestMinus");
  const guestPlus = document.getElementById("guestPlus");

  if (guestsInput && guestMinus && guestPlus) {
    guestMinus.addEventListener("click", () => {
      const currentValue = Number(guestsInput.value) || 1;

      if (currentValue > 1) {
        guestsInput.value = currentValue - 1;
      }
    });

    guestPlus.addEventListener("click", () => {
      const currentValue = Number(guestsInput.value) || 1;
      const maxGuests = Number(guestsInput.max) || 10;

      if (currentValue < maxGuests) {
        guestsInput.value = currentValue + 1;
      }
    });
  }


  // =========================================
  // 4. RSVP FORM + GOOGLE SHEETS
  // =========================================

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzpkhXDdLhwzNzQhX7_eR67bUi6k9pHI5-5uXf5plNX1O0HHfv1RSv3g1NUf4SNaaZM/exec";

  const rsvpForm = document.getElementById("rsvpForm");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = rsvpForm.querySelector(
        'button[type="submit"]'
      );

      const nameInput = rsvpForm.querySelector('[name="name"]');
      const attendanceInput = rsvpForm.querySelector(
        '[name="attendance"]:checked'
      );
      const messageInput = rsvpForm.querySelector(
        '[name="message"]'
      );

      const name = nameInput ? nameInput.value.trim() : "";
      const attendance = attendanceInput
        ? attendanceInput.value
        : "";
      const guests = guestsInput
        ? Number(guestsInput.value) || 1
        : 1;
      const message = messageInput
        ? messageInput.value.trim()
        : "";

      if (!name) {
        alert("Please enter your name.");
        return;
      }

      if (!attendance) {
        alert("Please select your attendance.");
        return;
      }

      const data = {
        name,
        attendance,
        guests,
        message,
      };

      const originalButtonText = submitButton
        ? submitButton.textContent
        : "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(data),
        });

        alert(
          "Thank you! Your RSVP has been submitted. ♡"
        );

        rsvpForm.reset();

        if (guestsInput) {
          guestsInput.value = "1";
        }
      } catch (error) {
        console.error("RSVP submission error:", error);

        alert(
          "Something went wrong. Please try again."
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }


  // =========================================
  // 5. BACKGROUND MUSIC
  // =========================================

  const musicBtn = document.getElementById("musicBtn");
  const weddingAudio = document.getElementById("weddingAudio");

  if (musicBtn && weddingAudio) {
    musicBtn.addEventListener("click", async () => {
      if (weddingAudio.paused) {
        try {
          await weddingAudio.play();
          musicBtn.textContent = "❚❚";
          musicBtn.setAttribute("aria-label", "Pause music");
        } catch (error) {
          console.error("Music playback error:", error);
          alert("Unable to play the music. Please try again.");
        }
      } else {
        weddingAudio.pause();
        musicBtn.textContent = "♫";
        musicBtn.setAttribute("aria-label", "Play music");
      }
    });

    weddingAudio.addEventListener("ended", () => {
      musicBtn.textContent = "♫";
      musicBtn.setAttribute("aria-label", "Play music");
    });
  }


  // =========================================
  // 6. WEDDING CONFETTI
  // =========================================

  const confettiContainer = document.getElementById(
    "weddingConfetti"
  );

  if (confettiContainer) {
    for (let i = 0; i < 55; i++) {
      const piece = document.createElement("span");

      const x = Math.random() * window.innerWidth;
      const delay = Math.random() * 5;
      const duration = 4 + Math.random() * 5;

      piece.style.setProperty("--x", `${x}px`);
      piece.style.setProperty("--delay", `${delay}s`);
      piece.style.setProperty("--duration", `${duration}s`);

      confettiContainer.appendChild(piece);
    }
  }


  // =========================================
  // 7. FALLING PARTICLES
  // =========================================

  function createFallingParticle(burst = false) {
    const particle = document.createElement("div");

    particle.className = "falling-particle";
    particle.textContent = Math.random() > 0.5 ? "♡" : "✦";

    if (burst) {
      // Random position across the screen for the opening burst
      particle.style.left = `${10 + Math.random() * 80}%`;
      particle.style.top = `${10 + Math.random() * 75}%`;
      particle.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      particle.style.fontSize = `${18 + Math.random() * 22}px`;
      particle.style.zIndex = "1000000";
    } else {
      // Keep the existing falling effect unchanged
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${5 + Math.random() * 5}s`;
    }

    particle.style.opacity = `${0.3 + Math.random() * 0.5}`;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, burst ? 4000 : 11000);
  }

  // Existing continuous falling decorations
  setInterval(() => createFallingParticle(false), 400);


  // =========================================
  // 8. OPENING ENVELOPE
  // =========================================

  const weddingOpening = document.getElementById("weddingOpening");
  const envelope = document.querySelector(".envelope");
  const envelopeSeal = document.querySelector(".envelope-seal");

  if (weddingOpening && envelope && envelopeSeal) {
    envelopeSeal.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Prevent opening the envelope more than once
      if (weddingOpening.classList.contains("play")) {
        return;
      }

      // Open the envelope
      weddingOpening.classList.add("play");

      // Show a random burst of decorations when the seal is clicked
      for (let i = 0; i < 25; i++) {
        setTimeout(() => {
          createFallingParticle(true);
        }, Math.random() * 500);
      }


      // Hide the envelope faster: 1.5 seconds
      setTimeout(() => {
        weddingOpening.classList.add("hide");
      }, 1500);

      // Start the wedding music
      if (weddingAudio && weddingAudio.paused) {
        try {
          await weddingAudio.play();

          if (musicBtn) {
            musicBtn.textContent = "❚❚";
            musicBtn.setAttribute("aria-label", "Pause music");
          }
        } catch (error) {
          console.log("Music can be started using the music button.");
        }
      }
    });
  }


  // =========================================
  // GIFT BOOK COVER — OPEN BOOK
  // =========================================

  const giftbookCover = document.getElementById("giftbookCover");
  const giftbookOpenBtn = document.getElementById("giftbookOpenBtn");
  const giftbookContent = document.getElementById("giftbookContent");

  if (giftbookCover && giftbookOpenBtn && giftbookContent) {
    giftbookOpenBtn.addEventListener("click", () => {
      giftbookOpenBtn.disabled = true;
      giftbookCover.classList.add("is-opening");

      setTimeout(() => {
        giftbookCover.hidden = true;
        giftbookContent.hidden = false;
      }, 550);
    });
  }



  // =========================================
  // 9. GIFT BOOK — LOAD MESSAGES FROM GOOGLE SHEETS
  // =========================================

  const giftbookSection = document.getElementById("giftbook");

  if (giftbookSection) {
    const giftbookStatus = document.getElementById(
      "giftbookStatus"
    );

    const giftbookEntry = document.getElementById(
      "giftbookEntry"
    );

    const giftbookMessage = document.getElementById(
      "giftbookMessage"
    );

    const giftbookName = document.getElementById(
      "giftbookName"
    );

    const giftbookPrev = document.getElementById(
      "giftbookPrev"
    );

    const giftbookNext = document.getElementById(
      "giftbookNext"
    );

    const giftbookPageCount = document.getElementById(
      "giftbookPageCount"
    );

    let giftMessages = [];
    let currentGiftPage = 0;

    function showGiftbookStatus(message) {
      if (giftbookStatus) {
        giftbookStatus.textContent = message;
        giftbookStatus.hidden = false;
      }

      if (giftbookEntry) {
        giftbookEntry.hidden = true;
      }

      if (giftbookPageCount) {
        giftbookPageCount.textContent = "Page 0 of 0";
      }

      if (giftbookPrev) {
        giftbookPrev.disabled = true;
      }

      if (giftbookNext) {
        giftbookNext.disabled = true;
      }
    }

    function renderGiftbookPage() {
      if (!giftMessages.length) {
        showGiftbookStatus(
          "No wishes yet. Be the first to leave a message in the RSVP form. ♡"
        );
        return;
      }

      const currentMessage = giftMessages[currentGiftPage];

      if (!currentMessage) {
        return;
      }

      if (giftbookStatus) {
        giftbookStatus.hidden = true;
      }

      if (giftbookEntry) {
        giftbookEntry.hidden = false;
      }

      if (giftbookMessage) {
        giftbookMessage.textContent = currentMessage.message;
      }

      if (giftbookName) {
        giftbookName.textContent = `With love, ${currentMessage.name} ♡`;
      }

      if (giftbookPageCount) {
        giftbookPageCount.textContent =
          `Page ${currentGiftPage + 1} of ${giftMessages.length}`;
      }

      if (giftbookPrev) {
        giftbookPrev.disabled = currentGiftPage === 0;
      }

      if (giftbookNext) {
        giftbookNext.disabled =
          currentGiftPage >= giftMessages.length - 1;
      }
    }

    if (giftbookPrev) {
      giftbookPrev.addEventListener("click", () => {
        if (currentGiftPage > 0) {
          currentGiftPage--;
          renderGiftbookPage();
        }
      });
    }

    if (giftbookNext) {
      giftbookNext.addEventListener("click", () => {
        if (currentGiftPage < giftMessages.length - 1) {
          currentGiftPage++;
          renderGiftbookPage();
        }
      });
    }

    function loadGiftbookMessages() {
      showGiftbookStatus("Loading your beautiful wishes...");

      const callbackName =
        "giftbookCallback_" +
        Date.now() +
        "_" +
        Math.random().toString(36).slice(2);

      const script = document.createElement("script");

      let finished = false;

      const cleanup = () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }

        if (window[callbackName]) {
          delete window[callbackName];
        }

        clearTimeout(timeoutId);
      };

      const timeoutId = setTimeout(() => {
        if (finished) return;

        finished = true;
        cleanup();

        showGiftbookStatus(
          "We couldn't load the wishes right now. Please refresh the page and try again."
        );
      }, 15000);

      window[callbackName] = (response) => {
        if (finished) return;

        finished = true;
        cleanup();

        if (!response || response.success !== true) {
          console.error(
            "Gift Book response error:",
            response?.error || "Invalid response"
          );

          showGiftbookStatus(
            "We couldn't load the wishes right now. Please try again later."
          );

          return;
        }

        giftMessages = Array.isArray(response.messages)
          ? response.messages.filter((item) => {
            return (
              item &&
              typeof item.name === "string" &&
              item.name.trim() &&
              typeof item.message === "string" &&
              item.message.trim()
            );
          })
          : [];

        currentGiftPage = 0;

        if (!giftMessages.length) {
          showGiftbookStatus(
            "No wishes yet. Be the first to leave a message in the RSVP form. ♡"
          );
          return;
        }

        renderGiftbookPage();
      };

      script.onerror = () => {
        if (finished) return;

        finished = true;
        cleanup();

        showGiftbookStatus(
          "We couldn't connect to the Gift Book. Please refresh the page and try again."
        );
      };

      script.src =
        GOOGLE_SCRIPT_URL +
        "?callback=" +
        encodeURIComponent(callbackName) +
        "&_=" +
        Date.now();

      document.head.appendChild(script);
    }

    loadGiftbookMessages();
  }
});
