import React from "react";
import "./style.css";

function remakeQuestion(question) {
  if (!question) return;
  if (question.example) {
    return { text: question.example.meaning, answer: question.example.text, type: 0 };
  } else if (question.medical_term) {
    return { text: question.meaning, answer: question.medical_term, type: 0 };
  }
  return question;
}

function getAllKeys(obj, result = []) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      result.push(key);
      getAllKeys(obj[key], result);
    } else {
      if (key !== "text") result.push(key);
    }
  }
  return result;
}

const getAllValues = (obj) => (obj && typeof obj === 'object')
  ? Object
    .values(obj)
    .map(getAllValues)
    .reduce((a, b) => a.concat(b), [])
  : [obj]

function getHeaders(question) {
  if (question.type === 0 || question.type) return <>
    <th>question</th>
    <th>answer</th>
  </>;
  return getAllKeys(question).map(key => key.split("_").join(" ")).map((key, i) => <th key={i}>{key}</th>)
}

export default function Viewer({ data }) {
  const [set, setSet] = React.useState(false);
  const [currentQuestionId, setCurrentQuestionId] = React.useState(0);
  const [textInput, setTextInput] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  const [speedRun, setSpeedRun] = React.useState(false);
  const [start, setStart] = React.useState(false);
  const currentQuestion = remakeQuestion({ ...set[currentQuestionId] });

  React.useEffect(() => {
    if (speedRun && textInput.toLowerCase() === currentQuestion?.answer) {
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
    <main className="container">
      {/* {data.table.sort((a, b) => parseInt(a.name.replace(/Table(\d+)/, '$1')) - parseInt(b.name.replace(/Table(\d+)/, '$1'))).map((set, i) => <button key={i} onClick={() => { setSet(set.data); setStart(false); }}>{set.name}</button>)} */}
      {/* {data.review.map((set, i) => <button key={i} onClick={() => { setSet(set.data); setStart(false); }}>{set.name}</button>)} */}
      {/* {data.practice.map((set, i) => <button key={i} onClick={() => { setSet(set.data); setStart(false); }}>{set.name}</button>)} */}
      <div class="sidebar">
        <h2>Tables</h2>
        <ul>
            {data.table.sort((a, b) => parseInt(a.name.replace(/Table(\d+)/, '$1')) - parseInt(b.name.replace(/Table(\d+)/, '$1'))).map((set, i) => <li key={i} onClick={() => { setSet(set.data); setStart(false); }}>{set.name.replace(/([a-zA-Z])([0-9])/g, '$1 $2')}</li>)}
        </ul>
        <h2>Review</h2>
        <ul>
          {data.review.map((set, i) => <li key={i} onClick={() => { setSet(set.data); setStart(false); }}>{set.name}</li>)}
        </ul>
        <h2>Practice</h2>
        <ul>
          {data.practice.map((set, i) => <li key={i} onClick={() => { setSet(set.data); setStart(false); }}>{set.name}</li>)}
        </ul>
    </div>
      <div className="main-content">
        {currentQuestionId === "FINISHED" ? <>
          YOU HAVE FINISHED THIS SET
          <button onClick={() => setCurrentQuestionId(0)}>AGAIN?</button>
        </> : set ? (start ? <>
          <div id="question">{currentQuestion.text}</div>
          <form onSubmit={(form) => {
            form.preventDefault();
            if (textInput.toLowerCase() === currentQuestion?.answer) {
              setFeedback("Correct!");
              setCurrentQuestionId(currentValue => set[currentValue + 1] ? currentValue += 1 : "FINISHED");
            } else setFeedback("Wrong!");
          }}>
            {currentQuestion?.type === 0 && <>
              <input
                type="text"
                value={textInput}
                onInput={input => setTextInput(input.target.value)} />
              <span onClick={() => setSpeedRun(speedRun => !speedRun)} style={{ cursor: "pointer" }}>
                <input checked={speedRun} readOnly={true} type="checkbox" /> Speed Run
              </span><br />
              <button type="submit">Check</button>
            </>}
            {currentQuestion?.type === 2 && <>
              <div className="mcq" onClick={() => {
                  if (currentQuestion.answer === true) {
                    setFeedback("Correct!");
                    setCurrentQuestionId(currentValue => set[currentValue + 1] ? currentValue += 1 : "FINISHED");
                  } else setFeedback("Wrong!");
                }} style={{ cursor: "pointer" }}>
                True
              </div>
              <div className="mcq" onClick={() => {
                  if (currentQuestion.answer === false) {
                    setFeedback("Correct!");
                    setCurrentQuestionId(currentValue => set[currentValue + 1] ? currentValue += 1 : "FINISHED");
                  } else setFeedback("Wrong!");
                }} style={{ cursor: "pointer" }}>
                False
              </div>
            </>}

            {currentQuestion?.type === 1 &&
              currentQuestion.choices.map((choice, i) => <div onClick={() => {
                if (choice === currentQuestion.answer) {
                  setFeedback("Correct!");
                  setCurrentQuestionId(currentValue => set[currentValue + 1] ? currentValue += 1 : "FINISHED");
                } else {
                  setFeedback("Wrong!");
                }
              }} className="mcq" key={i}>{choice}</div>)
            }

            <button type="button" onClick={() => {
              setCurrentQuestionId(currentValue => set[currentValue + 1] ? currentValue += 1 : "FINISHED");
              setFeedback(
                <table>
                  <tbody>
                    <tr>
                      {getHeaders(set[0])}
                    </tr>
                    <tr>
                      {
                        getAllValues((() => {
                          const q = { ...set[currentQuestionId] };
                          if (q.type) delete q.type;
                          if (q.choices) delete q.choices;
                          return q;
                        })()).map((value, i) => <td key={i}>{`${value}`}</td>)
                      }
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
                {getHeaders(set[0])}
              </tr>
              {set.map((question, i) => <tr key={i}>
                {getAllValues((() => {
                  const q = { ...question };
                  if (typeof q.type === "number") delete q.type;
                  if (q.choices) delete q.choices;
                  console.log(q);
                  return q;
                })()).map((value, i) => <td key={i}>{`${value}`}</td>)}
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