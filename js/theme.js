// === DARK/LIGHT MODE TOGGLE (Shared across all pages) ===

// Wait until the page has loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");

    // Get saved theme (if any)
    const savedTheme = localStorage.getItem("theme");

    // Apply saved theme
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggle) themeToggle.textContent = "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        if (themeToggle) themeToggle.textContent = "🌙 Dark Mode";
    }

    // Add click listener for toggle button
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                themeToggle.textContent = "☀️ Light Mode";
                localStorage.setItem("theme", "dark");
            } else {
                themeToggle.textContent = "🌙 Dark Mode";
                localStorage.setItem("theme", "light");
            }
        });
    }
});
