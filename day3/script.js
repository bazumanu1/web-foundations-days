let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

const CATEGORIES = ["personal", "work", "study"];

// Keep notes whose lower-case text contains the lower-case search word.
function searchNotes(word) {
  const searchTerm = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(searchTerm));
}

// Start with the first note as the longest so far, then compare each note.
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// Start every category at zero, then add one for each matching note.
function countByCategory() {
  const counts = { personal: 0, work: 0, study: 0 };
  for (const note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

// Build a readable sentence from the category counts.
function getSummary() {
  const counts = countByCategory();
  const noteWord = notes.length === 1 ? "note" : "notes";
  return `${notes.length} ${noteWord}: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}

// Return true when any existing note has the same trimmed, lower-case text.
function isDuplicate(text) {
  const normalizedText = text.trim().toLowerCase();
  return notes.some((note) => note.text.trim().toLowerCase() === normalizedText);
}

// Check each rule in order and stop at the first one that fails.
function addNote(text, category) {
  const trimmedText = text.trim();
  if (trimmedText.length < 1 || trimmedText.length > 200) {
    console.log("Rejected: a note must be 1-200 characters.");
    return false;
  }
  if (isDuplicate(trimmedText)) {
    console.log(`Rejected: "${trimmedText}" already exists.`);
    return false;
  }
  if (!CATEGORIES.includes(category)) {
    console.log(`Rejected: "${category}" is not a valid category.`);
    return false;
  }

  const nextId = Math.max(0, ...notes.map((note) => note.id)) + 1;
  notes.push({ id: nextId, text: trimmedText, category });
  console.log(`Added: "${trimmedText}" (${category})`);
  return true;
}

console.log(searchNotes("revise")); // Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]
console.log(searchNotes("BREAD")); // Expected: [{ id: 1, text: "Buy milk and bread", category: "personal" }]
console.log(searchNotes("holiday")); // Expected: []
console.log(longestNote().text); // Expected: "Email the project report to Grace"
console.log(countByCategory()); // Expected: { personal: 2, work: 1, study: 2 }
const savedNotes = notes;
notes = [];
console.log(longestNote()); // Expected: null (empty array)
console.log(countByCategory()); // Expected: { personal: 0, work: 0, study: 0 } (empty array)
notes = savedNotes;
console.log(getSummary()); // Expected: "5 notes: 2 personal, 1 work, 2 study."
notes = [];
console.log(getSummary()); // Expected: "0 notes: 0 personal, 0 work, 0 study."
notes = savedNotes;
console.log(isDuplicate("  call MUM ")); // Expected: true
console.log(isDuplicate("Call dad")); // Expected: false
console.log(addNote("Read chapter 4", "study")); // Expected: Added message, then true
console.log(addNote("call mum", "personal")); // Expected: duplicate rejection message, then false
console.log(addNote("   ", "work")); // Expected: length rejection message, then false
console.log(addNote("Plan trip", "holiday")); // Expected: category rejection message, then false
console.log(getSummary()); // Expected: "6 notes: 2 personal, 1 work, 3 study."