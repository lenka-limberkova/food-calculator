// ===============================
// VYBRANI ELEMENTU Z HTML
// ===============================

// Formular pro vyhledavani potravin
const searchForm = document.querySelector(".search-form");

// Input, do ktereho uzivatel pise hledany vyraz
const searchInput = document.querySelector("input");

// Kontejner, do ktereho se vykresluji vysledky hledani
const searchResults = document.querySelector(".search-results");

// Kontejner, do ktereho se vykresluji vybrane potraviny
const selectedFoodsContainer = document.querySelector(".selected-foods");

// Empty state, ktery se zobrazuje, kdyz neni vybrana zadna potravina
const emptyState = document.querySelector(".empty-state");

// Kontejner pro celkove soucty kalorii a maker
const totalsContainer = document.querySelector(".totals");

// Tlacitko pro odstraneni vsech vybranych potravin najednou
const resetButton = document.querySelector(".reset-button");

// H1 nadpis
const appLogo = document.querySelector(".app-logo");

// Kliknuti na logo vrati aplikaci do vychoziho stavu.
appLogo.addEventListener("click", () => {

  // Vyprazdni vybrane potraviny.
  selectedFoods.length = 0;

  // Smaze vysledky hledani.
  searchResults.innerHTML = "";

  // Vyprazdni search input.
  document.querySelector(".search-form input").value = "";

  // Znovu vykresli prazdny stav aplikace.
  renderSelectedFoods();
});


// ===============================
// STAV APLIKACE
// ===============================

// Objekt, do ktereho se uklada aktualni hledany text
const filters = {
  searchText: ""
};

// Pole, do ktereho se ukladaji potraviny pridane uzivatelem
const selectedFoods = [];


// ===============================
// VYHLEDAVANI POTRAVIN
// ===============================

// Po odeslani formulare:
// 1. zabrani obnoveni stranky
// 2. vezme text ze search inputu
// 3. zavola nas backend
// 4. backend ziska data z FoodData Central API
// 5. vysledky se vykresli jako food cards
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Ulozi aktualni hledany text
  filters.searchText = searchInput.value;

  // Odstrani mezery na zacatku a na konci hledaneho textu.
filters.searchText = filters.searchText.trim();

// Pokud je input prazdny,
// ukonci funkci a neposila zbytecny request na backend.
if (filters.searchText === "") {
  return;
}

  // Pred novym vyhledavanim smaze predchozi vysledky
  searchResults.innerHTML = "";

  // Behem cekani na odpoved z backendu
// zobrazi uzivateli informaci, ze se data nacitaji.
searchResults.innerHTML = `
  <p>Loading...</p>
`;

 // Pokusi se zavolat backend a nacist data.
// Pokud se cokoli nepovede, kod prejde do catch bloku.
try {

  // Posle hledany vyraz nasemu backendu.
  const response = await fetch(
  `/api/foods?query=${encodeURIComponent(filters.searchText)}`
);

  // fetch sam o sobe nepovazuje napr. HTTP 500 za JavaScriptovou chybu.
  // Proto kontrolujeme response.ok rucne.
  // Pokud backend vrati chybovy HTTP status, vytvorime chybu.
  if (!response.ok) {
    throw new Error("Failed to load foods.");
  }

  // Prevede JSON odpoved z backendu
  // na JavaScriptova data.
  const data = await response.json();

  // Data uz dorazila, proto odstranime text "Loading...".
  searchResults.innerHTML = "";

  // Pokud backend vratil prazdne pole,
  // znamena to, ze nebyly nalezeny zadne potraviny.
  if (data.length === 0) {
    searchResults.innerHTML = `
      <p>No results found.</p>
    `;

    // Ukonci dalsi zpracovani,
    // protoze nemame zadne vysledky k vykresleni.
    return;
  }

  // Projde vsechny potraviny, ktere vratil backend,
  // a pro kazdou vytvori samostatnou search result kartu.
  data.forEach((food) => {

    // Vytvori novy div pro jednu potravinu.
    const foodCard = document.createElement("div");

    // Prida karte CSS tridu food-card.
    foodCard.classList.add("food-card");

    // Ulozi ID potraviny primo do HTML karty.
    // Pozdeji diky tomu dokazeme propojit search result
    // s potravinou v selectedFoods.
    foodCard.dataset.foodId = food.id;

    // Zkontroluje, jestli uz je tato potravina
    // mezi vybranymi potravinami.
    const alreadySelected = selectedFoods.some(
      (selectedFood) => selectedFood.id === food.id
    );

    // Vykresli obsah search result karty.
    // Pokud uz je potravina vybrana:
    // - tlacitko zobrazi "Added"
    // - tlacitko bude disabled
    //
    // Jinak se zobrazi aktivni tlacitko "Add".
    foodCard.innerHTML = `
  <div class="food-card-content">

    <h3 class="food-card-title">
      ${food.name}
    </h3>

    <p class="food-card-calories">
      ${food.calories} kcal / 100 g
    </p>

    <p class="food-card-macros">
      Protein ${food.protein} g ·
      Carbs ${food.carbs} g ·
      Fat ${food.fat} g
    </p>

  </div>

  <button
    type="button"
    class="add-button"
    ${alreadySelected ? "disabled" : ""}
  >
    ${alreadySelected ? "Added" : "Add"}
  </button>
`;

    // Najde Add / Added tlacitko uvnitr teto konkretni karty.
    const addButton = foodCard.querySelector("button");

    // Reaguje na kliknuti na Add.
    addButton.addEventListener("click", () => {

      // Znovu overi, jestli uz potravina neni v selectedFoods.
      // Tim branime pridani stejne potraviny vicekrat.
      const alreadySelected = selectedFoods.some(
        (selectedFood) => selectedFood.id === food.id
      );

      // Pokud uz je vybrana, nic dalsiho se neprovede.
      if (alreadySelected) {
        return;
      }

      // Prida potravinu do selectedFoods.
      // Pomoci ...food zkopiruje jeji data
      // a prida defaultni mnozstvi 100 g.
      selectedFoods.push({
        ...food,
        quantity: 100
      });

      // Znovu vykresli pravou cast aplikace
      // podle aktualniho selectedFoods.
      renderSelectedFoods();

      // Zmeni tlacitko z "Add" na "Added".
      addButton.textContent = "Added";

      // Tlacitko deaktivuje.
      addButton.disabled = true;
    });

    // Hotovou kartu vlozi do search results.
    searchResults.appendChild(foodCard);
  });

} catch (error) {

  // Pokud selze backend, API nebo jina cast requestu,
  // misto vysledku zobrazi uzivateli srozumitelnou chybu.
  searchResults.innerHTML = `
    <p>Something went wrong. Please try again.</p>
  `;

  // Technickou informaci o chybe vypise do konzole.
  // Uzivatel ji nevidi, ale nam pomaha pri vyvoji a debugovani.
  console.error(error);
}
});


// ===============================
// VYKRESLENI VYBRANYCH POTRAVIN
// ===============================

function renderSelectedFoods() {

  // ===============================
  // EMPTY STATE + RESET
  // ===============================

  // Pokud neni vybrana zadna potravina,
  // zobrazi empty state a schova Reset.
  if (selectedFoods.length === 0) {
    emptyState.style.display = "flex";
    resetButton.style.display = "none";
  } else {
    // Pokud je vybrana alespon jedna potravina,
    // empty state se schova a Reset se zobrazi.
    emptyState.style.display = "none";
    resetButton.style.display = "block";
  }


  // Pred novym vykreslenim smaze stary obsah.
  selectedFoodsContainer.innerHTML = "";


  // ===============================
  // TOTALS
  // ===============================

  // Promenne pro celkove soucty.
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;


  // ===============================
  // SELECTED FOOD CARDS
  // ===============================

  selectedFoods.forEach((food) => {

    // Vytvori novou kartu.
    const selectedCard = document.createElement("div");

    // Prida CSS tridu pro stylovani.
    selectedCard.classList.add("selected-food-card");


    // ===============================
    // VYPOCET PODLE MNOZSTVI
    // ===============================

    // Data z API jsou uvedena na 100 g.
    // Proto se prepocitaji podle aktualniho quantity.
    const calculatedCalories =
      food.calories * food.quantity / 100;

    const calculatedProtein =
      food.protein * food.quantity / 100;

    const calculatedCarbs =
      food.carbs * food.quantity / 100;

    const calculatedFat =
      food.fat * food.quantity / 100;


    // Pricte hodnoty teto potraviny do celkovych souctu.
    totalCalories += calculatedCalories;
    totalProtein += calculatedProtein;
    totalCarbs += calculatedCarbs;
    totalFat += calculatedFat;


    // ===============================
    // HTML KARTY
    // ===============================

    selectedCard.innerHTML = `

      <div class="selected-food-header">

        <h3>${food.name}</h3>

        <button
          type="button"
          class="remove-button"
          aria-label="Remove ${food.name}"
        >
          <img src="/assets/icons/trash.svg" alt="">
        </button>

      </div>


      <div class="quantity-section">

        <p class="quantity-label">
          Quantity
        </p>

        <div class="quantity-row">

          <div class="quantity-stepper">

            <button
              type="button"
              class="quantity-button quantity-minus"
              aria-label="Decrease quantity"
            >
              −
            </button>

            <input
              type="number"
              class="quantity-input"
              value="${food.quantity}"
              min="1"
              step="1"
              aria-label="Quantity in grams"
            >

            <button
              type="button"
              class="quantity-button quantity-plus"
              aria-label="Increase quantity"
            >
              +
            </button>

          </div>

          <span class="quantity-unit">
            g
          </span>

        </div>

      </div>


      <div class="selected-food-nutrition">

        <p class="selected-food-calories">
          ${calculatedCalories.toFixed(1)} kcal
        </p>

        <p class="selected-food-macros">
          Protein ${calculatedProtein.toFixed(1)} g ·
          Carbs ${calculatedCarbs.toFixed(1)} g ·
          Fat ${calculatedFat.toFixed(1)} g
        </p>

      </div>
    `;


    // ===============================
    // NALEZENI OVLADACICH PRVKU
    // ===============================

    const quantityInput =
      selectedCard.querySelector(".quantity-input");

    const minusButton =
      selectedCard.querySelector(".quantity-minus");

    const plusButton =
      selectedCard.querySelector(".quantity-plus");

    const removeButton =
      selectedCard.querySelector(".remove-button");


    // ===============================
    // MANUALNI ZMENA INPUTU
    // ===============================

    quantityInput.addEventListener("change", () => {

      // Prevede hodnotu inputu na cislo.
      let newQuantity = Number(quantityInput.value);

      // Pokud je hodnota neplatna nebo mensi nez 10,
      // nastavi minimalni mnozstvi 10 g.
      if (!newQuantity || newQuantity < 1) {
        newQuantity = 1;
      }

      // Ulozi novou hodnotu.
      food.quantity = newQuantity;

      // Znovu vykresli karty a totals.
      renderSelectedFoods();
    });


    // ===============================
    // MINUS 10 G
    // ===============================

    minusButton.addEventListener("click", () => {

      // Snizi quantity o 10 g,
      // ale nikdy nepovoli mene nez 10 g.
      food.quantity = Math.max(1, food.quantity - 1);

      renderSelectedFoods();
    });


    // ===============================
    // PLUS 10 G
    // ===============================

    plusButton.addEventListener("click", () => {

      // Zvysi quantity o 10 g.
      food.quantity += 1;

      renderSelectedFoods();
    });


    // ===============================
    // ODSTRANENI POTRAVINY
    // ===============================

    removeButton.addEventListener("click", () => {

      // Najde index potraviny v selectedFoods.
      const foodIndex = selectedFoods.findIndex(
        (selectedFood) => selectedFood.id === food.id
      );

      // Pokud byla potravina nalezena,
      // odstrani ji z pole.
      if (foodIndex !== -1) {
        selectedFoods.splice(foodIndex, 1);
      }

      // Aktualizuje pravou cast aplikace.
      renderSelectedFoods();


      // Najde odpovidajici kartu ve vysledcich hledani.
      const matchingFoodCard = searchResults.querySelector(
        `[data-food-id="${food.id}"]`
      );

      // Pokud je karta stale zobrazena,
      // vrati tlacitko do stavu Add.
      if (matchingFoodCard) {
        const matchingAddButton =
          matchingFoodCard.querySelector("button");

        matchingAddButton.textContent = "Add";
        matchingAddButton.disabled = false;
      }
    });


    // Vlozi hotovou kartu do selected foods.
    selectedFoodsContainer.appendChild(selectedCard);
  });


  // ===============================
  // VYKRESLENI TOTALS
  // ===============================

  if (selectedFoods.length > 0) {

    totalsContainer.innerHTML = `

      <h3 class="totals-title">
        Total
      </h3>

      <div class="total-calories">
        ${totalCalories.toFixed(1)} kcal
      </div>

      <div class="total-macros">

        <div class="total-macro-card">

          <strong>
            ${totalProtein.toFixed(1)} g
          </strong>

          <span>
            Protein
          </span>

        </div>


        <div class="total-macro-card">

          <strong>
            ${totalCarbs.toFixed(1)} g
          </strong>

          <span>
            Carbs
          </span>

        </div>


        <div class="total-macro-card">

          <strong>
            ${totalFat.toFixed(1)} g
          </strong>

          <span>
            Fat
          </span>

        </div>

      </div>
    `;

  } else {

    // Pokud neni nic vybrane,
    // totals zustanou prazdne.
    totalsContainer.innerHTML = "";
  }
}

// ===============================
// RESET VYBRANYCH POTRAVIN
// ===============================

// Po kliknuti na Reset odstrani vsechny potraviny
// z pole selectedFoods.
resetButton.addEventListener("click", () => {

  // splice(0) odstrani vsechny polozky z pole
  // od indexu 0 az do konce.
  selectedFoods.splice(0);

  // Znovu vykresli selected foods podle prazdneho pole.
  // Tim zmizi vsechny karty, totals se prepocitaji na 0
  // a znovu se zobrazi empty state.
  renderSelectedFoods();

  // Najde vsechny food cards ve vysledcich vyhledavani.
const foodCards = searchResults.querySelectorAll(".food-card");

// Projde vsechny karty a vrati jejich tlacitka
// zpet do aktivniho stavu "Add".
foodCards.forEach((foodCard) => {
  const addButton = foodCard.querySelector("button");

  addButton.textContent = "Add";
  addButton.disabled = false;
});
});

// Pri prvnim nacteni stranky vykresli selection panel
// podle pocatecniho stavu aplikace.
// selectedFoods je na zacatku prazdne pole,
// proto se zobrazi empty state a schova Reset.
renderSelectedFoods();

