import { useState, useCallback } from "react";

export default function useHistory(initialState) {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = useCallback((action, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;

    if (overwrite) {
      const copy = [...history];
      copy[index] = newState;
      setHistory(copy);
    } else {
      const updated = history.slice(0, index + 1);
      setHistory([...updated, newState]);
      setIndex((i) => i + 1);
    }
  }, [history, index]);

  const undo = useCallback(() => {
    if (index > 0) setIndex((i) => i - 1);
  }, [index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) setIndex((i) => i + 1);
  }, [index, history.length]);

  return [history[index], setState, undo, redo, index, history.length];
}