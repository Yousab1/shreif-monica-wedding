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
  const guestMinus = document.querySelector('[data-action="minus"]');
  const guestPlus = document.querySelector('[data-action="plus"]');

  if (guestsInput && guestMinus && guestPlus) {
    guestMinus.addEventListener("click", () => {
      const currentValue = Number(guestsInput.value) || 1;
      const minGuests = Number(guestsInput.min) || 1;

      if (currentValue > minGuests) {
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

  const musicFiles = {
    1: "assets/حسين الجسمي - زفة إدخلي عمري.mp3",
    2: "assets/Ed Sheeran - Perfect (Official Music Video) (mp3cut.net).mp3"
  };

  let selectedTrack = null;
  let musicSelectionPromise = null;

  function selectVisitorMusic() {
    if (selectedTrack) {
      return Promise.resolve(selectedTrack);
    }

    if (musicSelectionPromise) {
      return musicSelectionPromise;
    }

    musicSelectionPromise = new Promise((resolve) => {
      const callbackName =
        "musicCallback_" +
        Date.now() +
        "_" +
        Math.floor(Math.random() * 100000);

      const script = document.createElement("script");
      let timeoutId;

      function cleanup() {
        clearTimeout(timeoutId);
        script.remove();
        delete window[callbackName];
      }

      window[callbackName] = (response) => {
        cleanup();

        if (
          response &&
          response.success &&
          musicFiles[response.track]
        ) {
          selectedTrack = response.track;

          weddingAudio.src = musicFiles[selectedTrack];
          weddingAudio.load();

          resolve(selectedTrack);
        } else {
          resolve(null);
        }
      };

      script.onerror = () => {
        cleanup();
        resolve(null);
      };

      timeoutId = setTimeout(() => {
        cleanup();
        resolve(null);
      }, 10000);

      script.src =
        GOOGLE_SCRIPT_URL +
        "?action=nextTrack&callback=" +
        encodeURIComponent(callbackName) +
        "&_=" +
        Date.now();

      document.head.appendChild(script);
    });

    return musicSelectionPromise;
  }

  async function playWeddingMusic() {
    if (!weddingAudio) return;

    try {
      await selectVisitorMusic();
      await weddingAudio.play();

      if (musicBtn) {
        musicBtn.textContent = "❚❚";
        musicBtn.setAttribute("aria-label", "Pause music");
      }
    } catch (error) {
      console.error("Music playback error:", error);
      if (musicBtn) {
        musicBtn.textContent = "♫";
        musicBtn.setAttribute("aria-label", "Play music");
      }
    }
  }

  selectVisitorMusic();
  if (musicBtn && weddingAudio) {
    musicBtn.addEventListener("click", async () => {
      if (weddingAudio.paused) {
        await playWeddingMusic();
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
  // 6. WEDDING CONFETTI & PARTICLES
  // =========================================

  const confettiContainer = document.getElementById("weddingConfetti");

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

  function createFallingParticle(burst = false) {
    const particle = document.createElement("div");
    particle.className = "falling-particle";
    particle.textContent = Math.random() > 0.5 ? "♡" : "✦";

    if (burst) {
      particle.style.left = `${10 + Math.random() * 80}%`;
      particle.style.top = `${10 + Math.random() * 75}%`;
      particle.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      particle.style.fontSize = `${18 + Math.random() * 22}px`;
      particle.style.zIndex = "1000000";
    } else {
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${5 + Math.random() * 5}s`;
    }

    particle.style.opacity = `${0.3 + Math.random() * 0.5}`;
    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, burst ? 4000 : 11000);
  }

  setInterval(() => createFallingParticle(false), 400);


  // =========================================
  // 7. OPENING ENVELOPE
  // =========================================

  const weddingOpening = document.getElementById("weddingOpening");
  const envelope = document.querySelector(".envelope");
  const envelopeSeal = document.querySelector(".envelope-seal");

  if (weddingOpening && envelope && envelopeSeal) {
    envelopeSeal.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (weddingOpening.classList.contains("play")) return;

      weddingOpening.classList.add("play");

      for (let i = 0; i < 25; i++) {
        setTimeout(() => {
          createFallingParticle(true);
        }, Math.random() * 500);
      }

      setTimeout(() => {
        weddingOpening.classList.add("hide");
      }, 1800);

      if (weddingAudio && weddingAudio.paused) {
        await playWeddingMusic();
      }
    });
  }


  // =========================================
  // 8. SOBA CHAT ASSISTANT (CONNECTED TO 5 DRESS CODE COLORS)
  // =========================================

  const sobaMessages = document.getElementById("sobaMessages");
  const sobaInputArea = document.getElementById("sobaInputArea");

  if (sobaMessages && sobaInputArea) {
    const sobaQuestions = [
      {
        question: "Hey gorgeous! ✨ I'm Soba, your little color-match assistant. Not sure which color suits your vibe? Let me help! What's your ideal weekend?",
        options: [
          { text: "A cozy day at home 🏡", colorKey: "babyBlue" },
          { text: "A fancy dinner with friends 🍷", colorKey: "pastelLilac" },
          { text: "A sunny day outdoors ☀️", colorKey: "butterYellow" },
          { text: "A romantic evening 🕯️", colorKey: "pastelPink" },
          { text: "A fun day full of adventures 🎒", colorKey: "mintGreen" }
        ]
      },
      {
        question: "Which word describes your personality best?",
        options: [
          { text: "Elegant 🤍", colorKey: "pastelLilac" },
          { text: "Romantic 🌸", colorKey: "pastelPink" },
          { text: "Calm 🌊", colorKey: "babyBlue" },
          { text: "Cheerful 🌻", colorKey: "butterYellow" },
          { text: "Bold & Fresh 🌿", colorKey: "mintGreen" }
        ]
      },
      {
        question: "Pick your dream destination.",
        options: [
          { text: "Paris 🗼", colorKey: "pastelLilac" },
          { text: "A tropical beach 🏝️", colorKey: "babyBlue" },
          { text: "The countryside 🌾", colorKey: "butterYellow" },
          { text: "A beautiful garden 🌷", colorKey: "mintGreen" },
          { text: "A luxury city hotel ✨", colorKey: "pastelPink" }
        ]
      },
      {
        question: "What's your favorite kind of atmosphere?",
        options: [
          { text: "Soft and dreamy ☁️", colorKey: "babyBlue" },
          { text: "Warm and cozy 🔥", colorKey: "butterYellow" },
          { text: "Fresh and peaceful 🍃", colorKey: "mintGreen" },
          { text: "Bright and joyful ☀️", colorKey: "butterYellow" },
          { text: "Chic and sophisticated 💎", colorKey: "pastelLilac" }
        ]
      },
      {
        question: "How would you like to feel at the wedding?",
        options: [
          { text: "Like a princess 👑", colorKey: "pastelPink" },
          { text: "Graceful and elegant 🦢", colorKey: "babyBlue" },
          { text: "Fresh and relaxed 🌿", colorKey: "mintGreen" },
          { text: "Sweet and romantic 💕", colorKey: "pastelLilac" },
          { text: "Confident and radiant ✨", colorKey: "butterYellow" }
        ]
      }
    ];

    let currentSobaStep = 0;
    let colorScores = {
      babyBlue: 0,
      pastelLilac: 0,
      butterYellow: 0,
      mintGreen: 0,
      pastelPink: 0
    };

    function appendSobaMessage(text, sender = "bot") {
      const msgDiv = document.createElement("div");
      msgDiv.className = `soba-msg ${sender}`;
      msgDiv.innerHTML = text;
      sobaMessages.appendChild(msgDiv);
      sobaMessages.scrollTop = sobaMessages.scrollHeight;
    }

    function renderSobaStep() {
      sobaInputArea.innerHTML = "";
      if (currentSobaStep < sobaQuestions.length) {
        const q = sobaQuestions[currentSobaStep];
        appendSobaMessage(q.question, "bot");

        q.options.forEach(opt => {
          const btn = document.createElement("button");
          btn.className = "soba-option-btn";
          btn.textContent = opt.text;
          btn.addEventListener("click", () => {
            appendSobaMessage(opt.text, "user");
            colorScores[opt.colorKey]++;
            currentSobaStep++;
            setTimeout(renderSobaStep, 600);
          });
          sobaInputArea.appendChild(btn);
        });
      } else {
        let bestColor = "babyBlue";
        let maxScore = -1;
        for (let key in colorScores) {
          if (colorScores[key] > maxScore) {
            maxScore = colorScores[key];
            bestColor = key;
          }
        }

        const colorDetails = {
          babyBlue: { name: "Baby Blue", hex: "#d2e4f0", desc: "Soft, dreamy, and utterly graceful. Calm & Graceful 🌊" },
          pastelLilac: { name: "Pastel Lilac", hex: "#dfcfe8", desc: "Elegant, royal, and full of charm. Elegant & Chic 💜" },
          butterYellow: { name: "Butter Yellow", hex: "#fef0c7", desc: "Warm, radiant, and beautifully cheerful. Bright & Joyful ☀️" },
          mintGreen: { name: "Mint Green", hex: "#d1ebd8", desc: "Fresh, serene, and naturally breath-taking. Fresh & Natural 🌿" },
          pastelPink: { name: "Pastel Pink", hex: "#fad2d9", desc: "Sweet, romantic, and classic. Soft & Romantic 💕" }
        };

        const result = colorDetails[bestColor];

        appendSobaMessage(`Aww, you're all done! 💕 Based on your wonderful personality, I found your absolute perfect match from our Dress Code:`, "bot");

        const resultDiv = document.createElement("div");
        resultDiv.className = "soba-msg bot";
        resultDiv.style.background = "#fff";
        resultDiv.style.border = "1px solid var(--gold)";
        resultDiv.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <span style="width: 34px; height: 34px; border-radius: 50%; background: ${result.hex}; display: inline-block; border: 2px solid var(--gold); box-shadow: 0 3px 10px rgba(0,0,0,0.1);"></span>
            <strong style="font-size: 16px; color: var(--brown);">${result.name}</strong>
          </div>
          <p style="font-size: 12px; color: var(--muted); margin-bottom: 12px;">${result.desc}</p>
          <a href="#rsvp" class="btn btn-gold" style="padding: 8px 18px; font-size: 9px; min-height: 36px; text-decoration: none; color: white;">CHOOSE THIS COLOR ♡</a>
        `;
        sobaMessages.appendChild(resultDiv);

        const resetBtn = document.createElement("button");
        resetBtn.className = "soba-option-btn";
        resetBtn.textContent = "Start Over ↺";
        resetBtn.addEventListener("click", () => {
          currentSobaStep = 0;
          colorScores = { babyBlue: 0, pastelLilac: 0, butterYellow: 0, mintGreen: 0, pastelPink: 0 };
          sobaMessages.innerHTML = "";
          renderSobaStep();
        });
        sobaInputArea.appendChild(resetBtn);
        sobaMessages.scrollTop = sobaMessages.scrollHeight;
      }
    }

    renderSobaStep();
  }


  // =========================================
  // 9. GIFT BOOK COVER & LOAD MESSAGES
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

  const giftbookSection = document.getElementById("giftbook");

  if (giftbookSection) {
    const giftbookStatus = document.getElementById("giftbookStatus");
    const giftbookEntry = document.getElementById("giftbookEntry");
    const giftbookMessage = document.getElementById("giftbookMessage");
    const giftbookName = document.getElementById("giftbookName");
    const giftbookPrev = document.getElementById("giftbookPrev");
    const giftbookNext = document.getElementById("giftbookNext");
    const giftbookPageCount = document.getElementById("giftbookPageCount");

    let giftMessages = [];
    let currentGiftPage = 0;

    function showGiftbookStatus(message) {
      if (giftbookStatus) {
        giftbookStatus.textContent = message;
        giftbookStatus.hidden = false;
      }
      if (giftbookEntry) giftbookEntry.hidden = true;
      if (giftbookPageCount) giftbookPageCount.textContent = "Page 0 of 0";
      if (giftbookPrev) giftbookPrev.disabled = true;
      if (giftbookNext) giftbookNext.disabled = true;
    }

    function renderGiftbookPage() {
      if (!giftMessages.length) {
        showGiftbookStatus("No wishes yet. Be the first to leave a message in the RSVP form. ♡");
        return;
      }

      const currentMessage = giftMessages[currentGiftPage];
      if (!currentMessage) return;

      if (giftbookStatus) giftbookStatus.hidden = true;
      if (giftbookEntry) giftbookEntry.hidden = false;
      if (giftbookMessage) giftbookMessage.textContent = currentMessage.message;
      if (giftbookName) giftbookName.textContent = ` ${currentMessage.name} ♡`;
      if (giftbookPageCount) {
        giftbookPageCount.textContent = `Page ${currentGiftPage + 1} of ${giftMessages.length}`;
      }
      if (giftbookPrev) giftbookPrev.disabled = currentGiftPage === 0;
      if (giftbookNext) giftbookNext.disabled = currentGiftPage >= giftMessages.length - 1;
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

      const callbackName = "giftbookCallback_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      const script = document.createElement("script");
      let finished = false;

      const cleanup = () => {
        if (script.parentNode) script.parentNode.removeChild(script);
        if (window[callbackName]) delete window[callbackName];
        clearTimeout(timeoutId);
      };

      const timeoutId = setTimeout(() => {
        if (finished) return;
        finished = true;
        cleanup();
        showGiftbookStatus("We couldn't load the wishes right now. Please try again later.");
      }, 15000);

      window[callbackName] = (response) => {
        if (finished) return;
        finished = true;
        cleanup();

        if (!response || response.success !== true) {
          showGiftbookStatus("We couldn't load the wishes right now. Please try again later.");
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
          showGiftbookStatus("No wishes yet. Be the first to leave a message in the RSVP form. ♡");
          return;
        }

        renderGiftbookPage();
      };

      script.onerror = () => {
        if (finished) return;
        finished = true;
        cleanup();
        showGiftbookStatus("We couldn't connect to the Gift Book. Please refresh the page.");
      };

      script.src = GOOGLE_SCRIPT_URL + "?callback=" + encodeURIComponent(callbackName) + "&_=" + Date.now();
      document.head.appendChild(script);
    }

    loadGiftbookMessages();
  }
});