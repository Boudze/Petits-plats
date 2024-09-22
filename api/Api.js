async function getData() {
  const response = await fetch("data/recipes.json");
  const recipes = await response.json();
  return recipes;
}

export { getData };
