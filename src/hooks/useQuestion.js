// src/hooks/useQuestion.js
import { useState, useEffect, useCallback } from "react";
import { getQuestions } from "./useApi";

const useQuestion = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const fetchQuestion = useCallback(async () => {
    try {
      const data = await getQuestions();
      if (Array.isArray(data) && data.length > 0) {
        setCurrentQuestion((prevQuestion) => {
          let nextIndex = Math.floor(Math.random() * data.length);
          if (prevQuestion && data[nextIndex].id === prevQuestion.id && data.length > 1) {
            nextIndex = (nextIndex + 1) % data.length;
          }
          return data[nextIndex];
        });
      } else {
        setCurrentQuestion(null);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  }, []);

  // Initialize on mount.
  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  // Handle answer selection and update user score in localStorage.
  const handleAnswer = useCallback(
    (selectedOption) => {
      console.log("User selected:", selectedOption);

      let username = localStorage.getItem("username");
      if (!username) {
        username = prompt("Please enter your username:") || "Anonymous";
        localStorage.setItem("username", username);
      }

      let score = parseInt(localStorage.getItem("score") || "0", 10);

      if (selectedOption.isCorrect) {
        score += 1;
        localStorage.setItem("score", score.toString());
        console.log(`Correct! ${username}'s new score: ${score}`);
      } else {
        console.log(`Incorrect. ${username}'s score remains: ${score}`);
      }

      fetchQuestion();
    },
    [fetchQuestion]
  );

  return { currentQuestion, handleAnswer };
};

export default useQuestion;
