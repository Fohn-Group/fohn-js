<script>
import {computed, nextTick, ref, watch} from "vue";
import {useTableStoreFactory} from "./table.store";
import {useDefaultFilterValue} from "./composable/filter";
import {storeToRefs} from "pinia";

export default {
  name: 'fohn-table-filter',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    iconName: String,
    altIconName: String,
    columns: Array,
    operators: Array,
  },

  setup(props, { attrs, slots, emit }) {
    const tableStore = useTableStoreFactory('myid'/* inject('tableStoreId') */)();
    const {iconName, altIconName} = props;
    const isActive = ref(props.isActive);

    const columns = props.columns;
    const operators = props.operators;
    const {filters, activeFilters} = storeToRefs(tableStore);
    if (filters.value.length === 0) {
      tableStore.addFilter(useDefaultFilterValue(columns, operators));
    }

    watch( () => activeFilters.value.length, (newL, oldL) => {
      if (newL < oldL) {
        // one filter is remove.
        tableStore.fetchItems();
      }
    });

    const iconCss = computed(() => ({
      [iconName]: !isActive.value && activeFilters.value.length === 0,
      [altIconName]: isActive.value || activeFilters.value.length > 0,
    }));

    const removeFilter = (id) => {
      tableStore.removeFilter(id);
      if (tableStore.getActiveFilterCount() === 0) {
        isActive.value = false;
        nextTick( () => {
          tableStore.addFilter(useDefaultFilterValue(columns, operators));
        });
      }
    }

    const insertFilter = () => {
      tableStore.addFilter(useDefaultFilterValue(columns, operators));
    }

    /**
     * Fired when a filter column value has changed.
     */
    const updateFilter = (filter) => {
      tableStore.updateFilter(filter);
      tableStore.fetchItems();
    }

    const toggleFilterIcon = () => isActive.value = !isActive.value;

    return {
      iconCss,
      toggleFilterIcon,
      isActive,
      columns,
      operators,
      filters,
      activeFilters,
      removeFilter,
      insertFilter,
      updateFilter,
    }
  }
}

</script>

<template>
  <slot
      :iconCss=iconCss
      :toggleFilterIcon=toggleFilterIcon
      :isActive="isActive"
      :columns="columns"
      :operators="operators"
      :filters="filters"
      :filterCount="activeFilters.length"
      :removeFilter="removeFilter"
      :insertFilter="insertFilter"
      :updateFilter="updateFilter"
      v-bind="$attrs">table filter</slot>
</template>

<style scoped>

</style>