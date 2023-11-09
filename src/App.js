import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    async function fetchQuizData() {
      try {
        const response = await axios.get('https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-quiz');
        setQuizData(response.data.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
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
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const showAnswerForQuestion = () => {
    setShowAnswer(true);
  };

  return (
    <div className="quiz-app">
      <h1>Quiz App</h1>
      {quizData.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="question-container">
          <p>Score: {score}</p>
          <div className="question">
            <p>{question.question}</p>
          </div>
          <div className="options">
            {question.options.map((option, index)=> (
              <button
              key={index}
              onClick={() => checkAnswer(index)}
              className={
                selectedOption === index
                  ? index === question.correctOptionIndex
                    ? 'bgGreen'
                    : 'bgRed'
                  : ''
              }
              disabled={selectedOption !== null}
            >
              {option}
            </button>
            ))} 
          </div>
          <button onClick={nextQuestion}>Next Question</button>
          <button onClick={showAnswerForQuestion}>Show Answer</button>
          <div className="answer">
            {showAnswer && (
              <p>
                Correct Answer: {question.options[question.correctOptionIndex]}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
