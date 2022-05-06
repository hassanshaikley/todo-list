import { useSnapshot } from "valtio";
import spacetime from "spacetime";
import state from "./state";

import { generateId, checkIfCompleted, checkIfSkipped } from "./utils";
import TodoList from "./TodoList";

// let colorA = "0x32373B";
// let colorB = "0x4A5859";
// let colorC = "0xF4D6CC";
// let colorD = "0xF4B860";
// let colorE = "0xC83E4D";

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;
