import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./style.css";
import Link from "next/link";

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
  ? Object
    .values(obj)
    .map(getAllValues)
    .reduce((a, b) => a.concat(b), [])
  : [obj]

function getHeaders(question, color) {
  if (question.type === 0 || question.type) return <>
    <th style={{ backgroundColor: color, color: "white" }}>question</th>
    <th style={{ backgroundColor: color, color: "white" }}>answer</th>
  </>;
  return getAllKeys(question).map(key => key.split("_").join(" ")).map((key, i) => <th style={{ backgroundColor: color, color: "white" }} key={i}>{key}</th>)
}

export default function Viewer({ data, color }) {
  const [set, setSet] = React.useState(data.table[0]);
  const [currentQuestionId, setCurrentQuestionId] = React.useState(0);
  const [textInput, setTextInput] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  const [speedRun, setSpeedRun] = React.useState(false);
  const [start, setStart] = React.useState(false);
  const currentQuestion = remakeQuestion({ ...set?.data?.[currentQuestionId] });
  const Toast = withReactContent(Swal).mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    didOpen: (toast) => {
      toast.onmouseenter = withReactContent(Swal).stopTimer;
      toast.onmouseleave = withReactContent(Swal).resumeTimer;
    }
  });

  React.useEffect(() => {
    if (speedRun && textInput.toLowerCase() === currentQuestion?.answer) {
      
      Toast.fire({
        icon: "success",
        title: "Correct!"
      });
      setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
    }
  }, [textInput]);

  React.useEffect(() => {
    setTextInput("");
    if (setCurrentQuestionId === 0) setFeedback("");
  }, [currentQuestionId]);

  React.useEffect(() => {
    setCurrentQuestionId(0);
    setFeedback("");
  }, [set, start]);

  function randomize() {
    setSet(set => {
      const shuffledArray = [...set.data];

      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }

      return { ...set, data: shuffledArray };
    });
  }

  return (
    <main className="container">
      <div className="sidebar">
        <h2>Tables</h2>
        <ul>
          {data.table.sort((a, b) => parseInt(a.name.replace(/Table(\d+)/, "$1")) - parseInt(b.name.replace(/Table(\d+)/, "$1"))).map((tableSet, i) => <li style={{color: set.name === tableSet.name ? color : "black"}} key={i} onClick={() => { setSet(tableSet); setStart(false); }}>{tableSet.name.replace(/([a-zA-Z])([0-9])/g, '$1 $2')}</li>)}
        </ul>
        <h2>Review</h2>
        <ul>
          {data.review.map((reviewSet, i) => <li style={{color: set.name === reviewSet.name ? color : "black"}}  key={i} onClick={() => { setSet(reviewSet); setStart(false); }}>{reviewSet.name}</li>)}
        </ul>
        <h2>Practice</h2>
        <ul>
          {data.practice.sort((a, b) => parseInt(a.name.replace(/Practice(\d+)/, "$1")) - parseInt(b.name.replace(/Practice(\d+)/, "$1"))).map((practiceSet, i) => <li style={{color: set.name === practiceSet.name ? color : "black"}} key={i} onClick={() => { setSet(practiceSet); setStart(false); }}>{practiceSet.name.replace(/([a-zA-Z])([0-9])/g, '$1 $2')}</li>)}
        </ul>
      </div>
      <div className="main-content">
        <h1>{set.name.replace(/([a-zA-Z])([0-9])/g, '$1 $2')}</h1>
        {currentQuestionId === "FINISHED" ? <>
          YOU HAVE FINISHED THIS SET
          <button className="component-button" onClick={() => setCurrentQuestionId(0)}>AGAIN?</button>
        </> : (start ? <>
          <div className="question-text">{currentQuestion.text}</div>
          <form onSubmit={(form) => {
            form.preventDefault();
            if (textInput.toLowerCase() === currentQuestion?.answer) {
              
              Toast.fire({
                icon: "success",
                title: "Correct!"
              });
              setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
            } else Toast.fire({
              icon: "error",
              title: "Wrong!"
            });
          }}>
            {currentQuestion?.type === 0 && <>
              <input
                className="question-input"
                type="text"
                value={textInput}
                onInput={input => setTextInput(input.target.value)} />
              <div onClick={() => setSpeedRun(speedRun => !speedRun)} style={{ cursor: "pointer" }}>
                <input checked={speedRun} readOnly={true} type="checkbox" style={{ cursor: "pointer" }} /> Speed Run
              </div><br />
              <button className="component-button" type="submit">Check</button>
            </>}
            {currentQuestion?.type === 2 && <>
              <div className="mcq" onClick={() => {
                if (currentQuestion.answer === true) {
                  
                  Toast.fire({
                    icon: "success",
                    title: "Correct!"
                  });
                  setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
                } else Toast.fire({
                  icon: "error",
                  title: "Wrong!"
                });
              }} style={{ cursor: "pointer" }}>
                True
              </div>
              <div className="mcq" onClick={() => {
                if (currentQuestion.answer === false) {
                  
                  Toast.fire({
                    icon: "success",
                    title: "Correct!"
                  });
                  setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
                } else Toast.fire({
                  icon: "error",
                  title: "Wrong!"
                });
              }} style={{ cursor: "pointer" }}>
                False
              </div>
            </>}

            {currentQuestion?.type === 1 &&
              currentQuestion.choices.map((choice, i) => <div onClick={() => {
                if (choice === currentQuestion.answer) {
                  
                  Toast.fire({
                    icon: "success",
                    title: "Correct!"
                  });
                  setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
                } else {
                  Toast.fire({
                    icon: "error",
                    title: "Wrong!"
                  });
                }
              }} className="mcq" key={i}>{choice}</div>)
            }

            <button className="component-button" type="button" onClick={() => {
              setFeedback(
                <table>
                  <tbody>
                    <tr>
                      {getHeaders(set.data[0], color)}
                    </tr>
                    <tr>
                      {
                        getAllValues((() => {
                          const q = { ...set.data[currentQuestionId] };
                          if (typeof q.type === "number") delete q.type;
                          if (q.choices) delete q.choices;
                          return q;
                        })()).map((value, i) => <td key={i}>{`${value}`}</td>)
                      }
                    </tr>
                  </tbody>
                </table>
              )
            }}>Show</button>
            <button className="component-button" type="button" onClick={randomize}>Randomize</button>
            <button className="component-button" type="button" onClick={() => setStart(false)}>Close</button>
          </form>

        </> : <>
          <table>
            <tbody>
              <tr>
                {getHeaders(set.data[0], color)}
              </tr>
              {set.data.map((question, i) => <tr key={i}>
                {getAllValues((() => {
                  const q = { ...question };
                  if (typeof q.type === "number") delete q.type;
                  if (q.choices) delete q.choices;
                  return q;
                })()).map((value, i) => <td key={i}>{`${value}`}</td>)}
              </tr>)}
            </tbody>
          </table>
          <button  onClick={() => setStart(true)} className="component-button start-button">Start📝</button>&#160;&#160;&#160;
          <button className="component-button start-button"><Link href="/">Homepage 🏠</Link></button>
        </>)}
        {feedback && <div>{feedback}</div>}
      </div>
    </main>
  );
}