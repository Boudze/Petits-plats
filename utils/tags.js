// tags.js

// Modifie l'état pour stocker plusieurs termes de recherche
export const tagState = {
  searchTerms: [], // Changement ici : tableau au lieu d'une seule chaîne
  selectedIngredient: "",
  selectedAppliance: "",
  selectedUstensil: "",
};

export const addTag = (tagText, type, tagContainer, updateRecipesDisplay) => {
  const tag = document.createElement("span");
  tag.textContent = tagText;
  tag.classList.add("tag");

  const cross = document.createElement("span");
  cross.textContent = " ×";
  cross.classList.add("tag-cross");
  tag.appendChild(cross);

  cross.addEventListener("click", () => {
    tagContainer.removeChild(tag);

    if (type === "search") {
      tagState.searchTerms = tagState.searchTerms.filter(
        (term) => term !== tagText
      );
    } else if (type === "ingredient") {
      tagState.selectedIngredient = "";
    } else if (type === "appliance") {
      tagState.selectedAppliance = "";
    } else if (type === "ustensil") {
      tagState.selectedUstensil = "";
    }

    updateRecipesDisplay(); // Mettre à jour les recettes après suppression du tag
  });

  tagContainer.appendChild(tag);
};
