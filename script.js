// North Star Bakery - script.js
// Feature: customers can save favorite items on the Products page
// Validation: checks the pre-order form on the Contact page
// Storage: favorites are saved in localStorage so they are remembered

// ---------- Data ----------

// Array of the items the customer has saved as favorites
let favorites = [];

// Array of the form fields that cannot be left empty
const requiredFields = ["name", "email", "pickup-date", "item-details"];

// Array of the radio button ids for the request type
const requestTypes = ["preorder", "cake", "question"];

// Object that holds the error message for each problem
const errorMessages = {
  "name": "Please enter your full name.",
  "email": "Please enter your email address.",
  "pickup-date": "Please choose a pickup date.",
  "item-details": "Please tell us what you would like to order.",
  "emailFormat": "Please enter a valid email, like you@example.com.",
  "itemLength": "Please add a little more detail (at least 10 characters).",
  "phoneFormat": "Please use the format 555-555-0123.",
  "requestType": "Please choose a request type."
};


// ---------- localStorage ----------

// Loads saved favorites from localStorage
function loadFavorites() {
  const saved = localStorage.getItem("favorites");
  if (saved) {
    favorites = JSON.parse(saved);
  }
}

// Saves the favorites array to localStorage
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}


// ---------- Favorites feature (Products page) ----------

// Adds an item to favorites, or removes it if it is already saved
function toggleFavorite(item) {
  const index = favorites.indexOf(item);

  if (index === -1) {
    favorites.push(item);
  } else {
    favorites.splice(index, 1);
  }

  saveFavorites();
  showFavorites();
  updateButtons();
}

// Shows the favorites list on the page
function showFavorites() {
  const list = document.getElementById("favorites-list");
  const emptyMessage = document.getElementById("favorites-empty");

  list.innerHTML = "";

  for (let i = 0; i < favorites.length; i++) {
    const listItem = document.createElement("li");
    listItem.textContent = favorites[i];
    list.appendChild(listItem);
  }

  if (favorites.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

// Changes each button to show if the item is saved or not
function updateButtons() {
  const buttons = document.querySelectorAll(".fav-btn");

  for (let i = 0; i < buttons.length; i++) {
    const item = buttons[i].dataset.item;

    if (favorites.includes(item)) {
      buttons[i].textContent = "★ Saved";
    } else {
      buttons[i].textContent = "☆ Favorite";
    }
  }
}

// Removes all favorites
function clearFavorites() {
  favorites = [];
  saveFavorites();
  showFavorites();
  updateButtons();
}

// Sets up the favorites feature when the Products page opens
function setupFavorites() {
  const list = document.getElementById("favorites-list");

  // stop here if we are not on the Products page
  if (!list) {
    return;
  }

  loadFavorites();
  showFavorites();
  updateButtons();

  const buttons = document.querySelectorAll(".fav-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      toggleFavorite(buttons[i].dataset.item);
    });
  }

  document.getElementById("clear-favorites").addEventListener("click", clearFavorites);
}


// ---------- Form validation (Contact page) ----------

// Shows an error message under a field (an empty message hides it)
function showError(fieldId, message) {
  document.getElementById(fieldId + "-error").textContent = message;
}

// Clears all the error messages
function clearErrors() {
  for (let i = 0; i < requiredFields.length; i++) {
    showError(requiredFields[i], "");
  }
  showError("phone", "");
  showError("request-type", "");
}

// Checks the form and returns true if everything is correct
function validateForm() {
  let isValid = true;
  clearErrors();

  // Check 1: required fields are not empty
  for (let i = 0; i < requiredFields.length; i++) {
    const field = document.getElementById(requiredFields[i]);
    if (field.value.trim() === "") {
      showError(requiredFields[i], errorMessages[requiredFields[i]]);
      isValid = false;
    }
  }

  // Check 2: email format
  const email = document.getElementById("email").value.trim();
  if (email !== "" && (!email.includes("@") || !email.includes("."))) {
    showError("email", errorMessages.emailFormat);
    isValid = false;
  }

  // Check 3: item details must be at least 10 characters
  const details = document.getElementById("item-details").value.trim();
  if (details !== "" && details.length < 10) {
    showError("item-details", errorMessages.itemLength);
    isValid = false;
  }

  // Check 4: phone is optional, but must match the pattern if filled in
  const phone = document.getElementById("phone").value.trim();
  const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
  if (phone !== "" && !phonePattern.test(phone)) {
    showError("phone", errorMessages.phoneFormat);
    isValid = false;
  }

  // Check 5: one request type must be chosen
  let typeChosen = false;
  for (let i = 0; i < requestTypes.length; i++) {
    if (document.getElementById(requestTypes[i]).checked) {
      typeChosen = true;
    }
  }
  if (!typeChosen) {
    showError("request-type", errorMessages.requestType);
    isValid = false;
  }

  return isValid;
}

// Fills in the Item details box with the customer's saved favorites
function prefillOrder() {
  loadFavorites();
  const detailsBox = document.getElementById("item-details");

  if (favorites.length > 0 && detailsBox.value === "") {
    detailsBox.value = "My favorites: " + favorites.join(", ");
  }
}

// Sets up the form when the Contact page opens
function setupForm() {
  const form = document.getElementById("order-form");

  // stop here if we are not on the Contact page
  if (!form) {
    return;
  }

  prefillOrder();

  form.addEventListener("submit", function (event) {
    // the form has no server yet, so we always stop the page from reloading
    event.preventDefault();
    const message = document.getElementById("form-message");

    if (validateForm()) {
      message.textContent = "Thank you! We got your request and will reply within one business day.";
      form.reset();
    } else {
      message.textContent = "";
    }
  });

  // hide a field's error as soon as the user starts fixing it
  for (let i = 0; i < requiredFields.length; i++) {
    const fieldId = requiredFields[i];
    document.getElementById(fieldId).addEventListener("input", function () {
      showError(fieldId, "");
    });
  }
}


// ---------- Start ----------
setupFavorites();
setupForm();