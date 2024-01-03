import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { electiveData } from "./utils/electives";
// const { google } = require("googleapis");
// const keys = require("./google.json");

// const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
//   "https://www.googleapis.com/auth/spreadsheets",
// ]);

// client.authorize(function (err, tokens) {
//   if (err) {
//     console.log(err);
//     return;
//   } else {
//     console.log("Connected!");
//     gsrun(client);
//   }
// });

function App() {
  const [grade, setGrade] = useState(0);
  const [math, setMath] = useState("");
  const [electives, setElectives] = useState(electiveData);
  const [step, setStep] = useState(1);
  const [lunchNumber, setLunchNumber] = useState(0);

  let maxElectives = 0;
  if (grade === 6) maxElectives = (math === "7thalgebra" ? 2 : 1) + step - 1;
  else maxElectives = 3 + step - 1;
  console.log("Max electives", maxElectives);

  function handleMath(mathclass) {
    setMath(mathclass);
    // if (grade === 7) setElectives(electiveData);
  }
  function handleSetGrade(g) {
    console.log("selected grade", g);

    setMath("");
    setStep(1);
    setElectives(electiveData);
    setGrade(g);
    setElectives(electiveData.filter((e) => e.grade.includes(g + 1)));
  }

  const currElectives = electives.reduce(
    (accumulator, elective) =>
      accumulator + (elective.check && elective.length),
    0
  );
  console.log(currElectives);
  const electiveChoices = electives.filter(
    (elective) =>
      elective.check === true &&
      elective.firstAlt === false &&
      elective.secondAlt === false
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

  if (semElectiveChoices) console.log("Sem", semElectiveChoices);
  if (yearElectiveChoices) console.log("Year", yearElectiveChoices);

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

  console.log("step", step);
  console.log("first alts", firstAltElectiveChoices);
  console.log("electives", electives);
  const handleOnChange = (position) => {
    const updatedElectives = electives.map((elective, index) => {
      if (index === position) {
        return { ...elective, check: !elective.check };
      }
      return elective;
    });

    setElectives(updatedElectives);
  };

  function handleReset(e) {
    e.preventDefault();

    setMath("");
    setStep(1);
    setElectives(electiveData);
  }

  function handleLock(e) {
    e.preventDefault();
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

  function handleSubmit(e) {
    e.preventDefault();

    let temp = electives.filter((elective) => elective.chosen === true)[0];
    const firstElec = temp ? temp.name : "";
    temp = electives.filter((elective) => elective.chosen === true)[1];
    const secElec = temp ? temp.name : "";
    temp = electives.filter((elective) => elective.chosen === true)[2];
    const thirdElec = temp ? temp.name : "";
    temp = electives.filter((elective) => elective.chosen === true)[3];
    const fourthElec = temp ? temp.name : "";
    temp = electives.filter((elective) => elective.chosen === true)[4];
    const fifthElec = temp ? temp.name : "";
    temp = electives.filter((elective) => elective.chosen === true)[5];
    const sixthElec = temp ? temp.name : "";

    temp = electives.filter((elective) => elective.firstAlt === true)[0];
    const firstFirstAlt = temp ? temp.name : "";
    temp = electives.filter((elective) => elective.firstAlt === true)[1];
    const secFirstAlt = temp ? temp.name : "";

    temp = electives.filter((elective) => elective.secondAlt === true)[0];
    const firstSecAlt = temp ? temp.name : "";
    temp = electives.filter((elective) => elective.secondAlt === true)[1];
    const secSecAlt = temp ? temp.name : "";

    const data = {
      lunchNumber,
      grade,
      math,
      elec1: firstElec,
      elec2: secElec,
      elec3: thirdElec,
      elec4: fourthElec,
      elec5: fifthElec,
      elec6: sixthElec,
      firstPrimaryAlt: firstFirstAlt,
      secPrimaryAlt: secFirstAlt,
      firstSecondaryAlt: firstSecAlt,
      secSecondaryAlt: secSecAlt,
    };
    console.log("Data", data);
  }
  return (
    <div className="container">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="gradeSelection">
          <h2>Select your current grade</h2>
          <div className="mathcontainer">
            <input
              type="radio"
              id="5th"
              name="grade"
              checked={grade === 5}
              onChange={() => handleSetGrade(5)}
            />
            <label htmlFor="5th" className="radiolabel">
              5th
            </label>
            <input
              type="radio"
              id="6th"
              name="grade"
              checked={grade === 6}
              onChange={() => handleSetGrade(6)}
            />
            <label htmlFor="6th" className="radiolabel">
              6th
            </label>
            <input
              type="radio"
              id="7th"
              name="grade"
              checked={grade === 7}
              onChange={() => handleSetGrade(7)}
            />
            <label htmlFor="7th" className="radiolabel">
              7th
            </label>
          </div>
        </div>
        <div className="coreClasses">
          {grade === 6 && (
            <>
              {/* <Math grade={6} handleChangeMath={setMath7th} /> */}
              <div className="Math">
                <h3>Select your math class</h3>
                <input
                  type="radio"
                  id="7thmath"
                  name="7thmath"
                  checked={math === "7thmath"}
                  onChange={() => setMath("7thmath")}
                />
                <label htmlFor="7thmath" className="radiolabel">
                  7th Grade Math
                </label>
                <input
                  type="radio"
                  id="7thalgebra"
                  name="7thmath"
                  checked={math === "7thalgebra"}
                  onChange={() => setMath("7thalgebra")}
                />
                <label htmlFor="7thalgebra" className="radiolabel">
                  7th Grade Algebra
                </label>
              </div>

              <div className="Core">
                <h3>Required 7th grade classes</h3>
                <input
                  type="checkbox"
                  id="7thla"
                  name="7thla"
                  disabled
                  checked
                />
                <label htmlFor="7thla" className="checklabel">
                  7th Grade Language Arts
                </label>
                <input
                  type="checkbox"
                  id="7thscience"
                  name="7thscience"
                  disabled
                  checked
                />
                <label htmlFor="7thscience" className="checklabel">
                  7th Grade Science
                </label>
                <input
                  type="checkbox"
                  id="7thhistory"
                  name="7thhistory"
                  disabled
                  checked
                />
                <label htmlFor="7thhistory" className="checklabel">
                  7th Grade History
                </label>
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
              {math !== "" && (
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
                        <div className="class half">
                          {semElectiveChoices[0].name}
                        </div>
                        <div className="halfclass">elective block</div>
                      </>
                    )}
                    {semElectiveChoices.length >= 2 && (
                      <>
                        <div className="class half">
                          {semElectiveChoices[0].name}
                        </div>
                        <div className="class half">
                          {semElectiveChoices[1].name}
                        </div>
                      </>
                    )}
                    {yearElectiveChoices.length >= 1 &&
                      semElectiveChoices.length === 0 && (
                        <div className="class full">
                          {yearElectiveChoices[0].name}
                        </div>
                      )}
                    {math === "7thmath" ? (
                      <div className="core class">{math}</div>
                    ) : (
                      <>
                        {semElectiveChoices.length +
                          yearElectiveChoices.length * 2 <
                          3 && <div className="class">elective block</div>}
                        {semElectiveChoices.length === 3 && (
                          <>
                            <div className="class half">
                              {semElectiveChoices[2].name}
                            </div>
                            <div className="halfclass">elective block</div>
                          </>
                        )}
                        {semElectiveChoices.length === 4 && (
                          <>
                            <div className="class half">
                              {semElectiveChoices[2].name}
                            </div>
                            <div className="class half">
                              {semElectiveChoices[3].name}
                            </div>
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
                          <div className="class full">
                            {yearElectiveChoices[1].name}
                          </div>
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
              )}
            </>
          )}
          {grade === 7 && (
            <>
              <div className="Math">
                <h3>Select your math class</h3>
                <input
                  type="radio"
                  id="8thmath"
                  name="8thmath"
                  checked={math === "8thmath"}
                  onChange={() => setMath("8thmath")}
                />
                <label htmlFor="8thmath" className="radiolabel">
                  8th Grade Math
                </label>
                <input
                  type="radio"
                  id="8thalgebra"
                  name="8thalgebra"
                  checked={math === "8thalgebra"}
                  onChange={() => setMath("8thalgebra")}
                />
                <label htmlFor="8thalgebra" className="radiolabel">
                  8th Grade Algebra
                </label>
                <input
                  type="radio"
                  id="8thgeometry"
                  name="8thgeometry"
                  checked={math === "8thgeometry"}
                  onChange={() => setMath("8thgeometry")}
                />
                <label htmlFor="8thgeometry" className="radiolabel">
                  8th Grade Geometry
                </label>
              </div>

              <div className="Core">
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
              {math !== "" && (
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
                        {semElectiveChoices.length +
                          yearElectiveChoices.length * 2 <
                          5 && <div className="class">elective block</div>}
                        {semElectiveChoices.length === 5 && (
                          <>
                            <div className="class half">
                              {semElectiveChoices[4].name}
                            </div>
                            <div className="halfclass">elective block</div>
                          </>
                        )}
                        {semElectiveChoices.length === 6 && (
                          <>
                            <div className="class half">
                              {semElectiveChoices[4].name}
                            </div>
                            <div className="class half">
                              {semElectiveChoices[5].name}
                            </div>
                          </>
                        )}
                        {yearElectiveChoices.length === 1 &&
                          semElectiveChoices.length +
                            yearElectiveChoices.length * 2 >=
                            5 &&
                          semElectiveChoices.length !== 0 && (
                            <div className="class full">
                              {yearElectiveChoices[0].name}
                            </div>
                          )}

                        {yearElectiveChoices.length === 2 &&
                          semElectiveChoices.length +
                            yearElectiveChoices.length * 2 >=
                            5 && (
                            <div className="class full">
                              {yearElectiveChoices[1].name}
                            </div>
                          )}
                        {yearElectiveChoices.length === 3 && (
                          <div className="class full">
                            {yearElectiveChoices[2].name}
                          </div>
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
                        <div className="class half">
                          {semElectiveChoices[0].name}
                        </div>
                        <div className="halfclass">elective block</div>
                      </>
                    )}
                    {semElectiveChoices.length >= 2 && (
                      <>
                        <div className="class half">
                          {semElectiveChoices[0].name}
                        </div>
                        <div className="class half">
                          {semElectiveChoices[1].name}
                        </div>
                      </>
                    )}
                    {yearElectiveChoices.length >= 1 &&
                      semElectiveChoices.length === 0 && (
                        <div className="class full">
                          {yearElectiveChoices[0].name}
                        </div>
                      )}

                    <div className="core class">History</div>
                    {
                      // Second ELECTIVE SLOT
                      <>
                        {semElectiveChoices.length +
                          yearElectiveChoices.length * 2 <
                          3 && <div className="class">elective block</div>}
                        {semElectiveChoices.length === 3 && (
                          <>
                            <div className="class half">
                              {semElectiveChoices[2].name}
                            </div>
                            <div className="halfclass">elective block</div>
                          </>
                        )}
                        {semElectiveChoices.length >= 4 && (
                          <>
                            <div className="class half">
                              {semElectiveChoices[2].name}
                            </div>
                            <div className="class half">
                              {semElectiveChoices[3].name}
                            </div>
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
              )}
            </>
          )}
        </div>
        {grade !== "" && (
          <>
            <label htmlFor="lunchnumber">Lunch Number</label>
            <input
              type="number"
              id="lunchnumber"
              name="lunchnumber"
              className="textbox"
              maxLength={5}
              minLength={5}
              value={lunchNumber}
              required
              onChange={(e) => setLunchNumber(e.target.value)}
            />

            <button disabled={step !== 4}>Submit</button>
            <button onClick={(e) => handleReset(e)}>Reset Everything</button>
          </>
        )}
      </form>
    </div>
  );
}

export default App;

function displayElective({ styles, name }) {
  return <div className={styles}> name</div>;
}

// function Math ({grade})
// {
//   return (

//   )
// }
