const arrow = document.querySelector(".arrow");
const speed = document.querySelector(".speed-value");
const units = document.querySelector(".units");
const toggleUnitsButton = document.querySelector("#toggleUnits");
const pauseResumeButton = document.querySelector("#pauseResume");
const accuracy = document.querySelector("#accuracy");
const fallback = document.querySelector("#fallback");
let watchId = null;
let isPaused = false;
let isKmh = true;

function startGeolocation() {
  try {
    if (!navigator.geolocation) {
      throw new Error("Geolocation not supported in this browser.");
    }
    watchId = navigator.geolocation.watchPosition(
      (data) => {
        try {
          const heading = data.coords.heading;
          const speedMs = data.coords.speed;
          const headingAccuracy = data.coords.heading_accuracy;

          // Update heading
          if (heading !== null && !isNaN(heading)) {
            arrow.style.transform = `rotate(${heading}deg)`;
            fallback.style.display = "none";
          } else {
            arrow.style.transform = "rotate(0deg)";
            fallback.style.display = "block";
          }

          // Update speed
          if (speedMs !== null && !isNaN(speedMs)) {
            const speedValue = isKmh
              ? (speedMs * 3.6).toFixed(2) // m/s to km/h
              : (speedMs * 2.23694).toFixed(2); // m/s to mph
            speed.textContent = speedValue;
            units.textContent = isKmh ? "KM/H" : "MPH";
            fallback.style.display = "none";
          } else {
            speed.textContent = "0";
            units.textContent = isKmh ? "KM/H" : "MPH";
            fallback.style.display = "block";
          }

          // Update accuracy
          if (headingAccuracy !== null && !isNaN(headingAccuracy)) {
            accuracy.textContent = `Accuracy: ±${headingAccuracy.toFixed(1)}°`;
          } else {
            accuracy.textContent = "Accuracy: Unknown";
          }
        } catch (error) {
          console.error("Error processing geolocation data:", error);
          fallback.style.display = "block";
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Please allow location services to use the compass.");
        fallback.style.display = "block";
      },
      { enableHighAccuracy: true }
    );
  } catch (error) {
    console.error("Error initializing geolocation:", error);
    words.innerHTML = "<p>Geolocation not supported in this browser.</p>";
    toggleUnitsButton.disabled = true;
    pauseResumeButton.disabled = true;
    fallback.style.display = "block";
  }
}

function pauseGeolocation() {
  try {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      isPaused = true;
      pauseResumeButton.textContent = "Resume";
      pauseResumeButton.setAttribute(
        "aria-label",
        "Resume geolocation updates"
      );
      fallback.style.display = "block";
    }
  } catch (error) {
    console.error("Error pausing geolocation:", error);
  }
}

function resumeGeolocation() {
  try {
    startGeolocation();
    isPaused = false;
    pauseResumeButton.textContent = "Pause";
    pauseResumeButton.setAttribute("aria-label", "Pause geolocation updates");
  } catch (error) {
    console.error("Error resuming geolocation:", error);
  }
}

function toggleUnits() {
  try {
    isKmh = !isKmh;
    toggleUnitsButton.textContent = isKmh ? "KM/H" : "MPH";
    toggleUnitsButton.setAttribute(
      "aria-label",
      `Toggle speed units to ${isKmh ? "MPH" : "KM/H"}`
    );
    // Trigger an update by re-processing the last data (if available)
    if (watchId !== null) {
      navigator.geolocation.getCurrentPosition(
        (data) => {
          const speedMs = data.coords.speed;
          if (speedMs !== null && !isNaN(speedMs)) {
            const speedValue = isKmh
              ? (speedMs * 3.6).toFixed(2)
              : (speedMs * 2.23694).toFixed(2);
            speed.textContent = speedValue;
            units.textContent = isKmh ? "KM/H" : "MPH";
          }
        },
        (err) => {
          console.error("Error updating units:", err);
        }
      );
    }
  } catch (error) {
    console.error("Error toggling units:", error);
  }
}

function pauseResumeGeolocation() {
  try {
    if (isPaused) {
      resumeGeolocation();
    } else {
      pauseGeolocation();
    }
  } catch (error) {
    console.error("Error toggling pause/resume:", error);
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
  startGeolocation();
  toggleUnitsButton.addEventListener("click", debounce(toggleUnits));
  pauseResumeButton.addEventListener("click", pauseResumeGeolocation);
} catch (error) {
  console.error("Error setting up event listeners:", error);
  fallback.style.display = "block";
}
