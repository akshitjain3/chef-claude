import { useEffect, useState } from "react";
import "./flash.css";

export default function About() {
  const aboutStatements = [
    `Turn leftover ingredients into delicious recipes with Chef Claude, your AI-powered kitchen assistant.`,
    `Chef Claude helps you cook smarter by generating creative recipes from the ingredients you already have.`,
  ];

  const [flashTextIndex, setFlashTextIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("offscreen-right");
  const [transitionClass, setTransitionClass] = useState("");
  const flashMessageTimer = 5000;
  const animationTimer = 500;

  useEffect(() => {
    const slideInTimer = setTimeout(() => {
      setAnimationClass("");
    }, animationTimer);

    const slideOutTimer = setTimeout(() => {
      setAnimationClass("offscreen-left");
    }, flashMessageTimer);

    const stopTransition = setTimeout(() => {
      setTransitionClass("no-transition");
      setAnimationClass("offscreen-right");
    }, flashMessageTimer + animationTimer - 10);

    const changeText = setTimeout(() => {
      setFlashTextIndex((prev) => (prev + 1) % aboutStatements.length);
      requestAnimationFrame(() => {
        const el = document.querySelector(".flash-messages");
        if (el instanceof HTMLElement) {
          el.offsetHeight;
        }

        setTransitionClass("");
        setAnimationClass("");
      });
    }, flashMessageTimer + animationTimer + 50);

    return () => {
      clearTimeout(slideInTimer);
      clearTimeout(slideOutTimer);
      clearTimeout(stopTransition);
      clearTimeout(changeText);
    };
  }, [flashTextIndex]);

  return (
    <h3 className={`about flash-messages ${animationClass} ${transitionClass}`}>
      {aboutStatements[flashTextIndex]}
    </h3>
  );
}
