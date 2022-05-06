import { generateId, checkIfCompleted, checkIfSkipped } from "./utils";
import spacetime from "spacetime";

import state from "./state";

const removeTodo = (id) => {
  state.todos = state.todos.filter((todo) => todo.id !== id);
};

const toggleSkipTodo = (id) => {
  const todo = state.todos.find((todo) => todo.id === id);
  if (todo.last_skipped == "never") {
    todo.last_skipped = spacetime.now().unixFmt("yyyy.MM.dd h:mm a");
  } else {
    todo.last_skipped = "never";
  }
};

const toggleTodo = (id) => {
  const todo = state.todos.find((todo) => todo.id === id);
  if (todo.last_completed == "never") {
    todo.last_completed = spacetime.now().unixFmt("yyyy.MM.dd h:mm a");
  } else {
    todo.last_completed = "never";
  }
};

export default ({ todo }) => (
  <div
    style={{
      gridTemplateColumns:
        "fit-content(100px) 200px fit-content(100px) fit-content(100px) fit-content(100px)",
      display: "grid",
      columnGap: "5px",
      // borderBottom: "3px solid black",
      // borderRight: "3px solid black",
      width: "400px",
      padding: "2px",
    }}
  >
    <input
      type="checkbox"
      checked={checkIfCompleted(todo)}
      onChange={() => toggleTodo(todo.id)}
    />
    <span
      style={{
        textDecoration: checkIfCompleted(todo) ? "line-through" : "",
      }}
    >
      {todo.title}
    </span>
    <button
      onClick={() => {
        toggleSkipTodo(todo.id);
      }}
    >
      {checkIfSkipped(todo) ? "Unskip" : "Skip"}
    </button>
    <button onClick={() => {}} style={{ textTransform: "capitalize" }}>
      {todo.frequency}
    </button>

    <button onClick={() => removeTodo(todo.id)}>Delete</button>
  </div>
);
