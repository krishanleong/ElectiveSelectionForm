import { useEffect } from "react";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { electiveData } from "./utils/electives";
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNaskA0i47149Komc5A2mayaBl98P9wjM",
  authDomain: "elective-selection-app.firebaseapp.com",
  projectId: "elective-selection-app",
  storageBucket: "elective-selection-app.appspot.com",
  messagingSenderId: "620196107030",
  appId: "1:620196107030:web:56a69e27a007c812593637",
  measurementId: "G-71PCM7P7J7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const user = auth.currentUser;
const analytics = getAnalytics(app);

const Grade7MathClasses = ["7th Grade Math", "7th Grade Algebra"];
const Grade6MathClasses = ["6th Grade Math", "Triple Compacted Math"];

const Grade8MathClasses = [
  "8th Grade Math",
  "8th Grade Algebra",
  "8th Grade Geometry",
];

function App() {
  const [grade, setGrade] = useState(0);
  const [math, setMath] = useState("");
  const [electives, setElectives] = useState(electiveData);
  const [step, setStep] = useState(1);
  const [lunchNumber, setLunchNumber] = useState(0);
  const [elementary, setElementary] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (user) setName(user.displayName);
  let maxElectives = 0;
  function handleChangeMath(mathclass) {
    setMath(mathclass);
    console.log(mathclass);
  }
  function handleSetGrade(g) {
    console.log("selected grade", g);

    setMath("");
    setStep(1);
    setGrade(g);
    setElectives(electiveData.filter((e) => e.grade.includes(g + 1)));
  }

  useEffect(() => {
    const el = electiveData.map((elective) => ({
      ...elective,
      check: false,
      chosen: false,
    }));
    setStep(1);
    setElectives(el.filter((e) => e.grade.includes(grade + 1)));
  }, [math]);

  const currElectives = electives.reduce(
    (accumulator, elective) =>
      accumulator + (elective.check && elective.length),
    0
  );
  console.log("Curr electives", currElectives);
  const electiveChoices = electives.filter(
    (elective) =>
      elective.check === true &&
      elective.firstAlt === false &&
      elective.secondAlt === false
  );

  const quarterElectiveChoices =
    step === 1
      ? electives.filter(
          (elective) => elective.check === true && elective.length === 0.25
        )
      : electives.filter(
          (elective) =>
            elective.length === 0.25 &&
            elective.check === true &&
            elective.chosen === true
        );

  const semElectiveChoices =
    step === 1
      ? electives.filter(
          (elective) => elective.check === true && elective.length === 0.5
        )
      : electives.filter(
          (elective) =>
            elective.check === true &&
            elective.length === 0.5 &&
            elective.chosen === true
        );

  const yearElectiveChoices =
    step === 1
      ? electives.filter(
          (elective) => elective.check === true && elective.length === 1
        )
      : electives.filter(
          (elective) =>
            elective.check === true &&
            elective.length === 1 &&
            elective.chosen === true
        );

  const firstAltElectiveChoices = electives.filter(
    (elective) =>
      elective.check === true &&
      elective.firstAlt === true &&
      elective.chosen === false
  );
  const secondAltElectiveChoices = electives.filter(
    (elective) =>
      elective.check === true &&
      elective.secondAlt === true &&
      elective.chosen === false
  );

  if (grade === 6) {
    maxElectives = (math === "7th Grade Algebra" ? 2 : 1) + step - 1;
  } else if (grade === 5) {
    yearElectiveChoices.length === 1
      ? (maxElectives = 1 + step - 1)
      : (maxElectives = 1 + (step - 1) * 0.25);
  } else maxElectives = 3 + step - 1;
  console.log("Max electives", maxElectives);

  console.log("step", step);

  const handleOnChange = (position) => {
    console.log("position", position);

    const updatedElectives = electives.map((elective, index) => {
      console.log("grade:", grade);
      console.log("elective.name:", elective.name);
      console.log("electives[position].length:", electives[position].length);
      if (index === position) {
        return { ...elective, check: !elective.check };
      }
      if (
        grade === 5 &&
        elective.name === "6 Career Investigations" &&
        electives[position].length === 0.25
      ) {
        return { ...elective, check: true };
      }
      return elective;
    });
    console.log("updated electives", updatedElectives);
    setElectives(updatedElectives);
  };

  function handleReset(e) {
    e.preventDefault();
    setGrade(0);
    setMath("");
    setStep(1);
    setElectives(electiveData);
  }

  function handleLock(e) {
    e.preventDefault();
    if (currElectives !== maxElectives) {
      alert("Please select more electives");
      return;
    }
    if (step === 1 && currElectives === maxElectives) {
      const updatedElectives = electives.map((elective) =>
        elective.check ? { ...elective, chosen: true } : elective
      );
      setElectives(updatedElectives);
    }
    if (step === 2 && currElectives === maxElectives) {
      const updatedElectives = electives.map((elective) =>
        elective.check && !elective.chosen
          ? { ...elective, firstAlt: true }
          : elective
      );
      setElectives(updatedElectives);
    }
    if (step === 3 && currElectives === maxElectives) {
      const updatedElectives = electives.map((elective) =>
        elective.check && !elective.chosen && !elective.firstAlt
          ? { ...elective, secondAlt: true }
          : elective
      );
      setElectives(updatedElectives);
    }

    if (step !== 4) {
      if (currElectives === maxElectives) setStep(() => step + 1);
    }
  }

  function signInWithGoogle(e) {
    e.preventDefault();
    console.log("signing in with google");
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential ? result.credential.accessToken : null;
        // The signed-in user info.

        const user = result.user;

        console.log("User ID:", user.uid);
        console.log("Display Name:", user.displayName);
        setName(user.displayName);
        console.log("Email:", user.email);
        setEmail(user.email);
        console.log("Photo URL:", user.photoURL);
        // ...
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
      });
  }

  function handleSubmit(e) {
    // e.preventDefault();

    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.disabled = false;
    });

    const formEle = document.querySelector("form");
    const formDatab = new FormData(formEle);

    fetch(
      "https://script.google.com/macros/s/AKfycbzdmrSZdJvEAujZAul8cPcbcwNgTEUzfjhcT-DIpfIO-Hyoa6SPJCgYTqItvo0WgmaZ3g/exec",
      {
        method: "POST",
        body: formDatab,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    setStep(() => step + 1);
  }
  return step !== 5 ? (
    <div className="container">
      {!name && (
        <button
          className="login-with-google-btn"
          onClick={(e) => signInWithGoogle(e)}
        >
          Sign in with Google
        </button>
      )}
      <form onSubmit={(e) => handleSubmit(e)}>
        <GradeSelection
          grade={grade}
          handleSetGrade={handleSetGrade}
          name={name}
        />

        <div className="coreClasses">
          {/* //5th GRADERSSSSSSSSSSSSSSSSSSSSSS */}
          {grade === 5 && (
            <>
              <div className="Math">
                <h3>Select your math class</h3>
                <Math
                  grade={5}
                  handleChangeMath={handleChangeMath}
                  selectedMath={math}
                  value="Math 6"
                  classText={Grade6MathClasses}
                />
              </div>

              {math !== "" && (
                <div className="Electives">
                  <h3 style={{ display: "inline" }}>
                    {step === 1 && "Select your Electives Lock When Done"}
                    {step === 2 &&
                      "Select first Alternate Electives Lock When Done"}
                    {step === 3 &&
                      "Select second Alternate Electives Lock When Done"}
                    {step === 4 && "Elective Selection Complete"}
                    <a href="https://docs.google.com/document/d/1jq-_TGFsGvDMeCvfvazU53r-euJct6tehLowJo8h9no/edit?usp=sharing">
                      Link to class descriptions
                    </a>
                  </h3>
                  {step !== 4 && (
                    <button onClick={(e) => handleLock(e)}>Lock in</button>
                  )}
                  <div className="electiveContainer">
                    {electives.map((elective, index) => {
                      return (
                        <div className="electivechoice">
                          <input
                            type="checkbox"
                            id={elective.name}
                            name={elective.name}
                            key={elective.name}
                            checked={elective.check}
                            onChange={() => handleOnChange(index)}
                            disabled={
                              (currElectives + elective.length > maxElectives &&
                                elective.check === false) ||
                              elective.chosen === true ||
                              elective.firstAlt === true ||
                              step === 4
                            }
                          />
                          <label
                            htmlFor={elective.name}
                            className={
                              elective.length === 0.25
                                ? "checklabel quarter"
                                : "checklabel full"
                            }
                          >
                            {elective.name} -{" "}
                            {elective.length === 0.25 ? "quarter" : "full year"}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <Schedule
                grade={grade}
                math={math}
                electiveChoices={electiveChoices}
                quarterElectiveChoices={quarterElectiveChoices}
                semElectiveChoices={semElectiveChoices}
                yearElectiveChoices={yearElectiveChoices}
                firstAltElectiveChoices={firstAltElectiveChoices}
                secondAltElectiveChoices={secondAltElectiveChoices}
              />
            </>
          )}
          {/* //6th GRADERSSSSSSSSSSSSSSSSSSSSSS */}
          {grade === 6 && (
            <>
              <div className="Math">
                <h3>Select your math class</h3>
                <Math
                  grade={6}
                  handleChangeMath={handleChangeMath}
                  selectedMath={math}
                  classText={Grade7MathClasses}
                />
              </div>

              {math !== "" && (
                <div className="Electives">
                  <h3 style={{ display: "inline" }}>
                    {step === 1 && "Select your Electives"}
                    {step === 2 && "Select your first Alternate Electives"}
                    {step === 3 && "Select your second Alternate Electives"}
                    {step === 4 && "Elective Selection Complete"}
                  </h3>
                  <a href="https://docs.google.com/document/d/1jq-_TGFsGvDMeCvfvazU53r-euJct6tehLowJo8h9no/edit?usp=sharing">
                    Link to descriptions
                  </a>
                  {step !== 4 && (
                    <button onClick={(e) => handleLock(e)}>Lock in</button>
                  )}
                  <div className="electiveContainer">
                    {electives.map((elective, index) => {
                      return (
                        <div className="electivechoice" key={elective.name}>
                          <input
                            type="checkbox"
                            id={elective.name}
                            name={elective.name}
                            value={
                              elective.chosen
                                ? "chosen"
                                : elective.firstAlt
                                ? "first"
                                : "second"
                            }
                            checked={elective.check}
                            onChange={() => handleOnChange(index)}
                            disabled={
                              (currElectives + elective.length > maxElectives &&
                                elective.check === false) ||
                              elective.chosen === true ||
                              elective.firstAlt === true ||
                              step === 4
                            }
                          />
                          <label
                            htmlFor={elective.name}
                            datatooltip={elective.description}
                            className={
                              elective.length === 0.5
                                ? "checklabel half"
                                : "checklabel full"
                            }
                          >
                            {/* <div className="tooltip">
                              <p>{elective.description}</p>
                            </div> */}
                            {elective.name} -{" "}
                            {elective.length === 0.5 ? "semester" : "full year"}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <Schedule
                grade={grade}
                math={math}
                electiveChoices={electiveChoices}
                semElectiveChoices={semElectiveChoices}
                yearElectiveChoices={yearElectiveChoices}
                firstAltElectiveChoices={firstAltElectiveChoices}
                secondAltElectiveChoices={secondAltElectiveChoices}
              />
            </>
          )}
          {grade === 7 && (
            <>
              <div className="Math">
                <h3>Select your math class</h3>
                <Math
                  grade={7}
                  handleChangeMath={handleChangeMath}
                  selectedMath={math}
                  classText={Grade8MathClasses}
                />
              </div>

              {math !== "" && (
                <div className="Electives">
                  <h3 style={{ display: "inline" }}>
                    {step === 1 && "Select your Electives"}
                    {step === 2 && "Select your first Alternate Electives"}
                    {step === 3 && "Select your second Alternate Electives"}
                    {step === 4 && "Elective Selection Complete"}
                  </h3>
                  {step !== 4 && (
                    <button onClick={(e) => handleLock(e)}>Lock in</button>
                  )}
                  <div className="electiveContainer">
                    {electives.map((elective, index) => {
                      return (
                        <div className="electivechoice">
                          <input
                            type="checkbox"
                            id={elective.name}
                            name={elective.name}
                            key={elective.name}
                            checked={elective.check}
                            onChange={() => handleOnChange(index)}
                            value={
                              elective.chosen
                                ? "chosen"
                                : elective.firstAlt
                                ? "first"
                                : "second"
                            }
                            disabled={
                              (currElectives + elective.length > maxElectives &&
                                elective.check === false) ||
                              elective.chosen === true ||
                              elective.firstAlt === true ||
                              step === 4
                            }
                          />
                          <label
                            htmlFor={elective.name}
                            title={elective.description}
                            datatooltip={elective.description}
                            className={
                              elective.length === 0.5
                                ? "checklabel half"
                                : "checklabel full"
                            }
                          >
                            {elective.name} -{" "}
                            {elective.length === 0.5 ? "semester" : "full year"}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <Schedule
                grade={grade}
                math={math}
                electiveChoices={electiveChoices}
                semElectiveChoices={semElectiveChoices}
                yearElectiveChoices={yearElectiveChoices}
                firstAltElectiveChoices={firstAltElectiveChoices}
                secondAltElectiveChoices={secondAltElectiveChoices}
              />
            </>
          )}
        </div>
        <div className="submitinfo">
          {step === 4 && (
            <>
              <label htmlFor="lunchnumber">Lunch Number</label>
              <input
                type="number"
                id="lunchnumber"
                name="lunchnumber"
                className="textbox"
                max={99999}
                min={11111}
                value={lunchNumber}
                required
                onChange={(e) => setLunchNumber(e.target.value)}
              />
              {step === 4 && <button disabled={step !== 4}>Submit</button>}
            </>
          )}
          <input
            type="hidden"
            name="Timestamp"
            value={new Date().toISOString()}
          />
        </div>
        <input type="hidden" id="Name" name="Name" value={name}></input>
        <input type="hidden" id="Email" name="Email" value={email}></input>
      </form>
    </div>
  ) : (
    <Schedule
      grade={grade}
      math={math}
      quarterElectiveChoices={quarterElectiveChoices}
      electiveChoices={electiveChoices}
      semElectiveChoices={semElectiveChoices}
      yearElectiveChoices={yearElectiveChoices}
      firstAltElectiveChoices={firstAltElectiveChoices}
      secondAltElectiveChoices={secondAltElectiveChoices}
    />
  );
}

export default App;

function displayElective({ styles, name }) {
  return <div className={styles}> name</div>;
}

function Math({ grade, handleChangeMath, selectedMath, classText }) {
  return (
    <>
      {classText.map((text, index) => {
        return (
          <div key={text} className="radio-button-wrapper">
            <input
              type="radio"
              id={text}
              name="Math"
              value={selectedMath}
              checked={selectedMath === text}
              onChange={() => handleChangeMath(text)}
            />
            <label htmlFor={text} className="radiolabel">
              {text}
            </label>
          </div>
        );
      })}
    </>
  );
}

function Schedule({
  grade,
  math,
  electiveChoices,
  quarterElectiveChoices,
  semElectiveChoices,
  yearElectiveChoices,
  firstAltElectiveChoices,
  secondAltElectiveChoices,
}) {
  if (math !== "" && grade === 5) {
    return (
      <div className="Schedule">
        <div className="column">
          <div className="colheader">Block</div>
          <div className="class">1st block</div>
          <div className="class">2nd block</div>
          <div className="class">3rd block</div>
          <div className="class">4th block</div>
        </div>
        <div className="column">
          <div className="colheader">A Day</div>
          <div className="core class">Language Arts</div>
          <div className="core class">{math}</div>
          <div className="full class">Health/PE</div>
          <div className="core class">Science</div>
        </div>
        <div className="column">
          <div className="colheader">B Day</div>
          <div className="core class">Language Arts</div>
          <div className="core class">{math}</div>
          {/* Elective block 5th start ***************************** */}

          {quarterElectiveChoices.map((elective) => {
            return <div className="class quarter">{elective.name}</div>;
          })}

          {quarterElectiveChoices.length === 0 &&
            yearElectiveChoices.length === 0 && (
              <>
                <div className="class ">elective block</div>
              </>
            )}

          {quarterElectiveChoices.length === 1 && (
            <>
              <div className="class threequarterclass">elective block</div>
            </>
          )}
          {quarterElectiveChoices.length === 2 && (
            <>
              <div className="class halfclass">elective block</div>
            </>
          )}
          {quarterElectiveChoices.length === 3 && (
            <>
              <div className="class quarterclass">elective block</div>
            </>
          )}
          {yearElectiveChoices.length === 1 && (
            <div className="class full">{yearElectiveChoices[0].name}</div>
          )}

          <div className="core class">History</div>
        </div>
        <div className="column">
          <div className="colheader">Alternates</div>
          {firstElectiveChoices &&
            firstAltElectiveChoices.map((elective) => {
              return (
                <p key={elective.name} className="altclass">
                  {elective.name}
                </p>
              );
            })}
          {secondAltElectiveChoices &&
            secondAltElectiveChoices.map((elective) => {
              return (
                <p key={elective.name} className="altclass">
                  {elective.name}
                </p>
              );
            })}
        </div>
      </div>
    );
  }
  if (grade === 7 && math !== "") {
    return (
      <div className="Schedule">
        <div className="column">
          <div className="colheader">Block</div>
          <div className="class">1st block</div>
          <div className="class">2nd block</div>
          <div className="class">3rd block</div>
          <div className="class">4th block</div>
        </div>
        <div className="column">
          <div className="colheader">A Day</div>
          <div className="core class">Language Arts</div>
          {/* THIRD ELECTIVE SPOT */}
          {
            <>
              {semElectiveChoices.length + yearElectiveChoices.length * 2 <
                5 && <div className="class">elective block</div>}
              {semElectiveChoices.length === 5 && (
                <>
                  <div className="class half">{semElectiveChoices[4].name}</div>
                  <div className="halfclass">elective block</div>
                </>
              )}
              {semElectiveChoices.length === 6 && (
                <>
                  <div className="class half">{semElectiveChoices[4].name}</div>
                  <div className="class half">{semElectiveChoices[5].name}</div>
                </>
              )}
              {yearElectiveChoices.length === 1 &&
                semElectiveChoices.length + yearElectiveChoices.length * 2 >=
                  5 &&
                semElectiveChoices.length !== 0 && (
                  <div className="class full">
                    {yearElectiveChoices[0].name}
                  </div>
                )}

              {yearElectiveChoices.length === 2 &&
                semElectiveChoices.length + yearElectiveChoices.length * 2 >=
                  5 && (
                  <div className="class full">
                    {yearElectiveChoices[1].name}
                  </div>
                )}
              {yearElectiveChoices.length === 3 && (
                <div className="class full">{yearElectiveChoices[2].name}</div>
              )}
            </>
          }
          <div className="core class">History</div>
          <div className="full class">Health/PE</div>
        </div>
        <div className="column">
          <div className="colheader">B Day</div>
          <div className="core class">{math}</div>

          {/* Elective block start ***************************** */}
          {electiveChoices.length === 0 && (
            <div className="class">elective block</div>
          )}
          {semElectiveChoices.length === 1 && (
            <>
              <div className="class half">{semElectiveChoices[0].name}</div>
              <div className="halfclass">elective block</div>
            </>
          )}
          {semElectiveChoices.length >= 2 && (
            <>
              <div className="class half">{semElectiveChoices[0].name}</div>
              <div className="class half">{semElectiveChoices[1].name}</div>
            </>
          )}
          {yearElectiveChoices.length >= 1 &&
            semElectiveChoices.length === 0 && (
              <div className="class full">{yearElectiveChoices[0].name}</div>
            )}

          <div className="core class">Science</div>
          {
            // Second ELECTIVE SLOT
            <>
              {semElectiveChoices.length + yearElectiveChoices.length * 2 <
                3 && <div className="class">elective block</div>}
              {semElectiveChoices.length === 3 && (
                <>
                  <div className="class half">{semElectiveChoices[2].name}</div>
                  <div className="halfclass">elective block</div>
                </>
              )}
              {semElectiveChoices.length >= 4 && (
                <>
                  <div className="class half">{semElectiveChoices[2].name}</div>
                  <div className="class half">{semElectiveChoices[3].name}</div>
                </>
              )}

              {yearElectiveChoices.length === 1 &&
                semElectiveChoices.length > 0 &&
                semElectiveChoices.length < 3 && (
                  <div className="class full">
                    {yearElectiveChoices[0].name}
                  </div>
                )}

              {yearElectiveChoices.length >= 2 &&
                semElectiveChoices.length === 0 && (
                  <div className="class full">
                    {yearElectiveChoices[1].name}
                  </div>
                )}

              {yearElectiveChoices.length >= 2 &&
                semElectiveChoices.length > 0 &&
                semElectiveChoices.length < 3 && (
                  <div className="class full">
                    {yearElectiveChoices[0].name}
                  </div>
                )}
            </>
          }
        </div>
        <div className="column">
          <div className="colheader">Alternates</div>
          {firstAltElectiveChoices &&
            firstAltElectiveChoices.map((elective) => {
              return (
                <p key={elective.name} className="altclass">
                  {elective.name}
                </p>
              );
            })}
          {secondAltElectiveChoices &&
            secondAltElectiveChoices.map((elective) => {
              return (
                <p key={elective.name} className="altclass">
                  {elective.name}
                </p>
              );
            })}
        </div>
      </div>
    );
  }
  if (grade === 6 && math !== "") {
    return (
      <div className="Schedule">
        <div className="column">
          <div className="colheader">Block</div>
          <div className="class">1st block</div>
          <div className="class">2nd block</div>
          <div className="class">3rd block</div>
          <div className="class">4th block</div>
        </div>
        <div className="column">
          <div className="colheader">A Day</div>
          <div className="core class">Language Arts</div>
          <div className="full class">Health/PE</div>
          <div className="core class">{math}</div>
          <div className="core class">Science</div>
        </div>
        <div className="column">
          <div className="colheader">B Day</div>
          <div className="core class">Language Arts</div>
          {/* Elective block start ***************************** */}
          {electiveChoices.length === 0 && (
            <div className="class">elective block</div>
          )}
          {semElectiveChoices.length === 1 && (
            <>
              <div className="class half">{semElectiveChoices[0].name}</div>
              <div className="halfclass">elective block</div>
            </>
          )}
          {semElectiveChoices.length >= 2 && (
            <>
              <div className="class half">{semElectiveChoices[0].name}</div>
              <div className="class half">{semElectiveChoices[1].name}</div>
            </>
          )}
          {yearElectiveChoices.length >= 1 &&
            semElectiveChoices.length === 0 && (
              <div className="class full">{yearElectiveChoices[0].name}</div>
            )}
          {math === "7th Grade Math" ? (
            <div className="core class">{math}</div>
          ) : (
            <>
              {semElectiveChoices.length + yearElectiveChoices.length * 2 <
                3 && <div className="class">elective block</div>}
              {semElectiveChoices.length === 3 && (
                <>
                  <div className="class half">{semElectiveChoices[2].name}</div>
                  <div className="halfclass">elective block</div>
                </>
              )}
              {semElectiveChoices.length === 4 && (
                <>
                  <div className="class half">{semElectiveChoices[2].name}</div>
                  <div className="class half">{semElectiveChoices[3].name}</div>
                </>
              )}
              {yearElectiveChoices.length === 1 &&
                semElectiveChoices.length <= 2 &&
                semElectiveChoices.length !== 0 && (
                  <div className="class full">
                    {yearElectiveChoices[0].name}
                  </div>
                )}

              {yearElectiveChoices.length === 2 && (
                <div className="class full">{yearElectiveChoices[1].name}</div>
              )}
            </>
          )}
          <div className="core class">History</div>
        </div>
        <div className="column">
          <div className="colheader">Alternates</div>
          {firstAltElectiveChoices.map((elective) => {
            return (
              <p key={elective.name} className="altclass">
                {elective.name}
              </p>
            );
          })}
          {secondAltElectiveChoices.map((elective) => {
            return (
              <p key={elective.name} className="altclass">
                {elective.name}
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

{
  /* <GradeSelection grade={grade} handleSetGrade={handleSetGrade} /> */
}
function GradeSelection({ grade, handleSetGrade, name }) {
  return (
    <div className="gradeSelection">
      <h2>Welcome{" " + name}, select your current grade</h2>
      {/* <input
              type="radio"
              id="5th"
              name="grade"
              value="5"
              checked={grade === 5}
              onChange={() => handleSetGrade(5)}
            />
            <label htmlFor="5th" className="radiolabel">
              5th
            </label> 
             {grade === 5 && (
          <>
            <label for="pet-select">Choose your school:</label>
            <select name="elementary" id="elementary-select">
              <option value="">--Please choose an option--</option>
              <option value="Stone Robinson">Stone Robinson</option>
              <option value="Mountain View">Mountain View</option>
              <option value="Stoney Point">Stoney Point</option>
              <option value="Agnor Hurt">Agnor Hurt</option>
            </select>
          </>
        )}*/}
      <input
        type="radio"
        id="6th"
        name="grade"
        value="6"
        checked={grade === 6}
        onChange={() => handleSetGrade(6)}
      />
      <label htmlFor="6th" className="radiolabel">
        6th
      </label>
      <input
        type="radio"
        id="7th"
        value="7"
        name="grade"
        checked={grade === 7}
        onChange={() => handleSetGrade(7)}
      />
      <label htmlFor="7th" className="radiolabel">
        7th
      </label>

      <button onClick={(e) => handleReset(e)}>Reset Everything</button>
    </div>
  );
}

{
  /* <div className="Core">
                <h3>Required 8th grade classes</h3>
                <input
                  type="checkbox"
                  id="8thla"
                  name="8thla"
                  disabled
                  checked
                />
                <label htmlFor="8thla" className="checklabel">
                  8th Grade Language Arts
                </label>
                <input
                  type="checkbox"
                  id="8thscience"
                  name="8thscience"
                  disabled
                  checked
                />
                <label htmlFor="8thscience" className="checklabel">
                  8th Grade Science
                </label>
                <input
                  type="checkbox"
                  id="8thhistory"
                  name="8thhistory"
                  disabled
                  checked
                />
                <label htmlFor="8thhistory" className="checklabel">
                  8th Grade History
                </label>
              </div> */
}
