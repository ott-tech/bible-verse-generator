const verseHead = document.getElementById("verseHead");
const verseDisplay = document.getElementById("verseDisplay");
const generateVerseBtn = document.getElementById("generate-verse");
const intervalInput = document.getElementById("interval");
const startAutoBtn = document.getElementById("start-auto");
const stopAutoBtn = document.getElementById("stop-auto");
const copyVerseBtn = document.getElementById("copy-verse");

// === NEW DOM refs for favourites ===
const saveVerseBtn = document.getElementById("save-verse");

let autoChangeInterval; // Default 3 seconds

const LS_FAVOURITES_KEY = "bibleVerseFavourites";

const getBibleVerse = async () => {
    try {
        verseHead.textContent = "Loading Verse...";
        verseHead.classList.add("loading");
    const query = verseDisplay.value.trim() || "random"
    const response = await axios.get(`https://labs.bible.org/api/?passage=${encodeURIComponent(query)}&type=json`);

    const verse = response.data[0];
    const verseText = `${verse.bookname} ${verse.chapter}:${verse.verse} — "${verse.text}"`;

     // show verse
    verseHead.classList.remove("loading");
    verseHead.textContent = verseText;

    // Apply fade-in effect

    verseHead.classList.add("fade-in");
        setTimeout(() => {
            verseHead.classList.remove("fade-in")
        }, 1000);

    } catch (error) {
        verseHead.classList.remove("loading");
        console.error("Error fetching Bible verse:", error);
        verseHead.textContent = "Verse not found. Please check your input and try again.";
    }
};

generateVerseBtn.addEventListener("click", getBibleVerse);

//When user presses Enter key//
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getBibleVerse();
    }
});

// Auto Change feature//
startAutoBtn.addEventListener("click", () => {
    const seconds = parseInt(intervalInput.value, 10);
    if (!seconds || seconds < 3) {
        showToast("Please enter a valid number (minimum 3 seconds)");
        return;
    }

    autoChangeInterval = setInterval(getBibleVerse, seconds * 1000);
    verseHead.textContent = `Auto mode started (every ${seconds} seconds..)`;
});

stopAutoBtn.addEventListener("click", () => {
    clearInterval(autoChangeInterval);
    verseHead.textContent = "Auto Mode stopped."
});

//Save verse to Favourites// 
saveVerseBtn.addEventListener("click", () => {
    const verseText = verseHead.textContent;
    if (!verseText || verseText === "Loading Verse...") {
        showToast("No verse to save. Please generate a verse first.");
        return;
    }

    let saved = JSON.parse(localStorage.getItem(LS_FAVOURITES_KEY)) || [];
    if (!saved.includes(verseText)) { // prevent duplicates
        saved.push(verseText); // add the new one
        localStorage.setItem(LS_FAVOURITES_KEY, JSON.stringify(saved));
        showToast("Verse saved to favourites!");
    }
        else {
            showToast("This verse is already saved");
        }
});

// === Copy Verse to Clipboard ===
copyVerseBtn.addEventListener("click", async () => {
    const verseText = verseHead.textContent.trim();

    if(!verseText || verseText === "Loading Verse...") {
        showToast("⚠️ No verse to copy. Please generate one first.", "error");
        return;
    }
    try {
        await navigator.clipboard.writeText(verseText);
        showToast("✅ Verse copied to clipboard!");
    } catch(error) {
        console.error("Failed to Copy Verse", error);
        showToast("❌ Failed to copy verse. Please try again.", "error");
    }
});

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.style.backgroundColor = type === "error" ? "#f44336" : "#4CAF50"; // red or green
    toast.classList.add("show");

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Initialize all tooltips
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");

  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center text-bg-${type === "error" ? "danger" : "success"} border-0 mb-2`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl);
  toast.show();

  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

