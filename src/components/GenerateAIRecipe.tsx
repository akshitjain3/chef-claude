import { getRecipeFromGroq, getRecipeFromMistral } from "./ai";
import { useState, useEffect, useRef } from "react";
import "./GenerateAiRecipe.css";
import CustomPagination from "./CustomPagination";

interface GenerateAIRecipeProps {
  ingredients: string[];
  setIsLoading: (a: boolean) => void;
  recipeTrigger: number;
}

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
}

export default function GenerateAIRecipe({
  ingredients,
  setIsLoading,
  recipeTrigger,
}: GenerateAIRecipeProps) {
  const [recipeJSON, setRecipeJSON] = useState<Recipe[] | null>(null);
  const [isValidJson, setIsValidJson] = useState(false);
  const [rawRecipe, setRawRecipe] = useState("");
  const [shouldScroll, setShouldScroll] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const totalPages = recipeJSON
    ? Math.ceil(recipeJSON.length / itemsPerPage)
    : 0;

  const paginatedRecipes = recipeJSON?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (shouldScroll && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [shouldScroll]);

  function parseRecipe(response: string) {
    try {
      const jsonMatch = response.match(/```json\n(\[[\s\S]+?\])\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;

      const parsedRecipes = JSON.parse(jsonString);
      parsedRecipes.forEach(
        (recipe: {
          id: number;
          title: string;
          ingredients: string[];
          instructions: string | string[];
        }) => {
          if (typeof recipe.instructions === "string") {
            let steps = recipe.instructions
              .split(".")
              .map((step: string) => step.trim())
              .filter((step: string) => step.length > 0);

            if (steps.length <= 1) {
              steps = recipe.instructions
                .split("\n")
                .map((step: string) => step.trim())
                .filter((step: string) => step.length > 0);
            }

            recipe.instructions = steps;
          }
        }
      );
      setCurrentPage(1);
      setRecipeJSON(parsedRecipes);
      setIsValidJson(true);
    } catch (error) {
      console.error("JSON parsing error:", error);
      setIsValidJson(false);
      setRawRecipe(response);
    }
  }

  const fetchRecipe = async () => {
    let { result, success } = await getRecipeFromGroq(ingredients);
    if (!success)
      ({ result, success } = await getRecipeFromMistral(ingredients));

    if (!success) {
      setIsValidJson(false);
      setRawRecipe(result);
    } else {
      parseRecipe(result);
    }
    setShouldScroll(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchRecipe();
      setIsLoading(false);
    };

    fetchData();
  }, [recipeTrigger]);

  return (
    <>
      {isValidJson ? (
        <>
          {paginatedRecipes?.map((recipe, recipeIndex) => (
            <div ref={elementRef} className="generatedRecipe" key={recipeIndex}>
              <h2 className="generatedRecipeTitle">{recipe.title}</h2>
              <h3>Ingredients:</h3>
              <ol
                className="list-group list-group-numbered generatedRecipeIngredients "
                style={{
                  gridTemplateRows: `repeat(${Math.ceil(
                    recipe.ingredients.length / 2
                  )}, 1fr)`,
                }}
              >
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-success"
                  >
                    {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                  </li>
                ))}
              </ol>

              <h3>Instructions:</h3>
              <ol className="generatedRecipeInstructions list-group list-group-numbered">
                {recipe.instructions.map((instruction, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-success"
                  >
                    {instruction.charAt(0).toUpperCase() + instruction.slice(1)}
                  </li>
                ))}
              </ol>
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                maxVisiblePages={3}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          ))}
        </>
      ) : (
        rawRecipe && <div className="rawRecipe">{rawRecipe}</div>
      )}
    </>
  );
}
