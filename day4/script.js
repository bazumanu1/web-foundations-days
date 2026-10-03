const noteText = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearButton = document.querySelector("#clear-btn");
const themeButton = document.querySelector("#theme-toggle");

const DRAFT_KEY = "quicknotes-day4-draft";
const THEME_KEY = "quicknotes-day4-theme";

function updateCounts() {
  const text = noteText.value;
  const characters = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  charCount.textContent = `${characters} / 200 characters`;
  wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;
  charCount.classList.toggle("warning", characters > 180);
  charCount.classList.toggle("over", characters > 200);
}

function clearDraft() {
  noteText.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
}

function setTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeButton.textContent = isDark ? "Light mode" : "Dark mode";
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}

noteText.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem(DRAFT_KEY, noteText.value);
});

clearButton.addEventListener("click", clearDraft);

noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearDraft();
  }
});

themeButton.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  setTheme(isDark);
});

noteText.value = localStorage.getItem(DRAFT_KEY) || "";
setTheme(localStorage.getItem(THEME_KEY) === "dark");
updateCounts();