import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import "./Style.css";

function App() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [success, setSuccess] = useState(true);
  const [failure, setFailure] = useState(true);

  useEffect(() => {
    async function fetchQuizData() {
      try {
        const response = await axios.get(
          "https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-quiz"
        );
        setQuizData(response.data.data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    }

    fetchQuizData();
  }, []);

  const question = quizData[currentQuestion];

  const checkAnswer = (optionIndex) => {
    if (optionIndex === question.correctOptionIndex) {
      setSelectedOption(optionIndex);
      setScore(score + 1);
    } else {
      setSelectedOption(optionIndex);
    }
    setFailure(false)
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowAnswer(false);
      setSuccess(true);
      setFailure(true)
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowAnswer(false);
  };

  const showAnswerForQuestion = () => {
    setSuccess(true);
    setShowAnswer(true);
  };

  const hideAnswerForQuestion = () => {
    setSuccess(false);
    setShowAnswer(false);
  };

  return (
    <div className="App">
      <h1>Quiz App</h1>
        {<div>
          {quizData.length === 0 ? (
            <h1>Loading...</h1>
          ) : ( currentQuestion < quizData.length - 1 &&
            <div className="question-container">
              <h2>Score: {score}</h2>
              <div className="question">
                <h3>{question.question}</h3>
              </div>
              <div className="options">
                {question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(index)}
                    className={
                      selectedOption === index
                        ? index === question.correctOptionIndex
                          ? "bgGreen"
                          : "bgRed"
                        : ""
                    }
                    disabled={selectedOption !== null}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                className="next"
                disabled={currentQuestion == quizData.length - 1}
                onClick={nextQuestion}
              >
                Next Question
              </button>
              {success === false ? (
                <>
                  <button className="answer" onClick={showAnswerForQuestion}>
                    Hide Answer
                  </button>
                  <div className="showAnswer">
                    <p>
                      <span>
                        <h3>Correct Answer</h3>
                      </span>{" "}
                      {question.options[question.correctOptionIndex]}
                    </p>
                  </div>
                </>
              ) : (
                <button className="answer" disabled={failure} onClick={hideAnswerForQuestion}>
                  Show Answer
                </button>
              )}
              <button className="reset" onClick={resetQuiz}>
                Reset Quiz
              </button>
            </div>
          )}
        </div>}

        {currentQuestion === quizData.length - 1 ? <div className="EndQuiz">
          <h2>Score: {score} / {quizData.length}</h2>
          <button className="reset" onClick={resetQuiz}>
            Reset Quiz
          </button>
        </div> : ""}
      
    </div>
  );
}

export default App;
