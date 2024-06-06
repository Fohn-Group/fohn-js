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
import {computed, reactive, ref, toRaw, toRefs} from "vue";
import {useFindIndexDefault} from "../utils/composable/utils";

export default {
  name: 'fohn-table-filter-column',
  emits: ['onRemove', 'onAdd'],
  props: {
    columns : {
      type: Array,
      default: () => [],
    },
    operators : {
      type: Array,
      default: () => [],
    },
    filterValue: {
      type: Object,
    },
  },

  setup(props, { attrs, slots, emit }) {

    const columns = [...props.columns];
    const filterValue = {...props.filterValue};
    const {operators} = toRefs(props);
    // const currentColumnIdx = ref(0);
    const currentOperatorIdx = ref(0);
    const columnValue = ref(filterValue.value);

    // Get initial column idx from filterValue if any.
    // eslint-disable-next-line max-len
    const currentColumnIdx = ref(useFindIndexDefault(columns, (column) => column.id === filterValue.column));

    // Get columnDef and id base on current idx value.
    const columnDef = computed (() => columns[currentColumnIdx.value]);
    const columnId = computed (() => columnDef.value.id);

    /** Filter operators base on column data type */
    const typeOperators = computed( () => {
      return operators.value.filter( (operator) => {
        return operator.types.includes(columnDef.value.operatorType);
      })
    });

    // eslint-disable-next-line max-len
    currentOperatorIdx.value = useFindIndexDefault(typeOperators.value, (operator) => operator.id === filterValue.operator);

    const columnOperator = computed (() => typeOperators.value[currentOperatorIdx.value].id);

    /** Get what type of component is required for setting filter value. */
    const columnComponent = ref({
      id: columnDef.value.componentName,
      props : {...columnDef.value.props, value: columnValue.value},
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
      // columnValue.value = '';
    }

    const setOperator = (idx) => {
      currentOperatorIdx.value = idx;
    }

    const setValue = (value) => {
      // columnValue.value = value;
      columnComponent.value.props.value = value;
    }

    const deleteFilter = (idx) => {
      emit('onRemove', idx);
    }

    const addFilter = () => {
      const columnDef = columns[0];
      const columnOperators = operators.value.filter( (operator) => {
        return operator.types.includes(columnDef.operatorType);
      });

      const filter = {
        column: columnDef.id,
        operator: columnOperators[0].id,
        value: '',
      }
      emit('onAdd', filter);
    }

    return {columnId,
      columnOperator,
      columnValue,
      columnComponent,
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
      :columnValue="columnValue"
      :columnComponent="columnComponent"
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
