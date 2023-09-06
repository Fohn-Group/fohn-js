<script>
import {useTableStoreFactory} from "./table.store";
import {computed, inject, toRefs} from "vue";
import {toReactive} from "@vueuse/core";

export default {
  name: 'fohn-table-action',
  props: {
    actionUrl: String,
    tableRowsSelected: Number,
    isTableFetching: Boolean,
    placeHolder: {
      type: String,
      default: '{#}',
    },
    messages: {
      type: Object,
      default: () => ({none: '', single: '', multiple: ''})
    }
  },

  setup(props, { attrs, slots, emit }) {
    const {actionUrl, placeHolder} = props;
    const {isTableFetching, tableRowsSelected } = toRefs(props);
    const {messages} = toReactive(props);
    const tableStore = useTableStoreFactory(inject('tableStoreId'))();

    const isEnable = computed(() => tableRowsSelected.value > 0);
    const actionMsg = computed(() => {
      if (tableRowsSelected.value === 0) {
        return messages.none || '';
      }
      if (tableRowsSelected.value === 1 && messages.single) {
        return messages.single.replace(placeHolder, tableRowsSelected.value);
      }
      if (tableRowsSelected.value > 1 && messages.multiple) {
        return messages.multiple.replace(placeHolder, tableRowsSelected.value);
      }

      return '';
    });
    const execute = (event) => {
      if (!isTableFetching.value) {
        tableStore.executeAction(actionUrl, event?.currentTarget);
      }
    }

    return {execute, isEnable, isTableFetching, tableRowsSelected, actionMsg}
  }
}
</script>

<template>
  <slot
      :isTableFetching="isTableFetching"
      :tableRowsSelected="tableRowsSelected"
      :execute="execute"
      :isEnable="isEnable"
      :actionMsg="actionMsg"
      v-bind="$attrs">table action</slot>
</template>
