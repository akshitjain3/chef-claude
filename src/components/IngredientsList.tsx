import "./IngredientsList.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import React from "react";
import { useRef } from "react";

interface IngredientsListProps {
  ingredients: { id: number; name: string }[];
  onRemove: (id: number) => void;
  transitionTimeout: number;
}

export default function IngredientsList({
  ingredients,
  onRemove,
  transitionTimeout,
}: IngredientsListProps) {
  const nodeRefs = useRef(new Map<number, React.RefObject<HTMLLIElement>>());

  return (
    <TransitionGroup component="ul" className="ingredientsList list-group">
      {ingredients.map((ingredient) => {
        let ref = nodeRefs.current.get(ingredient.id);
        if (!ref) {
          ref =
            React.createRef<HTMLLIElement>() as React.RefObject<HTMLLIElement>;
          nodeRefs.current.set(ingredient.id, ref);
        }

        return (
          <CSSTransition
            key={ingredient.id}
            classNames="transition"
            timeout={transitionTimeout}
            nodeRef={ref}
            appear={true}
          >
            <li
              className="ingredient list-group-item list-group-item-light"
              ref={ref}
            >
              {ingredient.name}
              <button onClick={() => onRemove(ingredient.id)}>❌</button>
            </li>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
}
