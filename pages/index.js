import { getData } from "../api/Api.js";
import { recipeCardFactory } from "../components/RecipeCard.js";
import { initializeDropdowns } from "../utils/dropdowns.js";
import { addTag, tagState } from "../utils/tags.js";

const dropdownSelectors = {
  dropdownIngredients: document.querySelector(
    "#dropdownMenuButton1 + .dropdown-menu"
  ),
  dropdownAppliances: document.querySelector(
    "#dropdownMenuButton2 + .dropdown-menu"
  ),
  dropdownUstensils: document.querySelector(
    "#dropdownMenuButton3 + .dropdown-menu"
  ),
};

const resultsContainer = document.querySelector(".card_section");
const tagContainer = document.querySelector(".tag-container");
const input = document.querySelector("#input");
const recipeCount = document.querySelector("#recipe-count");

document.addEventListener("DOMContentLoaded", async () => {
  let recipes = await getData();

  const { updateDropdowns } = initializeDropdowns(recipes, dropdownSelectors);

  const renderRecipes = (recipesToRender) => {
    resultsContainer.innerHTML = recipesToRender
      .map((recipe) => {
        const recipeCard = recipeCardFactory(recipe);
        return recipeCard.getRecipeCardDom();
      })
      .join("");
    updateRecipeCount(recipesToRender.length);
  };

  const updateRecipeCount = (count) => {
    if (recipeCount) {
      recipeCount.textContent = count;
    } else {
      console.error("Element with ID 'recipe-count' not found");
    }
  };

  const updateRecipesDisplay = () => {
    let filteredRecipes = recipes;

    // Filtrage par termes de recherche (plusieurs termes possibles)
    if (tagState.searchTerms.length > 0) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return tagState.searchTerms.every(
          (term) =>
            recipe.name.toLowerCase().includes(term) ||
            recipe.description.toLowerCase().includes(term) ||
            recipe.ingredients.some((ingredient) =>
              ingredient.ingredient.toLowerCase().includes(term)
            )
        );
      });
    }

    // Filtrage par ingrédient sélectionné
    if (tagState.selectedIngredient) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.ingredients.some(
          (ingredient) => ingredient.ingredient === tagState.selectedIngredient
        )
      );
    }

    // Filtrage par appareil sélectionné
    if (tagState.selectedAppliance) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.appliance === tagState.selectedAppliance
      );
    }

    // Filtrage par ustensile sélectionné
    if (tagState.selectedUstensil) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.ustensils.includes(tagState.selectedUstensil)
      );
    }

    renderRecipes(filteredRecipes);
    updateDropdowns(filteredRecipes);
  };

  dropdownSelectors.dropdownIngredients.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.classList.contains("dropdown-item")) {
      const ingredient = event.target.textContent;
      addTag(ingredient, "ingredient", tagContainer, updateRecipesDisplay);
      tagState.selectedIngredient = ingredient; // Update state
      updateRecipesDisplay();
    }
  });

  dropdownSelectors.dropdownAppliances.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.classList.contains("dropdown-item")) {
      const appliance = event.target.textContent;
      addTag(appliance, "appliance", tagContainer, updateRecipesDisplay);
      tagState.selectedAppliance = appliance; // Update state
      updateRecipesDisplay();
    }
  });

  dropdownSelectors.dropdownUstensils.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.classList.contains("dropdown-item")) {
      const ustensil = event.target.textContent;
      addTag(ustensil, "ustensil", tagContainer, updateRecipesDisplay);
      tagState.selectedUstensil = ustensil; // Update state
      updateRecipesDisplay();
    }
  });

  // Gestion du formulaire de recherche
  const searchForm = document.querySelector("#searchForm");
  const input = document.querySelector("#input");

  if (searchForm) {
    // Gestionnaire pour l'événement "submit" sur le formulaire de recherche
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Empêche le rechargement de la page lors du submit

      const inputValue = input.value.toLowerCase().trim();
      if (inputValue.length >= 3) {
        if (!tagState.searchTerms.includes(inputValue)) {
          // Ajoute un tag uniquement si le terme de recherche n'existe pas déjà
          addTag(inputValue, "search", tagContainer, updateRecipesDisplay);
          tagState.searchTerms.push(inputValue); // Ajoute le terme à l'état
          updateRecipesDisplay(); // Actualise les recettes
          input.value = ""; // Réinitialise le champ de recherche
        }
      } else {
        alert("Veuillez entrer au moins 3 caractères pour la recherche");
      }
    });
  }

  // Recherche en temps réel (n'ajoute pas de termes dans tagState)
  input.addEventListener("input", () => {
    const inputValue = input.value.toLowerCase().trim();
    if (inputValue.length >= 3) {
      // Filtrage en temps réel uniquement
      let temporaryFilteredRecipes = recipes.filter((recipe) => {
        return (
          recipe.name.toLowerCase().includes(inputValue) ||
          recipe.description.toLowerCase().includes(inputValue) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.ingredient.toLowerCase().includes(inputValue)
          )
        );
      });
      renderRecipes(temporaryFilteredRecipes);
    } else {
      renderRecipes(recipes); // Si moins de 3 caractères, réinitialise
    }
  });

  updateDropdowns(recipes);
  renderRecipes(recipes);
});
