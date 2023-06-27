import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"; // importujeme si funkciu initializeApp z firebase
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"; // importujeme si funkciu getDatabase z firebase
const appSettings = {
  databaseURL:
    "https://my-first-app-f18e6-default-rtdb.europe-west1.firebasedatabase.app/",
}; // nastavenia databázy - URL adresa našej databázy z firebase

const app = initializeApp(appSettings); // Initialize Firebase - zavolame funkiu initializeApp a ako parameter jej dáme našu databázu - prepojím si náš projekt s databázou
const database = getDatabase(app); // získame referenciu na databázu
const shoppingListInDB = ref(database, "shoppingList"); // získame referenciu na konkrétnu časť databázy - v našom prípade na /stuff

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(shoppingListInDB, inputValue);

  clearImputField();
});

onValue(shoppingListInDB, function (snapshot) {
  // pracujeme s databázou, Funkcia onValue z Firebase Realtime Database je použitá na monitorovanie zmeny hodnôt v databáze v reálnom čase.

  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val()); //vytvorí sa pole hodnôt z objektu, metóda val(), vráti dáta ako JavaScriptový objekt
    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      //let currentItemId = currentItem[0]; // z databazy získavame ID hodnotu (keys)
      //let currentItemValue = currentItem[1]; // z databázy získavame values
      appendNewItemsToLi(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "Nič si do mňa nehodil...";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}
const clearImputField = () => {
  inputFieldEl.value = "";
};
const appendNewItemsToLi = (item) => {
  let itemID = item[0];
  let itemValue = item[1];
  //shoppingListEl.innerHTML += `<li>${input}</li>`; // čokolvek napíšeme do inputu a klinkneme na tlačítko tak sa nám to pridá do našeho UL ako položky ktoré sa vypíšu na stránku
  let newEl = document.createElement("li"); // vytvoríme nový element LI
  newEl.textContent = itemValue; // toto bude vyzerať takto <li>SEM VLOŽÍME NÁŠ INPUT</li>
  shoppingListEl.append(newEl); // teraz náš LI aj s INPUTOM vložíme do parent elementu UL, ktorý má id shopping-list čo sme uložili do premennej

  newEl.addEventListener("click", function () {
    let exactLocationOfStoryInDB = ref(database, `shoppingList/${itemID}`); // získame presnú cestu do databázy k nášmu zoznamu prvkov shoppingList a potom použijeme itemID, ktorý nám hovorí na akom indexe sa nachádza daný prvok
    remove(exactLocationOfStoryInDB); // príkaz remove importovaný z firebase, ktorý po našom naprogramovaní odstraňuje položky po kliknutí na obrazovku
  });
};
