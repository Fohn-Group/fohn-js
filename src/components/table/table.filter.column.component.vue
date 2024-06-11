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
 *    operatorType: 'text'  // the type of operator need for the operators list
 *    'props' : {} // The value component props. When component is input, this represented the html input attrs.
 *  }
 *
 * Operators contains an array of operator definition
 *  - operator is an object: {id: 'operatorId', label: 'operatorLabel', types: [number, text]}
 *  - types array contains all datatype that the operator can be used with.
 *
 */
import {computed, ref, toRefs, watch} from "vue";
import {useFindIndexDefault} from "../utils/composable/utils";

export default {
  name: 'fohn-table-filter-column',
  emits: ['onRemove', 'onAdd', 'onUpdate'],
  props: {
    columns : {
      type: Array,
      default: () => [],
    },
    operators : {
      type: Array,
      default: () => [],
    },
    /**
     * Contains all value need for filtering a column.
     *   key:
     *    filterId: '1', // unique internal number (use for v-for loop)
     *    column: 'name', // the name of the column to apply filtering on.
     *    operator: 'opName', // The operator to apply on the value.
     *    value: 'value' // the value to apply for the column filtering.
     *    requiredValue: true or false // whether the operator required a value or not, ex: isEmpty.
     *
     */
    filterValue: {
      type: Object,
    },
  },

  setup(props, { attrs, slots, emit }) {

    const columns = props.columns;
    // const filterValue = props.filterValue;
    const {operators, filterValue} = toRefs(props);
    const currentOperatorIdx = ref(0);

    // Get initial column idx from filterValue if any.
    const currentColumnIdx = ref(useFindIndexDefault(columns, (column) => column.id === filterValue.value.column));

    // Get columnDef and id base on current idx value.
    const columnDef = computed (() => columns[currentColumnIdx.value]);
    const columnId = computed (() => columnDef.value.id);

    /** Filter operators base on column data type */
    const typeOperators = computed( () => {
      return operators.value.filter( (operator) => {
        return operator.types.includes(columnDef.value.operatorType);
      })
    });

    currentOperatorIdx.value = useFindIndexDefault(typeOperators.value, (operator) => operator.id === filterValue.value.operator);

    const columnOperator = computed (() => typeOperators.value[currentOperatorIdx.value].id);
    const columnRequiredValue = computed (() => typeOperators.value[currentOperatorIdx.value].requiredValue);

    /** Get what type of component is required for setting filter value. */
    const columnComponent = ref({
      id: columnDef.value.componentName,
      props : {...columnDef.value.props, value: filterValue.value.value},
    });

    watch(() => filterValue.value.value, (oldV, newV) => {
      if (newV !== oldV) {
        emit('onUpdate', filterValue);
      }
    });

    /**
     *
     * SetColumn idx and reset operators and value.
     */
    const setColumn = (idx) => {
      currentColumnIdx.value = idx;
      currentOperatorIdx.value = 0;
      columnComponent.value = {
        id: columnDef.value.componentName,
        props : {...columnDef.value.props, value: ''},
      }

      filterValue.value.column = columns[currentColumnIdx.value].id;
      filterValue.value.operator = typeOperators.value[currentOperatorIdx.value].id;
      setValue('');
    }

    const setOperator = (idx) => {
      currentOperatorIdx.value = idx;
      filterValue.value.operator = typeOperators.value[currentOperatorIdx.value].id;
      filterValue.value.requiredValue = columnRequiredValue.value;
      setValue('');
    }

    const setValue = (value) => {
      columnComponent.value.props.value = value;

      filterValue.value.value = value === '' ? null : value;
    }

    const deleteFilter = (filterId) => {
      emit('onRemove', filterId);
    }

    const addFilter = () => {
      emit('onAdd');
    }

    return {
      columnId,
      columnOperator,
      columnComponent,
      columnRequiredValue,
      columns,
      typeOperators,
      setColumn,
      setOperator,
      setValue,
      deleteFilter,
      addFilter,
      currentOperatorIdx}
  }
}
</script>

<template>
  <slot
      :columnId="columnId"
      :columnOperator="columnOperator"
      :columnComponent="columnComponent"
      :columnRequiredValue="columnRequiredValue"
      :columns="columns"
      :typeOperators="typeOperators"
      :setColumn="setColumn"
      :setOperator="setOperator"
      :setValue="setValue"
      :deleteFilter="deleteFilter"
      :addFilter="addFilter"
      v-bind="$attrs">filter item</slot>
</template>

<style scoped>

</style>
