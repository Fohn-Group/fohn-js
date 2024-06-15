/**
 * Return an array index matching the testing function (fn)
 * If no index is found, then return a default one.
 *
 */
const useFindIndexDefault = (ar, fn, defaultIdx = 0) => {
  let idx = ar.findIndex(fn);
  if (idx === -1) {
    idx = defaultIdx;
  }

  return idx;
};

export { useFindIndexDefault };
