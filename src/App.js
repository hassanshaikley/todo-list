import { proxy, useSnapshot, subscribe, snapshot } from "valtio";
import spacetime from "spacetime";

const generateId = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);

let state;

if (localStorage.getItem("store") == null) {
  state = proxy({
    filter: "all",
    todos: [
      {
        id: generateId(),
        title: "Fart",
        // last_completed: "never",
        last_completed: spacetime
          .now()
          .subtract(8, "days")
          .unixFmt("yyyy.MM.dd h:mm a"),
        frequency: "weekly",
      },
    ],
  });
} else {
  const thing = localStorage.getItem("store");
  const thingJson = JSON.parse(thing);
  console.log(thingJson);
  state = proxy(thingJson);
}

const unsubscribe = subscribe(state, () => {
  const stateSnapshot = snapshot(state);
  console.log("Saving state to store");

  const storeString = JSON.stringify({
    todos: stateSnapshot.todos,
    filter: stateSnapshot.filter,
  });
  localStorage.setItem("store", storeString);
});

const addTodo = (title, last_completed, frequency) => {
  if (!title) {
    return;
  }
  const id = generateId();
  state.todos.push({ id, title, last_completed, frequency });
};

const removeTodo = (id) => {
  state.todos = state.todos.filter((todo) => todo.id !== id);
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
  const { filter, todos } = useSnapshot(state);
  if (filter === "all") {
    return todos;
  }
  if (filter === "completed") {
    return todos.filter((todo) => checkIfCompleted(todo));
  }
  return todos.filter((todo) => !checkIfCompleted(todo));
};

const TodoItem = ({ todo }) => (
  <div
    style={{
      gridTemplateColumns: "fit-content(100px) 200px fit-content(100px)",
      display: "grid",
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
    <button onClick={() => removeTodo(todo.id)}>Delete</button>
  </div>
);

const checkIfCompleted = ({ last_completed, frequency }) => {
  let s = spacetime.now();

  if (last_completed == "never") return false;

  last_completed = s.time(last_completed);
  console.log(last_completed);

  if (frequency == "once") {
    return true;
  } else if (frequency == "daily") {
    console.log(last_completed.diff(s, "days"));

    return last_completed.diff(s, "days") <= 1;
  } else if (frequency == "weekly") {
    console.log(last_completed.diff(s, "days"));
    return last_completed.diff(s, "days") <= 7;
  } else if (frequency == "monthly") {
    return last_completed.diff(s, "days") <= 30;
  }
};

const Filter = () => {
  const { filter } = useSnapshot(state);
  const handleChange = (e) => {
    state.filter = e.target.value;
  };
  return (
    <div>
      <label>
        <input
          type="radio"
          value="all"
          checked={filter === "all"}
          onChange={handleChange}
        />
        All
      </label>
      <label>
        <input
          type="radio"
          value="completed"
          checked={filter === "completed"}
          onChange={handleChange}
        />
        Completed
      </label>
      <label>
        <input
          type="radio"
          value="incompleted"
          checked={filter === "incompleted"}
          onChange={handleChange}
        />
        Incompleted
      </label>
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
    <div>
      <Filter />
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
