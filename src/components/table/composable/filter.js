/**
 *
 * Return filter default value using the first column and the first available operator
 * for this first column.
 */
function useDefaultFilterValue(columns, operators) {
  const columnDef = columns[0];

  const columnOperators = operators.filter( (operator) => {
    return operator.types.includes(columnDef.operatorType);
  });

  return {
    column: columnDef.id,
    operator: columnOperators[0].id,
    value: '',
  }
}

export {useDefaultFilterValue}
