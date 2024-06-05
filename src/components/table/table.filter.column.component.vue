<script>

/**
 * Single column filtering management.
 * User can select a column, an operator to act on the selected column and a value.
 *
 * Columns contains an array of column definition to be filtered.
 * - column definition is an object:
 * {
 *    id: 'name',
 *    label: 'Name',
 *    componentName: 'input' // the component name use to set filter value, either input or flat-pickr
 *    operatorType: 'text'  // the type of data need for the operators list
 *    'props' : {} // The value component props. When component is input, this represented the html input attrs.
 *  }
 *
 * Operators contains an array of operator definition
 *  - operator is an object: {id: 'operatorId', label: 'operatorLabel', types: [number, text]}
 *  - types array contains all datatype that the operator can be used with.
 *
 */
import {computed, ref, toRefs} from "vue";
import {useFindIndexDefault} from "../utils/composable/utils";

export default {
  name: 'fohn-table-filter-column',
  props: {
    columns : {
      type: Array,
      default: () => [],
    },
    operators : {
      type: Array,
      default: () => [],
    },
    filteredColumns: {
      type: Array,
      default: () => []
    },
  },

  setup(props, { attrs, slots, emit }) {

    const {columns, operators, filteredColumns} = toRefs(props);
    // const currentColumnIdx = ref(0);
    const currentOperatorIdx = ref(0);
    const columnValue = ref();

    // Get initial column idx from filteredColumn if any.
    // eslint-disable-next-line max-len
    const currentColumnIdx = ref(useFindIndexDefault(columns.value, (column) => column.id === filteredColumns.value.column));

    // Get columnDef and id base on current idx value.
    const columnDef = computed (() => columns.value[currentColumnIdx.value]);
    const columnId = computed (() => columnDef.value.id);

    /** Filter operators base on column data type */
    const typeOperators = computed( () => {
      return operators.value.filter( (operator) => {
        return operator.types.includes(columnDef.value.operatorType);
      })
    });

    // eslint-disable-next-line max-len
    currentOperatorIdx.value = useFindIndexDefault(typeOperators.value, (operator) => operator.id === filteredColumns.value.operator);

    const columnOperator = computed (() => typeOperators.value[currentOperatorIdx.value].id);

    /** Get what type of component is required for setting filter value. */
    const columnComponent = computed ( () => {
      const component = {
        id: columnDef.value.componentName,
        props : columnDef.value.props,
      }
      component.props.value = columnValue.value;

      return component;
    });

    /**
     *
     * SetColumn idx and reset operators and value.
     */
    const setColumn = (idx, column) => {
      currentColumnIdx.value = idx;
      currentOperatorIdx.value = 0;
      columnValue.value = '';
    }

    const setOperator = (idx) => {
      currentOperatorIdx.value = idx;
    }

    const setValue = (value) => {
      columnValue.value = value;
    }

    return {columnId,
      columnOperator,
      columnComponent,
      columns,
      typeOperators,
      setColumn,
      setOperator,
      setValue,
      currentOperatorIdx}
  }
}
</script>

<template>
  <slot
      :columnId="columnId"
      :columnOperator="columnOperator"
      :columnComponent="columnComponent"
      :columns="columns"
      :typeOperators="typeOperators"
      :setColumn="setColumn"
      :setOperator="setOperator"
      :setValue="setValue"
      v-bind="$attrs">filter item</slot>
</template>

<style scoped>

</style>
