let fontSize = 16;
let animationsPaused = false;

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("togglePanel");
  const panel = document.getElementById("panel");

  if (toggle && panel) {
    toggle.onclick = (e) => {
      e.stopPropagation(); // 🔥 najważniejsze
      panel.hidden = !panel.hidden;
    };
  }
});

// funkcje
function zoomIn() {
  fontSize += 2;
  document.body.style.fontSize = fontSize + "px";
}

function zoomOut() {
  fontSize -= 2;
  document.body.style.fontSize = fontSize + "px";
}

function toggleContrast() {
  document.body.classList.toggle("high-contrast");
}

function toggleLinks() {
  document.body.classList.toggle("highlight-links");
}

function toggleSpacing() {
  document.body.classList.toggle("text-spacing");
}


function pauseAnimations() {
  animationsPaused = !animationsPaused;

  document.querySelectorAll("*").forEach(el => {
    el.style.animation = animationsPaused ? "none" : "";
    el.style.transition = animationsPaused ? "none" : "";
  });

  document.querySelectorAll("video").forEach(video => {
    if (animationsPaused) {
      video.pause();
    } else {
      video.play();
    }
  })
}

// ESC → zamknij
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    const panel = document.getElementById("panel");
    if (panel) panel.hidden = true;
  }
});