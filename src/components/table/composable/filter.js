/**
 *
 * Return filter default value using the first column and the first available operator
 * for this first column.
 */

import isEqual from "lodash.isequal";

function useDefaultFilterValue(columns, operators) {
  const columnDef = columns[0];

  const columnOperators = operators.filter( (operator) => {
    return operator.types.includes(columnDef.operatorType);
  });

  return {
    column: columnDef.id,
    operator: columnOperators[0].id,
    requiredValue: columnOperators[0].requiredValue,
    value: null,
  }
}

function useIsFiltersEqual(filter1, filter2) {
  // check for length first.
  if (filter1.length !== filter2.length) {
    return false;
  }

  const copyF1 = [...filter1];
  const copyF2 = [...filter2];
  let isEqualValue = true;
  copyF1.sort( (a,b) => a.filterId - b.filterId);
  copyF2.sort( (a,b) => a.filterId - b.filterId);

  for (let i = 0; i < copyF1.length; i++) {
    if (!isEqual(copyF1[i],copyF2[i])) {
      isEqualValue = false;
      break;
    }
  }

  return isEqualValue;
}

export {useDefaultFilterValue, useIsFiltersEqual}
