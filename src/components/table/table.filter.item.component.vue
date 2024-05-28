<script>


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
    filterValue: Object,
  },

  setup(props, { attrs, slots, emit }) {

    const {columns, operators} = toRefs(props);

    /* Hold the current column data type */
    const columnType = ref('text');

    /** Filter operators base on column data type */
    const typeOperators = computed( () => {
      return operators.value.filter( (operator) => {
        return operator.type.includes(columnType.value);
      })
    });

    const setColumn = (column) => {
      columnType.value = 'number';
    }

    const setOperator = (operator) => {
    }

    return {columns, typeOperators, setColumn, setOperator}
  }
}
</script>

<template>
  <slot
      :columns="columns"
      :typeOperators="typeOperators"
      :setColumn="setColumn"
      :setOperator="setOperator"
      v-bind="$attrs">filter item</slot>
</template>

<style scoped>

</style>
