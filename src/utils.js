import spacetime from "spacetime";

export const generateId = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);

export const checkIfCompleted = ({ last_completed, frequency }) => {
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

export const checkIfSkipped = ({ last_skipped }) => {
  if (last_skipped == "never") return false;

  let s = spacetime.now();
  last_skipped = spacetime(last_skipped);

  return last_skipped.diff(s, "days") <= 1;
};
