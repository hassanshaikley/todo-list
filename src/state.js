import { proxy, subscribe, snapshot } from "valtio";
import spacetime from "spacetime";
import { generateId } from "./utils";

let state;

if (localStorage.getItem("store") == null) {
  state = proxy({
    filter: "all",
    skipFilter: "all",
    todos: [
      {
        id: generateId(),
        title: "Read for 5 minutes",
        // last_completed: "never",
        last_completed: spacetime
          .now()
          .subtract(8, "days")
          .unixFmt("yyyy.MM.dd h:mm a"),
        last_skipped: "never",
        frequency: "daily",
      },
    ],
  });
} else {
  const thing = localStorage.getItem("store");
  const thingJson = JSON.parse(thing);

  state = proxy(thingJson);
}

subscribe(state, () => {
  const stateSnapshot = snapshot(state);

  const storeString = JSON.stringify({
    todos: stateSnapshot.todos,
    filter: stateSnapshot.filter,
    skipFilter: stateSnapshot.skipFilter,
  });
  localStorage.setItem("store", storeString);
});

export default state;
