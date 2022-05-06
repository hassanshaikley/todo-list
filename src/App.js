import { proxy, useSnapshot } from "valtio";

const generateId = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);

const state = proxy({
  filter: "all",
  todos: [
    {
      id: generateId(),
      title: "Fart",
      last_completed: "never",
      frequency: "daily",
    },
  ],
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
    todo.last_completed = Date.now();
  } else {
    todo.last_completed = "never";
  }
  // todo.completed = !todo.completed;
};

const useFilteredTodos = () => {
  const { filter, todos } = useSnapshot(state);
  if (filter === "all") {
    return todos;
  }
  if (filter === "completed") {
    return todos.filter((todo) => todo.last_completed != "never");
  }
  return todos.filter((todo) => todo.last_completed == "never");
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
      checked={todo.last_completed != "never"}
      onChange={() => toggleTodo(todo.id)}
    />
    <span
      style={{
        textDecoration: todo.last_completed != "never" ? "line-through" : "",
      }}
    >
      {todo.title}
    </span>
    <button onClick={() => removeTodo(todo.id)}>Delete</button>
  </div>
);

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
