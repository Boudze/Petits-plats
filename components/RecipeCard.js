export function recipeCardFactory(data) {
  const { ingredients, name, description, time, image } = data;

  const ingredientsList = ingredients
    .map((ingredient) => {
      const quantity = ingredient.quantity ? `${ingredient.quantity} ` : "";
      const unit = ingredient.unit ? `${ingredient.unit}` : "";
      return `<li>
            <span class="span-ingredient">${ingredient.ingredient}</span>
            <span class="span-unit"> ${quantity}${unit}</span>
          </li>`;
    })
    .join("");

  function getRecipeCardDom() {
    return `
          <div class="card-container">
            <div class="card mb-4 border-0">
              <img src="assets/images/${image}" class="card-img-top" alt="${name}">
              <div class="card-body">
                <div class="card_info_recette">
                  <h5 class="card_title_recette">${name}</h5>
                  <h3>Recette</h3>
                  <p>${description}</p>
                </div>
                <div class="card_info_ingredients">
                  <h3>Ingrédients</h3>
                  <ul>${ingredientsList}</ul>
                  <small class="text-muted">${time} min</small>
                </div>
              </div>
            </div>
          </div>
        `;
  }

  return { getRecipeCardDom };
}
