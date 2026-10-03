const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let users = [];

function renderUsers(userList) {
  usersList.replaceChildren();

  if (userList.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No users match your filter.";
    usersList.appendChild(emptyMessage);
    return;
  }

  userList.forEach((user) => {
    const item = document.createElement("li");
    const name = document.createElement("h2");
    const email = document.createElement("p");
    const city = document.createElement("p");
    const company = document.createElement("p");

    name.textContent = user.name;
    email.textContent = `Email: ${user.email}`;
    city.textContent = `City: ${user.address.city}`;
    company.textContent = `Company: ${user.company.name}`;

    item.appendChild(name);
    item.appendChild(email);
    item.appendChild(city);
    item.appendChild(company);
    usersList.appendChild(item);
  });
}

async function loadUsers() {
  statusText.textContent = "Loading users...";
  loadButton.disabled = true;
  usersList.replaceChildren();

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Status ${response.status}`);

    users = await response.json();
    renderUsers(users);
    statusText.textContent = `Loaded ${users.length} users.`;
  } catch (error) {
    statusText.textContent = "Could not load users. Please try again.";
    console.error(error);
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const query = filterInput.value.trim().toLowerCase();
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query),
  );
  renderUsers(filteredUsers);
});