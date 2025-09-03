interface addIngredientsContProps {
  handleSubmit: (formData: FormData) => void;
  showError: { show: boolean; message: string; category: string };
}

export default function addIngredientsCont({
  handleSubmit,
  showError,
}: addIngredientsContProps) {
  return (
    <form action={handleSubmit}>
      <div className="addIngredientsCont">
        <div className="alert-wrapper">
          <input
            type="text"
            placeholder="e.g. Oregano"
            name="ingredient"
          ></input>
          {showError.show ? (
            <div
              className={`alert alert-${showError.category} input-alert`}
              role="alert"
            >
              {showError.message}
            </div>
          ) : null}
        </div>
        <button className="slide">
          <span>+ Add ingredient</span>
        </button>
      </div>
    </form>
  );
}
