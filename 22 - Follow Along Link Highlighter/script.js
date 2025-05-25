const triggers = document.querySelectorAll("a");
const highlight = document.createElement("span");
const toggleHighlightButton = document.querySelector("#toggleHighlight");
const toggleThemeButton = document.querySelector("#toggleTheme");
const linkCount = document.querySelector("#linkCount");
let isHighlightEnabled = true;
let highlightedLinks = new Set();
let isDarkTheme = false;

highlight.classList.add("highlight");
document.body.append(highlight);

function highlightLink() {
  try {
    const linkCoords = this.getBoundingClientRect();
    const coords = {
      width: linkCoords.width,
      height: linkCoords.height,
      top: linkCoords.top + window.scrollY,
      left: linkCoords.left + window.scrollX,
    };

    highlight.style.width = `${coords.width}px`;
    highlight.style.height = `${coords.height}px`;
    highlight.style.transform = `translate(${coords.left}px, ${coords.top}px)`;

    highlightedLinks.add(this.textContent);
    updateLinkCount();
  } catch (error) {
    console.error("Error highlighting link:", error);
  }
}

function enableHighlight() {
  try {
    triggers.forEach((a) => a.addEventListener("mouseenter", highlightLink));
    isHighlightEnabled = true;
    toggleHighlightButton.textContent = "Highlight On";
    toggleHighlightButton.setAttribute(
      "aria-label",
      "Toggle highlight effect off"
    );
    highlight.style.display = "block";
  } catch (error) {
    console.error("Error enabling highlight:", error);
  }
}

function disableHighlight() {
  try {
    triggers.forEach((a) => a.removeEventListener("mouseenter", highlightLink));
    isHighlightEnabled = false;
    toggleHighlightButton.textContent = "Highlight Off";
    toggleHighlightButton.setAttribute(
      "aria-label",
      "Toggle highlight effect on"
    );
    highlight.style.display = "none";
  } catch (error) {
    console.error("Error disabling highlight:", error);
  }
}

function toggleHighlight() {
  try {
    if (isHighlightEnabled) {
      disableHighlight();
    } else {
      enableHighlight();
    }
  } catch (error) {
    console.error("Error toggling highlight:", error);
  }
}

function toggleTheme() {
  try {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle("dark");
    toggleThemeButton.textContent = isDarkTheme ? "Purple Theme" : "Dark Theme";
    toggleThemeButton.setAttribute(
      "aria-label",
      `Toggle to ${isDarkTheme ? "purple" : "dark"} theme`
    );
  } catch (error) {
    console.error("Error toggling theme:", error);
  }
}

function updateLinkCount() {
  try {
    const count = highlightedLinks.size;
    linkCount.textContent = `${count} Link${
      count === 1 ? "" : "s"
    } Highlighted`;
  } catch (error) {
    console.error("Error updating link count:", error);
    linkCount.textContent = "Error";
  }
}

function debounce(func, wait = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

try {
  enableHighlight();
  toggleHighlightButton.addEventListener("click", toggleHighlight);
  toggleThemeButton.addEventListener("click", debounce(toggleTheme));

  // Handle window resize for accurate highlight positioning
  window.addEventListener("resize", () => {
    if (isHighlightEnabled && highlightedLinks.size > 0) {
      const lastLink = Array.from(triggers).find(
        (a) => a.textContent === Array.from(highlightedLinks).pop()
      );
      if (lastLink) {
        lastLink.dispatchEvent(new Event("mouseenter"));
      }
    }
  });
} catch (error) {
  console.error("Error initializing app:", error);
  linkCount.textContent = "Error initializing app.";
}
