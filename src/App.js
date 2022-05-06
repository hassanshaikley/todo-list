import { useSnapshot } from "valtio";
import spacetime from "spacetime";
import state from "./state";

import { generateId, checkIfCompleted, checkIfSkipped } from "./utils";
import TodoItem from "./TodoItem";

window.spacetime = spacetime;
// let colorA = "0x32373B";
// let colorB = "0x4A5859";
// let colorC = "0xF4D6CC";
// let colorD = "0xF4B860";
// let colorE = "0xC83E4D";

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

const Filter = () => {
  // const { filter, skipFilter } = useSnapshot(state);
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
