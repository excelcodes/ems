import React from "react";
import Swal from "sweetalert2";
import { Line } from 'rc-progress';
import withReactContent from "sweetalert2-react-content";
import "./style.css";
import Link from "next/link";

const temp = {};

function remakeQuestion(question) {
  if (!question) return;
  if (question.plural) {
    return temp[question.plural] || (temp[question.plural] = {
      text: Math.random() < 0.5 && question.meaning !== "bacteria" ? `What's the plural of the following definition:\n${question.meaning}` : `What's the plural of ${question.singular}`,
      answer: question.plural,
      type: 0
    });
  }
  if (question.noun) {
    return { text: question.meaning, answer: question.noun, type: 0 };
  }
  if (question.adjective) {
    return { text: question.meaning, answer: question.adjective, type: 0 }
  }
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
  return getAllKeys(question).map(key => {
    if (key === "roots") return "root 1";
    if (key === "3") return undefined;
    if (!isNaN(key)) return `root ${parseInt(key) + 2}`;
    return key;
  }).filter(key => key).map(key => key.split("_").join(" ")).map((key, i) => <th style={{ backgroundColor: color, color: "white" }} key={i}>{key}</th>)
}

export default function Viewer({ data, color, hideTable }) {
  const [set, setSet] = React.useState(data.table[0] || data.practice[0] || data.review[0]);
  const [currentQuestionId, setCurrentQuestionId] = React.useState(0);
  const [textInput, setTextInput] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  const [speedRun, setSpeedRun] = React.useState(false);
  const [start, setStart] = React.useState(false);
  const [toggleSidebar, setToggleSidebar] = React.useState(false);
  const currentQuestion = remakeQuestion({ ...set?.data?.[currentQuestionId] });
  const [correctAnswers, setCorrectAnswers] = React.useState(0);
  const [wrongAnswers, setWrongAnswers] = React.useState([]);

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
    if (speedRun && currentQuestion?.answer?.toLowerCase()?.split(",")?.some(correctAnswer => correctAnswer.trim() === textInput.toLowerCase().trim())) {

      Toast.fire({
        icon: "success",
        title: "Correct!"
      });
      setCorrectAnswers(correct => correct + 1);
      setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
    }
  }, [textInput]);

  React.useEffect(() => {
    setTextInput("");
    if (setCurrentQuestionId === 0) {
      setFeedback("");
      setCorrectAnswers(0);
      setWrongAnswers([]);
    }
  }, [currentQuestionId]);

  React.useEffect(() => {
    setCurrentQuestionId(0);
    setFeedback("");
    setToggleSidebar(false);
    setCorrectAnswers(0);
    setWrongAnswers([]);
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
        {data.table.length ? <><h2>Tables</h2>
          <ul>
            {data.table.sort((a, b) => parseInt(a.name.replace(/Table(\d+)/, "$1")) - parseInt(b.name.replace(/Table(\d+)/, "$1"))).map((tableSet, i) => <li style={{ color: set.name === tableSet.name ? color : "black" }} key={i} onClick={() => { setSet(tableSet); setStart(false); }}>{tableSet.name.replace(/([a-zA-Z])([0-9])/g, '$1 $2')}</li>)}
          </ul></> : <></>}
        {data.review.length ? <><h2>Review</h2>
          <ul>
            {data.review.map((reviewSet, i) => <li style={{ color: set.name === reviewSet.name ? color : "black" }} key={i} onClick={() => { setSet(reviewSet); setStart(false); }}>{reviewSet.name}</li>)}
          </ul></> : <></>}
        {data.practice.length ? <><h2>Practice</h2>
          <ul>
            {data.practice.sort((a, b) => parseInt(a.name.replace(/Practice(\d+)/, "$1")) - parseInt(b.name.replace(/Practice(\d+)/, "$1"))).map((practiceSet, i) => <li style={{ color: set.name === practiceSet.name ? color : "black" }} key={i} onClick={() => { setSet(practiceSet); setStart(false); }}>{practiceSet.name.replace(/([a-zA-Z])([0-9])/g, '$1 $2')}</li>)}
          </ul></> : <></>}
      </div>
      <div className="main-content">
        {toggleSidebar ? <>
          <div className="phone-sidebar">
            <h2>Tables</h2>
            <ul>
              {data.table.sort((a, b) => parseInt(a.name.replace(/Table(\d+)/, "$1")) - parseInt(b.name.replace(/Table(\d+)/, "$1"))).map((tableSet, i) => <li style={{ color: set.name === tableSet.name ? color : "black" }} key={i} onClick={() => { setSet(tableSet); setStart(false); }}>{tableSet.name.replace(/([a-zA-Z])([0-9])/g, '$1 $2')}</li>)}
            </ul>
            <h2>Review</h2>
            <ul>
              {data.review.map((reviewSet, i) => <li style={{ color: set.name === reviewSet.name ? color : "black" }} key={i} onClick={() => { setSet(reviewSet); setStart(false); }}>{reviewSet.name}</li>)}
            </ul>
            <h2>Practice</h2>
            <ul>
              {data.practice.sort((a, b) => parseInt(a.name.replace(/Practice(\d+)/, "$1")) - parseInt(b.name.replace(/Practice(\d+)/, "$1"))).map((practiceSet, i) => <li style={{ color: set.name === practiceSet.name ? color : "black" }} key={i} onClick={() => { setSet(practiceSet); setStart(false); }}>{practiceSet.name.replace(/([a-zA-Z])([0-9])/g, '$1 $2')}</li>)}
            </ul>
          </div>
        </> : <>
          <button onClick={() => setToggleSidebar(true)} className="hamburger-menu"><img src="/hamburger-menu.svg" /></button>
          <h1>{set.name.replace(/([a-zA-Z])([0-9])/g, '$1 $2')}</h1>
          {currentQuestionId === "FINISHED" ? <>
            <p>YOU HAVE FINISHED THIS SET</p>
            <button className="component-button" onClick={() => {
              setWrongAnswers([]);
              setCorrectAnswers(0);
              setCurrentQuestionId(0);
            }}>AGAIN?</button>
            <button className="component-button" onClick={() => {
              let newSet;
              if (data.table.findIndex(table => table.name === set.name) >= 0) {
                newSet = data.table[data.table.findIndex(table => table.name === set.name) + 1];
                if (!newSet) newSet = data.review[0];
              }
              if (!newSet) {
                if (data.review.findIndex(review => review.name === set.name) >= 0) {
                  newSet = data.review[data.review.findIndex(review => review.name === set.name) + 1];
                  if (!newSet) newSet = data.practice[0];
                }
                if (!newSet) {
                  newSet = data.practice[data.practice.findIndex(practice => practice.name === set.name) + 1];
                  if (!newSet) newSet = data.table[0] || data.review[0] || data.practice[0]
                }
              }
              console.log(newSet);
              setSet(newSet);
              if (!speedRun) setStart(false);
            }}>NEXT</button>
          </> : (start ? <>
            <div className="question-text">{currentQuestion.text}</div>
            <form onSubmit={(form) => {
              form.preventDefault();
              if (currentQuestion?.answer?.toLowerCase()?.split(",")?.some(correctAnswer => correctAnswer.trim() === textInput.toLowerCase().trim())) {
                Toast.fire({
                  icon: "success",
                  title: "Correct!"
                });
                setCorrectAnswers(correct => correct + 1);
              } else {
                Toast.fire({
                  icon: "error",
                  title: "Wrong!"
                });
                setWrongAnswers(wrong => [...wrong, currentQuestion]);
              }
              setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
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
                <button onClick={() => {
                  if (currentQuestionId === 0) return;
                  if (wrongAnswers.some(answer => answer.text === remakeQuestion(set.data[currentQuestionId - 1]).text)) {
                    setWrongAnswers(wrongAnswer => wrongAnswer.filter(answer => answer.text !== remakeQuestion(set.data[currentQuestionId - 1]).text))
                  } else {
                    setCorrectAnswers(correct => correct - 1);
                  }
                  setCurrentQuestionId(currentQuestionId => currentQuestionId - 1);
                }} style={{ cursor: currentQuestionId === 0 ? "not-allowed" : "pointer" }} className="component-button" type="button">Back</button>
                <button className="component-button" type="submit">Next</button>
                <br />
              </>}
              {currentQuestion?.type === 2 && <>
                <div className="mcq" onClick={() => {
                  if (currentQuestion.answer === true) {
                    Toast.fire({
                      icon: "success",
                      title: "Correct!"
                    });
                    setCorrectAnswers(correct => correct + 1);
                  } else {
                    Toast.fire({
                      icon: "error",
                      title: "Wrong!"
                    });
                    setWrongAnswers(wrong => [...wrong, currentQuestion]);
                  }
                  setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
                }} style={{ cursor: "pointer" }}>
                  True
                </div>
                <div className="mcq" onClick={() => {
                  if (currentQuestion.answer === false) {
                    Toast.fire({
                      icon: "success",
                      title: "Correct!"
                    });
                    setCorrectAnswers(correct => correct + 1);
                  } else {
                    Toast.fire({
                      icon: "error",
                      title: "Wrong!"
                    });
                    setWrongAnswers(wrong => [...wrong, currentQuestion]);
                  }
                  setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
                }} style={{ cursor: "pointer" }}>
                  False
                </div>
                <button onClick={() => {
                  if (currentQuestionId === 0) return;
                  if (wrongAnswers.some(answer => answer.text === remakeQuestion(set.data[currentQuestionId - 1]).text)) {
                    setWrongAnswers(wrongAnswer => wrongAnswer.filter(answer => answer.text !== remakeQuestion(set.data[currentQuestionId - 1]).text))
                  } else {
                    setCorrectAnswers(correct => correct - 1);
                  }
                  setCurrentQuestionId(currentQuestionId => currentQuestionId - 1);
                }} style={{ cursor: currentQuestionId === 0 ? "not-allowed" : "pointer" }} className="component-button" type="button">Back</button>
                <button className="component-button" type="button" onClick={() => {
                  setWrongAnswers(wrong => [...wrong, currentQuestion]);
                  setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
                  Toast.fire({
                    icon: "error",
                    title: "Wrong!"
                  });
                }}>Next</button>
                <br />
              </>}

              {currentQuestion?.type === 1 && <>
                {currentQuestion.choices.map((choice, i) => <div onClick={() => {
                  if (choice === currentQuestion.answer) {
                    Toast.fire({
                      icon: "success",
                      title: "Correct!"
                    });
                    setCorrectAnswers(correct => correct + 1);
                  } else {
                    Toast.fire({
                      icon: "error",
                      title: "Wrong!"
                    });
                    setWrongAnswers(wrong => [...wrong, currentQuestion]);
                  }
                  setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
                }} className="mcq" key={i}>{choice}</div>)}
                <button onClick={() => {
                  if (currentQuestionId === 0) return;
                  if (wrongAnswers.some(answer => answer.text === remakeQuestion(set.data[currentQuestionId - 1]).text)) {
                    setWrongAnswers(wrongAnswer => wrongAnswer.filter(answer => answer.text !== remakeQuestion(set.data[currentQuestionId - 1]).text))
                  } else {
                    setCorrectAnswers(correct => correct - 1);
                  }
                  setCurrentQuestionId(currentQuestionId => currentQuestionId - 1);
                }} style={{ cursor: currentQuestionId === 0 ? "not-allowed" : "pointer" }} className="component-button" type="button">Back</button>
                <button className="component-button" type="button" onClick={() => {
                  Toast.fire({
                    icon: "error",
                    title: "Wrong!"
                  });
                  setWrongAnswers(wrong => [...wrong, currentQuestion]);
                  setCurrentQuestionId(currentValue => set.data[currentValue + 1] ? currentValue += 1 : "FINISHED");
                }}>Next</button>
                <br />
              </>}

              {feedback ? <button className="component-button" type="button" onClick={() => setFeedback("")}>Hide</button> : <button className="component-button" type="button" onClick={() => {
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
                          })()).map(value => `${value}`).sort((a, b) => {
                            const question = set.data[currentQuestionId];
                            if (a.includes(question.text)) {
                              return -1;
                            } else if (b.includes(question.text)) {
                              return 1;
                            } else {
                              return 0;
                            }
                          }).map((value, i) => <td key={i}>{`${value}`}</td>)
                        }
                      </tr>
                    </tbody>
                  </table>
                )
              }}>Show</button>}
              <button className="component-button" type="button" onClick={randomize}>Randomize</button>
              <button className="component-button" type="button" onClick={() => setStart(false)}>Close</button>
              <div>
                <Line percent={100 * (correctAnswers + wrongAnswers.length) / set.data.length} strokeWidth={4} strokeColor={color} style={{ margin: 10, width: 200 }} />
                <h3>Correct: {correctAnswers}</h3>
                <h3>Wrong: {wrongAnswers.length}</h3>
              </div>
            </form>

          </> : <>
            {!hideTable && <table>
              <tbody>
                <tr>
                  {getHeaders(set.data[0], color)}
                </tr>
                {set.data.map((question, i) => <tr key={i}>
                  {getAllValues((() => {
                    const q = { ...question };
                    if (typeof q.type === "number") delete q.type;
                    if (q.choices) delete q.choices;
                    return q
                  })()).map(value => `${value}`).sort((a, b) => {
                    if (a.includes(question.text)) {
                      return -1;
                    } else if (b.includes(question.text)) {
                      return 1;
                    } else {
                      return 0;
                    }
                  }).map((value, i) => <td key={i}>{`${value}`}</td>)}
                </tr>)}
              </tbody>
            </table>}
            <button onClick={() => setStart(true)} className="component-button start-button">Start📝</button>&#160;&#160;&#160;
            <Link href="/"><button className="component-button start-button">Homepage 🏠</button></Link>
          </>)}
          {feedback && <div>{feedback}</div>}
        </>}
      </div>
    </main>
  );
}