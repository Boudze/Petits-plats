export const initializeDropdowns = (recipes, dropdownSelectors) => {
  const { dropdownIngredients, dropdownAppliances, dropdownUstensils } =
    dropdownSelectors;

  const populateDropdown = (dropdown, items) => {
    const itemsArray = Array.from(items);
    dropdown.innerHTML = `
      <form class="px-4 py-3">
        <div class="input-group">
          <input type="search" class="form-control" placeholder="Recherche...">
          <button class="btn btn-primary" type="submit">
            <i class="bi bi-search"></i>
          </button>
          <button class="btn btn-secondary d-none clear-btn" type="button">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </form>
      ${itemsArray
        .map((item) => `<li class="dropdown-item">${item}</li>`)
        .join("")}
    `;

    const form = dropdown.querySelector("form");
    const input = form.querySelector("input");
    const clearButton = form.querySelector(".clear-btn");
    const listItems = dropdown.querySelectorAll(".dropdown-item");

    const filterItems = () => {
      const searchTerm = input.value.toLowerCase();
      listItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const isMatch = text.includes(searchTerm);
        item.style.display = isMatch ? "" : "none";
      });

      clearButton.classList.toggle("d-none", searchTerm === "");
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      filterItems();
    });

    input.addEventListener("input", filterItems);

    clearButton.addEventListener("click", () => {
      input.value = "";
      filterItems();
      updateDropdowns(recipes);
    });
  };

  const updateDropdowns = (recipesToUpdate) => {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    recipesToUpdate.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) =>
        ingredients.add(ingredient.ingredient)
      );
      appliances.add(recipe.appliance);
      recipe.ustensils.forEach((ustensil) => ustensils.add(ustensil));
    });

    populateDropdown(dropdownIngredients, ingredients);
    populateDropdown(dropdownAppliances, appliances);
    populateDropdown(dropdownUstensils, ustensils);
  };

  return { updateDropdowns };
};
