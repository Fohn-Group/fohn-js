<script>

/**
 * Hold the current filter item.
 * filterValue contains the id of the column, the operator and a value.
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

export default {
  name: 'fohn-table-filter-item',
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
      default: () => {}
    },
  },

  setup(props, { attrs, slots, emit }) {

    const {columns, operators, filterValue} = toRefs(props);
    const currentColumnIdx = ref(0);
    const currentOperatorIdx = ref(0);
    const itemValue = ref(filterValue.value.value);

    // Get initial column idx from filterValue if any.
    const initalColunmIdx = columns.value.findIndex( (column) => column.id === filterValue.value.column);
    currentColumnIdx.value = initalColunmIdx > 0 ? initalColunmIdx : 0;


    const columnDef = computed (() => columns.value[currentColumnIdx.value]);
    const itemLabel = computed (() => columnDef.value.label);


    /** Filter operators base on column data type */
    const typeOperators = computed( () => {
      return operators.value.filter( (operator) => {
        return operator.types.includes(columnDef.value.operatorType);
      })
    });

    const initialOperatorIdx = typeOperators.value.findIndex( (operator) => operator.id === filterValue.value.operator);
    currentOperatorIdx.value = initialOperatorIdx > 0 ? initialOperatorIdx : 0;

    const itemOperator = computed (() => typeOperators.value[currentOperatorIdx.value].label);

    /** Get what type of component is required for setting filter value. */
    const itemComponent = computed ( () => {
      const component = {
        id: columnDef.value.componentName,
        props : columnDef.value.props,
      }
      component.props.value = itemValue.value;

      return component;
    });

    /**
     *
     * SetColumn idx and reset operators and value.
     */
    const setColumn = (idx, column) => {
      currentColumnIdx.value = idx;
      currentOperatorIdx.value = 0;
      itemValue.value = '';
    }

    const setOperator = (idx, operator) => {
      currentOperatorIdx.value = idx;
    }

    const setValue = (value) => {
      itemValue.value = value;
    }

    return {itemLabel,
      itemOperator,
      itemValue,
      itemComponent,
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
      :itemLabel="itemLabel"
      :itemOperator="itemOperator"
      :itemValue="itemValue"
      :itemComponent="itemComponent"
      :columns="columns"
      :typeOperators="typeOperators"
      :setColumn="setColumn"
      :setOperator="setOperator"
      :setValue="setValue"
      v-bind="$attrs">filter item</slot>
</template>

<style scoped>

</style>
