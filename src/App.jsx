import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { electiveData } from "./utils/electives";

function App() {
  const [grade, setGrade] = useState("5th");
  const [math7th, setMath7th] = useState("");
  const [electives, setElectives] = useState(electiveData);
  const [step, setStep] = useState(1);
  const maxElectives = (math7th === "7thalgebra" ? 2 : 1) + step - 1;

  console.log("Max electives", maxElectives);

  const currElectives = electives.reduce(
    (accumulator, elective) =>
      accumulator + (elective.check && elective.length),
    0
  );

  console.log("curr electives", currElectives);

  const electiveChoices = electives.filter(
    (elective) => elective.check === true
  );
  const semElectiveChoices = electives.filter(
    (elective) => elective.check === true && elective.length === 0.5
  );

  const yearElectiveChoices = electives.filter(
    (elective) => elective.check === true && elective.length === 1
  );

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

  function handleLock(e) {
    e.preventDefault();
    if (step === 1) {
      const updatedElectives = electives.map((elective) =>
        elective.check ? { ...elective, chosen: true } : elective
      );
      setElectives(updatedElectives);
    }
    if (step === 2) {
      const updatedElectives = electives.map((elective) =>
        elective.check && !elective.chosen
          ? { ...elective, chosen: true }
          : elective
      );
      setElectives(updatedElectives);
    }
    if (step === 3) {
      const updatedElectives = electives.map((elective) =>
        elective.check && !elective.chosen
          ? { ...elective, chosen: true }
          : elective
      );
      setElectives(updatedElectives);
    }

    if (step !== 4) setStep(() => step + 1);
  }

  return (
    <div className="container">
      <form>
        <div className="gradeSelection">
          <h2>Select your current grade</h2>
          <div className="mathcontainer">
            <input
              type="radio"
              id="6th"
              name="grade"
              value="6th"
              onChange={() => setGrade("6th")}
            />
            <label htmlFor="6th" className="radiolabel">
              6th
            </label>
            <input
              type="radio"
              id="7th"
              name="grade"
              value="7th"
              onChange={() => setGrade("7th")}
            />
            <label htmlFor="7th" className="radiolabel">
              7th
            </label>
          </div>
        </div>
        <div className="coreClasses">
          {grade === "6th" && (
            <>
              <div className="Math">
                <h3>Select your math class</h3>
                <input
                  type="radio"
                  id="7thmath"
                  name="7thmath"
                  checked={math7th === "7thmath"}
                  onChange={() => setMath7th("7thmath")}
                />
                <label htmlFor="7thmath" className="radiolabel">
                  7th Grade Math
                </label>
                <input
                  type="radio"
                  id="7thalgebra"
                  name="7thalgebra"
                  checked={math7th === "7thalgebra"}
                  onChange={() => setMath7th("7thalgebra")}
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
              <div className="Schedule">
                <div className="column">
                  Block
                  <div className="class">1st block</div>
                  <div className="class">2nd block</div>
                  <div className="class">3rd block</div>
                  <div className="class">4th block</div>
                </div>
                <div className="column">
                  A Day
                  <div className="core class">Language Arts</div>
                  <div className="full class">Health/PE</div>
                  <div className="core class">{math7th}</div>
                  <div className="core class">Science</div>
                </div>
                <div className="column">
                  B Day
                  <div className="core class">Language Arts</div>
                  {/* Elective block start ***************************** */}
                  {electiveChoices.length === 0 && (
                    <div className="class">elective block</div>
                  )}
                  {semElectiveChoices.length === 1 && (
                    <>
                      <div className="class half">
                        {electiveChoices[0].name}
                      </div>
                      <div className="halfclass">elective block</div>
                    </>
                  )}
                  {semElectiveChoices.length >= 2 && (
                    <>
                      <div className="class half">
                        {electiveChoices[0].name}
                      </div>
                      <div className="class half">
                        {electiveChoices[1].name}
                      </div>
                    </>
                  )}
                  {yearElectiveChoices.length >= 1 &&
                    semElectiveChoices.length === 0 && (
                      <div className="class full">
                        {electiveChoices[0].name}
                      </div>
                    )}
                  {math7th === "7thmath" ? (
                    <div className="core class">{math7th}</div>
                  ) : (
                    <>
                      {semElectiveChoices.length +
                        yearElectiveChoices.length * 2 <
                        3 && <div className="class">elective block</div>}
                      {semElectiveChoices.length === 3 && (
                        <>
                          <div className="class half">
                            {electiveChoices[2].name}
                          </div>
                          <div className="halfclass">elective block</div>
                        </>
                      )}
                      {semElectiveChoices.length === 4 && (
                        <>
                          <div className="class half">
                            {electiveChoices[2].name}
                          </div>
                          <div className="class half">
                            {electiveChoices[3].name}
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
                <div className="column">Alternates</div>
              </div>
            </>
          )}
          {grade === "7th" && (
            <>
              <p>to be determined</p>
            </>
          )}
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;

function displayElective({ styles, name }) {
  return <div className={styles}> name</div>;
}
