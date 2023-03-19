import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-1dacb-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(shoppingListInDB, inputValue);

  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {

  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
  
    clearShoppingListEl();
  
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i]
      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet"
    shoppingListEl.style.margin = "0 auto"    
    shoppingListEl.style.marginTop = "20px"  
    shoppingListEl.style.color = "#b0b0b0"
  }

});

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0]
  let itemValue = item[1]
  let newEl = document.createElement("li")
  newEl.textContent = itemValue
  shoppingListEl.append(newEl)

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
    remove(exactLocationOfItemInDB)
  })
}
