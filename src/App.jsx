import { useState } from "react";
import GameScreen from "./components/GameScreen";
import StartScreen from "./components/StartUi";



function App() {
  const [screen, setScreen] = useState("start"); // start | game

  return (
    <>
      {screen === "start" && (
        <StartScreen onStart={() => setScreen("game")} />
      )}

      {screen === "game" && (
        <GameScreen onEnd={() => setScreen("start")} />
      )}
    </>
  );
}

export default App;