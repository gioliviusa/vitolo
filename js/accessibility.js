
// ===============================
// GLOBAL STATE
// ===============================
let fontSize = 16;
let isSpeaking = false;
let animationsPaused = false;

// ===============================
// SCREEN READER ANNOUNCER
// ===============================
function announce(message) {
  const el = document.getElementById("sr-announcer");
  if (!el) return;
  el.textContent = message;
}

// ===============================
// PANEL TOGGLE + KEYBOARD SUPPORT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("togglePanel");
  const panel = document.getElementById("panel");

  if (!toggle || !panel) return;

  toggle.onclick = (e) => {
    e.stopPropagation();

    const isOpening = panel.hidden;
    panel.hidden = !panel.hidden;

    toggle.setAttribute("aria-expanded", isOpening.toString());

    if (isOpening) panel.focus();

    announce(isOpening
      ? "Accessibility panel opened"
      : "Accessibility panel closed"
    );
  };

  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle.click();
    }
  });
});

// ===============================
// TEXT ZOOM
// ===============================
function zoomIn() {
  fontSize += 2;
  document.body.style.fontSize = fontSize + "px";
  announce("Text size increased");
}

function zoomOut() {
  fontSize -= 2;
  document.body.style.fontSize = fontSize + "px";
  announce("Text size decreased");
}

// ===============================
// VISUAL FEATURES
// ===============================
function toggleClass(className, buttonSelector, onMsg, offMsg) {
  const active = document.body.classList.toggle(className);

  const btn = document.querySelector(buttonSelector);
  if (btn) btn.setAttribute("aria-pressed", active);

  announce(active ? onMsg : offMsg);
}

function toggleContrast() {
  toggleClass("high-contrast", '[onclick="toggleContrast()"]',
    "High contrast enabled", "High contrast disabled");
}

function toggleLinks() {
  toggleClass("highlight-links", '[onclick="toggleLinks()"]',
    "Links highlighted", "Links highlight disabled");
}

function toggleSpacing() {
  toggleClass("text-spacing", '[onclick="toggleSpacing()"]',
    "Text spacing enabled", "Text spacing disabled");
}

function toggleImages() {
  toggleClass("hide-images", '[onclick="toggleImages()"]',
    "Images hidden", "Images visible");
}

function toggleDyslexia() {
  toggleClass("dyslexia-mode", '[onclick="toggleDyslexia()"]',
    "Dyslexia mode enabled", "Dyslexia mode disabled");
}

function toggleLineHeight() {
  toggleClass("line-height", '[onclick="toggleLineHeight()"]',
    "Line height increased", "Line height normal");
}

function toggleAlign() {
  toggleClass("text-align", '[onclick="toggleAlign()"]',
    "Text centered", "Text normal");
}

function toggleSaturation() {
  toggleClass("low-saturation", '[onclick="toggleSaturation()"]',
    "Low saturation enabled", "Normal colors");
}

// ===============================
// SCREEN READER MODE
// ===============================
function toggleScreenReaderMode() {
  const active = document.body.classList.toggle("screen-reader-mode");

  const btn = document.querySelector('[onclick="toggleScreenReaderMode()"]');
  if (btn) btn.setAttribute("aria-pressed", active);

  if (!active) window.speechSynthesis.cancel();

  announce(active
    ? "Screen reader mode enabled"
    : "Screen reader mode disabled");
}

// ===============================
// SPEECH ENGINE
// ===============================
function speak(text) {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    return;
  }

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";

  isSpeaking = true;

  speech.onend = () => {
    isSpeaking = false;
  };

  window.speechSynthesis.speak(speech);
}

// Click → read clicked content
document.addEventListener("click", (e) => {
  if (!document.body.classList.contains("screen-reader-mode")) return;

  const target = e.target;
  let text = target.innerText;

  if (!text || text.length < 2) return;

  if (target.tagName === "BUTTON") {
    speak(text);
    return;
  }

  if (text.length < 20) {
    const parent = target.closest("section, div, article");
    if (parent) text = parent.innerText;
  }

  speak(text.trim());
});

// ===============================
// PANEL CLOSE (ESC + OUTSIDE CLICK)
// ===============================
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const panel = document.getElementById("panel");
    const toggle = document.getElementById("togglePanel");

    if (panel) panel.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");

    announce("Accessibility panel closed");
  }
});

document.addEventListener("click", (e) => {
  const panel = document.getElementById("panel");
  const toggle = document.getElementById("togglePanel");

  if (!panel || !toggle) return;

  if (!panel.contains(e.target) && !toggle.contains(e.target)) {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }
});

// ===============================
// PAGE STRUCTURE POPUP (FIXED)
// ===============================
function showStructure(e) {
  if (e) e.stopPropagation(); // 🔥 KLUCZ

  const list = document.getElementById("structureList");
  const popup = document.getElementById("structurePopup");

  if (!list || !popup) return;

  list.innerHTML = "";

  const main = document.querySelector("main");
  if (!main) return;

  const elements = main.querySelectorAll("h1, h2, h3, h4, section");

  elements.forEach(el => {
    const li = document.createElement("li");

    const tag = el.tagName.toLowerCase();
    const text = el.innerText || "No text";

    li.textContent = `${tag.toUpperCase()}: ${text.substring(0, 50)}`;

    if (tag === "h1") li.classList.add("level-1");
    if (tag === "h2") li.classList.add("level-2");
    if (tag === "h3") li.classList.add("level-3");
    if (tag === "h4") li.classList.add("level-4");
    if (tag === "section") li.classList.add("level-1");

    li.onclick = () => {
      el.scrollIntoView({ behavior: "smooth" });
    };

    list.appendChild(li);
  });

  popup.hidden = false;
}

function closeStructure() {
  document.getElementById("structurePopup").hidden = true;
}

document.addEventListener("click", (e) => {
  const popup = document.getElementById("structurePopup");
  const content = document.querySelector(".structure-content");

  if (!popup || popup.hidden) return;

  // 🔥 ignoruj klik w button otwierający
  if (e.target.closest('[onclick="showStructure(event)"]')) return;

  if (!content.contains(e.target)) {
    popup.hidden = true;
  }
});

// ===============================
// RESET ALL SETTINGS
// ===============================
function resetAccessibility() {

  document.body.classList.remove(
    "high-contrast",
    "highlight-links",
    "text-spacing",
    "screen-reader-mode",
    "dyslexia-mode",
    "line-height",
    "text-align",
    "low-saturation",
    "hide-images"
  );

  fontSize = 16;
  document.body.style.fontSize = "16px";

  window.speechSynthesis.cancel();
  isSpeaking = false;

  document.querySelectorAll("#panel button").forEach(btn => {
    btn.setAttribute("aria-pressed", "false");
  });

  announce("All accessibility settings reset");
}

function pauseAnimations() {
  animationsPaused = !animationsPaused;

  // CSS animations
  document.body.classList.toggle("no-animations", animationsPaused);

  // 🎬 VIDEO CONTROL (TYLKO play/pause)
  document.querySelectorAll(".video-background").forEach(video => {

    if (animationsPaused) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }

  });

  const btn = document.querySelector('[onclick="pauseAnimations()"]');
  if (btn) btn.setAttribute("aria-pressed", animationsPaused);

  announce(
    animationsPaused
      ? "Animations and videos paused"
      : "Animations and videos resumed"
  );
}


document.querySelectorAll(".video-background").forEach(video => {

  video.addEventListener("loadeddata", () => {
    video.play().catch(() => {
      console.log("Autoplay blocked");
    });
  });

});