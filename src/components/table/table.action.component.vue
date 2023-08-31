<script>
import {useTableStoreFactory} from "./table.store";
import {computed, inject, ref, toRefs} from "vue";

export default {
  name: 'fohn-table-action',
  props: {
    actionUrl: String,
    tableRowsSelected: Number,
    isTableFetching: Boolean,
  },

  setup(props, { attrs, slots, emit }) {
    const {actionUrl} = props;
    const {isTableFetching, tableRowsSelected} = toRefs(props);
    const tableStore = useTableStoreFactory(inject('tableStoreId'))();

    const isEnable = computed(() => tableRowsSelected.value > 0);

    const execute = (event) => {
      if (!isTableFetching.value) {
        tableStore.executeAction(actionUrl, event?.currentTarget);
      }
    }

    return {execute, isEnable, isTableFetching, tableRowsSelected}
  }
}
</script>

<template>
  <slot
      :isTableFetching="isTableFetching"
      :tableRowsSelected="tableRowsSelected"
      :execute="execute"
      :isEnable="isEnable"
      v-bind="$attrs">table action</slot>
</template>
