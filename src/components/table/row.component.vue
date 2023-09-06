<script>
import {computed, inject, toRefs} from "vue";
import {useTableStoreFactory} from "./table.store";

export default {
  name: 'fohn-table-row',
  props: {
    // storeId: String,
    hasSelection: {
      type: Boolean,
      default: false,
    },
    row: Object,
  },
  emits: {},
  setup: function (props, { attrs, slots, emit }) {
    const { hasSelection: isActionable } = props;
    const { row } = toRefs(props);
    const tableStore = useTableStoreFactory(inject('tableStoreId'))();

    const isEvenRow = (idx) => (idx % 2) === 0;
    const isSelected = computed(() => tableStore.isRowSelected(row.value.id));

    const toggleRow = (id) => {
      tableStore.toggleRow(id);
    }
    return { row, isEvenRow, isActionable, isSelected, toggleRow };
  },
};
</script>

<template>
  <slot
      :row="row"
      :isEvenRow="isEvenRow"
      :isActionable="isActionable"
      :isSelected="isSelected"
      :toggleRow="toggleRow"
      v-bind="$attrs">row</slot>
</template>

<style scoped>

</style>
