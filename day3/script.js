let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  const searchTerm = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(searchTerm));
}

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

function countByCategory() {
  const counts = { personal: 0, work: 0, study: 0 };
  for (const note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

function getSummary() {
  const counts = countByCategory();
  const noteWord = notes.length === 1 ? "note" : "notes";
  return `${notes.length} ${noteWord}: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}

function isDuplicate(text) {
  const normalizedText = text.trim().toLowerCase();
  return notes.some((note) => note.text.trim().toLowerCase() === normalizedText);
}

function addNote(text, category) {
  const trimmedText = text.trim();
  if (trimmedText.length < 1 || trimmedText.length > 200) {
    console.log("Note not added: text must be 1-200 characters.");
    return false;
  }
  if (isDuplicate(trimmedText)) {
    console.log("Note not added: a note with that text already exists.");
    return false;
  }
  if (!["personal", "work", "study"].includes(category)) {
    console.log("Note not added: category must be personal, work, or study.");
    return false;
  }

  const nextId = Math.max(0, ...notes.map((note) => note.id)) + 1;
  notes.push({ id: nextId, text: trimmedText, category });
  return true;
}

console.log(searchNotes("DAY 3")); // Expected: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }]
console.log(searchNotes("no matching note")); // Expected: []
console.log(longestNote()); // Expected: { id: 3, text: "Email the project report to Grace", category: "work" }
console.log(countByCategory()); // Expected: { personal: 2, work: 1, study: 2 }
const savedNotes = notes;
notes = [];
console.log(longestNote()); // Expected: null
console.log(countByCategory()); // Expected: { personal: 0, work: 0, study: 0 }
notes = savedNotes;
console.log(getSummary()); // Expected: "5 notes: 2 personal, 1 work, 2 study."
notes = [];
console.log(getSummary()); // Expected: "0 notes: 0 personal, 0 work, 0 study."
notes = savedNotes;
console.log(isDuplicate("  BUY milk AND bread  ")); // Expected: true
console.log(isDuplicate("Plan weekend hike")); // Expected: false
console.log(addNote("Plan weekend hike", "personal")); // Expected: true
console.log(addNote(" plan WEEKEND hike ", "personal")); // Expected: false, with duplicate reason logged
console.log(addNote("   ", "work")); // Expected: false, with length reason logged
console.log(addNote("Practice guitar", "hobby")); // Expected: false, with category reason logged