import "./App.css";
import IngredientsList from "./components/IngredientsList";
import { useState, useEffect } from "react";
import Header from "./components/header";
import GenerateAIRecipe from "./components/GenerateAIRecipe";
import About from "./components/About";
import AddIngredientsCont from "./components/AddIngredients";

const transitionDuration = getComputedStyle(document.documentElement)
  .getPropertyValue("--transition-duration")
  .trim();

const transitionTimeout = parseInt(transitionDuration.replace("ms", ""), 10);

function App() {
  const [ingredients, setIngredients] = useState<
    { id: number; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [recipeTrigger, setRecipeTrigger] = useState(0);
  const [isRemovingLast, setIsRemovingLast] = useState(false);
  const [showError, setShowError] = useState<{
    show: boolean;
    message: string;
    category: string;
  }>({ show: false, message: "", category: "primary" });

  useEffect(() => {
    if (showError.show) {
      setTimeout(() => {
        setShowError({ show: false, message: "", category: "primary" });
      }, 2000);
    }
  }, [showError]);

  function handleSubmit(formData: FormData) {
    let newIngredient = (formData.get("ingredient") as string).trim();
    if (!newIngredient) {
      setShowError({ show: true, message: "Nothing to add", category: "info" });
      return;
    }
    newIngredient =
      newIngredient.charAt(0).toUpperCase() + newIngredient.slice(1);
    const isDuplicate = ingredients.some(
      (ingredient) =>
        ingredient.name.toLowerCase() === newIngredient.toLowerCase()
    );

    if (isDuplicate) {
      setShowError({
        show: true,
        message: "Already Added",
        category: "danger",
      });
      return;
    }

    setIngredients([
      ...ingredients,
      { id: ingredients.length, name: newIngredient },
    ]);
  }

  function removeListItem(id: number) {
    if (ingredients.length === 1) {
      setIsRemovingLast(true);
      setTimeout(() => {
        setIngredients([]);
        setIsRemovingLast(false);
      }, transitionTimeout + 100);
    }
    setIngredients(ingredients.filter((ingredient) => ingredient.id != id));
  }

  return (
    <>
      <Header />
      <div className="mainContentCont">
        <About />
        <div className="mainContent">
          <AddIngredientsCont
            handleSubmit={handleSubmit}
            showError={showError}
          />
          {ingredients.length > 0 || isRemovingLast ? (
            <h1>Ingredients on Hand:</h1>
          ) : null}
          <IngredientsList
            ingredients={ingredients}
            onRemove={removeListItem}
            transitionTimeout={transitionTimeout}
          />
          <div className="spacer"></div>
          {ingredients.length > 0 || isRemovingLast ? (
            <>
              <div className="generateRecipe">
                <div className="generateRecipeDesc">
                  <h1>Ready for a recipe?</h1>
                  <p>Generate a recipe from your list of ingredients.</p>
                </div>
                <button
                  className="grow"
                  onClick={() => {
                    setShowRecipe(true);
                    setIsLoading(true);
                    setRecipeTrigger((prev) => prev + 1);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Generating" : "Get a Recipe"}
                  {isLoading && <div className="loadingSpinner"></div>}
                </button>
              </div>
            </>
          ) : null}
        </div>
        {showRecipe ? (
          <GenerateAIRecipe
            ingredients={ingredients.map((ingredient) => ingredient.name)}
            setIsLoading={setIsLoading}
            recipeTrigger={recipeTrigger}
          />
        ) : null}
      </div>
    </>
  );
}

export default App;
