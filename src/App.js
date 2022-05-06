import { useSnapshot } from "valtio";
import spacetime from "spacetime";
import state from "./state";

import { generateId } from "./utils";

window.spacetime = spacetime;
let colorA = "0x32373B";
let colorB = "0x4A5859";
let colorC = "0xF4D6CC";
let colorD = "0xF4B860";
let colorE = "0xC83E4D";

const addTodo = (title, last_completed, frequency) => {
  if (!title) {
    return;
  }
  const id = generateId();
  state.todos.push({
    id,
    title,
    last_completed,
    frequency,
    last_skipped: "never",
  });
};

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

const useFilteredTodos = () => {
  const { filter, todos, skipFilter } = useSnapshot(state);

  return todos
    .filter((todo) => {
      return (
        filter == "all" ||
        (filter === "completed" && checkIfCompleted(todo)) ||
        (filter == "incompleted" && !checkIfCompleted(todo))
      );
    })
    .filter((todo) => {
      return (
        skipFilter == "all" ||
        (skipFilter == "skipped" && checkIfSkipped(todo)) ||
        (skipFilter == "revealed" && !checkIfSkipped(todo))
      );
    });
};

const TodoItem = ({ todo }) => (
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

const checkIfCompleted = ({ last_completed, frequency }) => {
  let s = spacetime.now();

  if (last_completed == "never") return false;

  last_completed = spacetime(last_completed);

  if (frequency == "once") {
    return true;
  } else if (frequency == "daily") {
    return last_completed.diff(s, "days") <= 1;
  } else if (frequency == "weekly") {
    return last_completed.diff(s, "days") <= 7;
  } else if (frequency == "monthly") {
    return last_completed.diff(s, "days") <= 30;
  }
};

const checkIfSkipped = ({ last_skipped }) => {
  if (last_skipped == "never") return false;

  let s = spacetime.now();
  last_skipped = spacetime(last_skipped);

  return last_skipped.diff(s, "days") <= 1;
};

const Filter = () => {
  const { filter, skipFilter } = useSnapshot(state);
  const handleChange = (e) => {
    state.filter = e.target.value;
  };
  const handleFilterChange = (e) => {
    state.skipFilter = e.target.value;
  };
  return (
    <div>
      <div style={{ float: "left" }}>Filters</div>

      <select name="filter" onChange={handleChange} value={state.filter}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incompleted">Incompleted</option>
      </select>
      <select
        name="skip-filter"
        onChange={handleFilterChange}
        value={state.skipFilter}
      >
        <option value="all">All</option>
        <option value="revealed">Revealed</option>
        <option value="skipped">Skipped</option>
      </select>
    </div>
  );
};

const TodoList = () => {
  const filtered = useFilteredTodos();
  const add = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    e.target.title.value = "";
    const frequency = e.target.frequency.value;

    addTodo(title, "never", frequency);
  };
  return (
    <div style={{ maxWidth: "fit-content", margin: "auto" }}>
      <Filter />
      <div style={{ float: "left" }}>New</div>

      <form onSubmit={add}>
        <input name="title" placeholder="Enter title..." />

        <select name="frequency" id="frequency">
          <option value="once">Once</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </form>
      {filtered.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;
