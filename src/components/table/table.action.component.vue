<script>
import {useTableStoreFactory} from "./table.store";
import {inject, ref, toRefs} from "vue";

export default {
  name: 'fohn-table-action',
  props: {
    actionUrl: String,
    isTableFetching: Boolean,
  },

  setup(props, { attrs, slots, emit }) {
    const {actionUrl} = props;
    const {isTableFetching} = toRefs(props);
    const isEnable = ref(false);
    const tableStore = useTableStoreFactory(inject('tableStoreId'))();

    tableStore.$subscribe((mutation, state) => {
      isEnable.value = state.selectedRows.size > 0;
    });

    const execute = (event) => {
      if (!isTableFetching.value) {
        tableStore.executeAction(actionUrl, event.currentTarget);
      }
    }

    return {execute, isEnable, isTableFetching}
  }
}

</script>

<template>
  <slot
      :isTableFetching="isTableFetching"
      :execute="execute"
      :isEnable="isEnable"
      v-bind="$attrs">table action</slot>
</template>
