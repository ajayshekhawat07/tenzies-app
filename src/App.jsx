import { useState, useRef, useEffect } from "react";
import Die from "./components/Die";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const buttonRef = useRef(null);

  let gameWon = false;

  gameWon =
    dice.every((die) => die.isHeld === true) &&
    dice.every((die) => die.value === dice[0].value);

  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon]);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  function generateAllNewDice() {
    const randomNumbers = [];

    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * 6 + 1);
      randomNumbers.push({ id: i, value: randomNumber, isHeld: false });
    }

    return randomNumbers;
  }

  function rollDice() {
    if (!gameWon) {
      setDice((prevDice) =>
        prevDice.map((die) => {
          if (die.isHeld === false) {
            return { ...die, value: Math.floor(Math.random() * 6 + 1) };
          } else {
            return die;
          }
        }),
      );
    } else {
      setDice(generateAllNewDice());
    }
  }

  function hold(id) {
    setDice((prevDice) =>
      prevDice.map((die) => {
        if (die.id === id) {
          return { ...die, isHeld: !die.isHeld };
        } else {
          return die;
        }
      }),
    );
  }

  return (
    <>
      {gameWon && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          style={{
            position: "fixed", // Ensure it overlays the entire screen
            top: 0,
            left: 0,
            zIndex: 1000, // Higher than other elements
          }}
        />
      )}

      <main className="grid min-h-full sm:grid-cols-2">
        <div className="col-span-1 min-h-[100vh] bg-[#1e1e24]">
          <div className={"flex h-1/2 items-center justify-center"}>
            <h1 className={"text-[5rem] font-light sm:text-[5rem]"}>Tenzies</h1>
          </div>
          <div className={"flex h-1/2 items-start justify-center"}>
            <p
              className={
                "w-3/4 text-center text-xl font-light text-gray-400 sm:text-2xl"
              }
            >
              Roll until all dice are the same. Click each die to freeze it at
              its current value between rolls
            </p>
          </div>
        </div>

        <div className="col-span-1 min-h-[100vh] bg-[#6547eb]">
          <div
            className={
              "flex h-9/11 flex-col items-center justify-center sm:h-3/4"
            }
          >
            <div className={"flex items-center justify-center"}>
              <div className={"rounded-2xl bg-white shadow-2xl"}>
                <div
                  className={
                    "mx-12 my-6 grid grid-cols-2 gap-4 sm:mx-8 sm:my-12 sm:grid-cols-5"
                  }
                >
                  {dice.map((die) => (
                    <Die
                      key={die.id}
                      value={die.value}
                      isHeld={die.isHeld}
                      onClick={() => hold(die.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={"mt-8"}>
              <button
                ref={buttonRef}
                onClick={rollDice}
                className={
                  "btn h-[3rem] w-[10rem] border-none bg-white text-2xl font-medium text-[#6547eb]"
                }
              >
                {gameWon ? "New Game" : "Roll"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
