/**
 *
 * Return filter default value using the first column and the first available operator
 * for this first column.
 */

import isEqual from 'lodash.isequal';

function useDefaultFilterValue(columns, operators) {
  const columnDef = columns[0];

  const columnOperators = operators.filter((operator) => {
    return operator.types.includes(columnDef.operatorType);
  });

  return {
    column: columnDef.id,
    operator: columnOperators[0].id,
    requiredValue: columnOperators[0].requiredValue,
    value: null,
  };
}

/**
 *  While filters hold internal filter component data, activeFilters hold
 *  the real filters data to be sent to server. It will only return filter that
 *  are set with a value or filter where operate does not need a value.
 *
 */
function useActiveFilters(filters) {
  return filters.filter((f) => {
    return (f.value !== null && f.requiredValue) || !f.requiredValue;
  }).map((filter) => {
    return { column: filter.column, operator: filter.operator, value: filter.value };
  });
}

function useIsFiltersEqual(filter1, filter2) {
  // check for length first.
  if (filter1.length !== filter2.length) {
    return false;
  }

  const copyF1 = [...filter1];
  const copyF2 = [...filter2];
  let isEqualValue = true;
  copyF1.sort((a, b) => a.filterId - b.filterId);
  copyF2.sort((a, b) => a.filterId - b.filterId);

  for (let i = 0; i < copyF1.length; i++) {
    if (!isEqual(copyF1[i], copyF2[i])) {
      isEqualValue = false;
      break;
    }
  }

  return isEqualValue;
}

function useNextFilterId(filters) {
  let maxId = 0;

  if (filters.length > 0) {
    maxId = filters[0].filterId;
    for (let i = 1; i < filters.length; i++) {
      if (filters[i].filterId > maxId) {
        maxId = filters[i].filterId;
      }
    }
  }

  return maxId + 1;
}

/**
 * Add a default filter to Filters array.
 * Filters is a ref array containing FilterValue.
 * @param filters
 * @param columns
 * @param operators
 */
function useAddDefaultFilter(filters, columns, operators) {
  filters.value.push({ ...useDefaultFilterValue(columns, operators), filterId: useNextFilterId(filters.value) });
}

export { useDefaultFilterValue, useIsFiltersEqual, useNextFilterId, useAddDefaultFilter, useActiveFilters };
