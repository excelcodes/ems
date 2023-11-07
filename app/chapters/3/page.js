"use client";

import React from "react";
import data from "./data.json"
import "./style.css";

function remakeQuestion(question) {
  if (!question) return;
  if (question.choices) {
    question.type = 1;
  } else {
    question.type = 0;
    question.text = question.exMeaning;
    question.answer = question.example;
  }
  return question;
}

export default function Page() {
  const [set, setSet] = React.useState(false);
  const [currentQuestionId, setCurrentQuestionId] = React.useState(0);
  const [textInput, setTextInput] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  const [speedRun, setSpeedRun] = React.useState(false);
  const [start, setStart] = React.useState(false);
  const currentQuestion = remakeQuestion({ ...set[currentQuestionId] });

  React.useEffect(() => {
    if (speedRun && textInput === currentQuestion?.answer) {
      setFeedback("Correct!");
      setCurrentQuestionId(currentValue => set[currentValue + 1] ? currentValue += 1 : "FINISHED");
    }
  }, [textInput]);

  React.useEffect(() => {
    setTextInput("");
    if (setCurrentQuestionId === 0) setFeedback("");
  }, [currentQuestionId]);

  React.useEffect(() => {
    setCurrentQuestionId(0);
    setFeedback("");
  }, [set]);

  function randomize() {
    setSet(set => {
      const shuffledArray = [...set];

      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }

      return shuffledArray;
    });
  }

  return (
    <main>
      {data.tables.map((set, i) => <button key={i} onClick={() => { setSet(set); setStart(false); }}>Table {i + 1}</button>)}
      <div>
        {currentQuestionId === "FINISHED" ? <>
          YOU HAVE FINISHED THIS SET
          <button onClick={() => setCurrentQuestionId(0)}>AGAIN?</button>
        </> : set ? (start ? <>
          <div id="question">{currentQuestion.text}</div>
          <form onSubmit={(form) => {
            form.preventDefault();
            if (textInput === currentQuestion?.answer) {
              setFeedback("Correct!");
              setCurrentQuestionId(currentValue => set[currentValue + 1] ? currentValue += 1 : "FINISHED");
            } else setFeedback("Wrong!");
          }}>
            <input
              type="text"
              value={textInput}
              onInput={input => setTextInput(input.target.value)} />
            <span onClick={() => setSpeedRun(speedRun => !speedRun)} style={{ cursor: "pointer" }}>
              <input checked={speedRun} readOnly={true} type="checkbox" /> Speed Run
            </span><br />
            <button type="submit">Check</button>
            <button type="button" onClick={() => {
              setCurrentQuestionId(currentValue => set[currentValue + 1] ? currentValue += 1 : "FINISHED");
              setFeedback(
                <table>
                  <tbody>
                    <tr>
                      {Object.keys(currentQuestion).map((key, i) => <th key={i}>{key}</th>)}
                    </tr>
                    <tr>
                      {Object.values(currentQuestion).map((value, i) => <th key={i}>{value}</th>)}
                    </tr>
                  </tbody>
                </table>
              )
            }}>Show</button>
            <button type="button" onClick={randomize}>Randomize</button>
          </form>

        </> : <>
          <table>
            <tbody>
              <tr>
                {Object.keys(set[0]).map((key, i) => <th key={i}>{key}</th>)}
              </tr>
              {set.map((question, i) => <tr key={i}>
                {Object.keys(question).map((key, i) => <td key={i}>{question[key]}</td>)}
              </tr>)}
            </tbody>
          </table>
          <button onClick={() => setStart(true)}>Start</button>
        </>) : (<>No table is chosen</>)}
        {feedback && <div>{feedback}</div>}
      </div>
    </main>
  );
}