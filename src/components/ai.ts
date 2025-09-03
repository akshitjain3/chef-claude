const API_BASE_URL = "https://chef-claude-backend.up.railway.app";

interface RecipeResponse {
  result: string;
  success: boolean;
  error?: string;
}

async function callRecipeAPI(
  endpoint: string,
  ingredients: string[]
): Promise<RecipeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        result: data.error || "Unknown error occurred",
        success: false,
        error: data.error,
      };
    }

    return data;
  } catch (error) {
    console.error(`${endpoint} API Error:`, error);
    return {
      result: "Connection error. Please check your network and try again.",
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export async function getRecipeFromMistral(
  ingredientsArr: string[]
): Promise<RecipeResponse> {
  return callRecipeAPI("mistral", ingredientsArr);
}

export async function getRecipeFromGroq(
  ingredientsArr: string[]
): Promise<RecipeResponse> {
  return callRecipeAPI("groq", ingredientsArr);
}
